'use client';

import { useEffect, useRef, useState } from 'react';
import { Conversation } from '@elevenlabs/client';
import Grainient from './Grainient';
import { track } from '../lib/analytics';

/**
 * Voice demo orb — ElevenLabs Agents edition.
 *
 * Replaced the Vapi SDK after repeated breakage (rotated keys, deleted
 * assistants → "VOICE CALL FAILED" on the live site). Same orb, same states,
 * same CSS contract (`data-vapi-state` attribute name kept — landing.css keys
 * 10 selectors off it); only the transport changed.
 *
 * The agent is a PUBLIC ElevenLabs agent, so the ID is safe in the client
 * bundle and no API key ships to the browser. Lock abuse down in the
 * ElevenLabs dashboard instead: Agent → Security → allowlist goproxe.com.
 */
const AGENT_ID = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID ?? '';
const agentConfigured = AGENT_ID !== '' && !AGENT_ID.startsWith('PASTE_');

type OrbState = 'idle' | 'connecting' | 'listening' | 'speaking' | 'ending';

const LABELS: Record<OrbState, string> = {
  idle: 'Click to talk',
  connecting: 'Connecting…',
  listening: 'Live',
  speaking: 'Live',
  ending: 'Ending…',
};

/* ---------- Connecting ring -------------------------------------------------
 * Single arc that fills 0→100% over ~1.2s (one-shot), then settles into a
 * steady full ring with a subtle glow pulse until the session connects
 * (state transitions to 'listening' and this component unmounts).
 * -------------------------------------------------------------------------- */
function ConnectingRing() {
  return (
    <svg className="proxe-voice-orb-connecting" viewBox="0 0 240 240" aria-hidden="true">
      <circle
        cx="120"
        cy="120"
        r="112"
        fill="none"
        stroke="rgba(205, 252, 46, 0.18)"
        strokeWidth="3"
      />
      <circle
        className="proxe-voice-orb-connecting-arc"
        cx="120"
        cy="120"
        r="112"
        fill="none"
        stroke="#CDFC2E"
        strokeWidth="3"
        strokeLinecap="round"
        pathLength={100}
        transform="rotate(-90 120 120)"
      />
    </svg>
  );
}

interface VapiOrbProps {
  /** Notified true while a call is connecting/live, false when idle. Lets a
   *  parent (e.g. the channel carousel) avoid auto-advancing mid-call. */
  onActiveChange?: (active: boolean) => void;
}

type Session = Awaited<ReturnType<typeof Conversation.startSession>>;

/**
 * How much louder than unity to play the agent.
 *
 * The PROXe voice (txk8uOzZ0iCh0B9mFSRG — the same one that makes the outbound
 * calls) is mastered far quieter than the voice it replaced. Rendering the same
 * sentence through both and measuring the raw PCM:
 *
 *     old voice   RMS -17.5 dBFS   peak 0.86
 *     PROXe voice RMS -36.0 dBFS   peak 0.098
 *
 * ~18 dB down, i.e. about an eighth of the amplitude. That is the voice's own
 * mastering, not the transport — it measures the same over WebRTC and over SIP.
 * `use_speaker_boost` recovers only ~0.5 dB, so it is not the lever.
 *
 * There is no output-gain knob on the ElevenLabs side, and `session.setVolume()`
 * can't help: VoiceConversation clamps it to 0–1 and 1 is already the default.
 * The underlying output controller's own setVolume does NOT clamp, and it
 * stores the value on a field that playAudio re-applies to the gain node on
 * every chunk — so setting it there survives the stream.
 *
 * That voice has since been replaced by Aryaveer (648Ei7uQJOUMPaz1Tdpc), which
 * measures -21.9 dBFS / peak 0.770 — a normal master. The 5.5x correction it
 * needed is therefore GONE: applying it here would drive peak 0.770 to 4.2 and
 * clip hard against the destination.
 *
 * 1.2x is a small lift for laptop speakers, landing peak at ~0.92 with headroom
 * intact. Re-measure before changing this or the voice: the safe gain is
 * whatever puts the loudest peak just under 1.0.
 */
const OUTPUT_GAIN = 1.2;

/** Reaches past the public API into the output controller; feature-detected so
    an SDK rename degrades to normal volume rather than throwing mid-call. */
function boostOutput(session: Session) {
  try {
    const out = (session as unknown as { output?: { setVolume?: (v: number) => void } }).output;
    if (out && typeof out.setVolume === 'function') out.setVolume(OUTPUT_GAIN);
  } catch {
    /* Non-fatal: the call still works, just at stock volume. */
  }
}

export default function VapiOrb({ onActiveChange }: VapiOrbProps = {}) {
  const sessionRef = useRef<Session | null>(null);
  const [state, setState] = useState<OrbState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);

  const isActiveRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  /** Smoothed 0–1 amplitude of whoever is currently speaking. */
  const levelRef = useRef(0);

  const stopVolumePolling = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    wrapRef.current?.style.setProperty('--orb-level', '0');
  };

  /**
   * Audio-reactive loop.
   *
   * Two jobs, one rAF:
   *  • drives `--orb-level` from the LIVE amplitude of whoever is talking, so
   *    the orb actually moves with the voice instead of running a fixed
   *    animation — the agent's own output volume when it speaks, the mic when
   *    the visitor does.
   *  • detects user speech (the SDK's onModeChange only reports the AGENT's
   *    mode, so the cool halo needs its own signal).
   *
   * Smoothing is asymmetric on purpose: attack fast so consonants land, decay
   * slow so it settles instead of strobing. Written straight to a CSS custom
   * property — no React state per frame.
   */
  const startVolumePolling = () => {
    stopVolumePolling();
    let userSpeaking = false;

    const tick = async () => {
      const session = sessionRef.current;
      if (!session || !isActiveRef.current) return;

      try {
        const [inVol, outVol] = await Promise.all([
          session.getInputVolume(),
          session.getOutputVolume(),
        ]);

        // Whoever is louder owns the orb this frame.
        const speaking = outVol > 0.02 || inVol > 0.06;
        const raw = Math.min(1, Math.max(outVol, inVol * 0.9) * 2.2);

        const prev = levelRef.current;
        const smoothing = raw > prev ? 0.45 : 0.12; // fast attack, slow release
        const next = prev + (raw - prev) * smoothing;
        levelRef.current = next;
        wrapRef.current?.style.setProperty('--orb-level', next.toFixed(3));
        wrapRef.current?.style.setProperty('--orb-active', speaking ? '1' : '0');

        const nowUserSpeaking = inVol > 0.06 && inVol > outVol;
        if (nowUserSpeaking !== userSpeaking) {
          userSpeaking = nowUserSpeaking;
          setIsUserSpeaking(nowUserSpeaking);
        }
      } catch {
        /* amplitude is cosmetic — never let it break the call */
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  const teardown = () => {
    isActiveRef.current = false;
    stopVolumePolling();
    setIsUserSpeaking(false);
    sessionRef.current = null;
  };

  // End any live session if the orb unmounts mid-call (channel switch etc.).
  useEffect(() => {
    return () => {
      const session = sessionRef.current;
      teardown();
      if (session) {
        session.endSession().catch(() => {
          /* already gone */
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Report call activity up: any non-idle state means a call is in progress.
  useEffect(() => {
    onActiveChange?.(state !== 'idle');
  }, [state, onActiveChange]);

  // If the orb unmounts mid-call, clear the flag so the parent can resume.
  useEffect(() => () => onActiveChange?.(false), [onActiveChange]);

  const handleClick = async () => {
    if (state === 'connecting' || state === 'ending') return;

    // Live → end the call.
    if (isActiveRef.current) {
      const session = sessionRef.current;
      setState('ending');
      try {
        await session?.endSession();
      } catch (err) {
        console.error('[VoiceOrb] end failed', err);
      }
      teardown();
      setState('idle');
      return;
    }

    if (!agentConfigured) {
      setError('Voice demo not configured');
      return;
    }

    setError(null);
    setState('connecting');
    track('voice_demo_start');

    try {
      // Mic permission first — a clearer failure than a mid-connect error.
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const session = await Conversation.startSession({
        agentId: AGENT_ID,
        onConnect: () => {
          isActiveRef.current = true;
          setState('listening');
          setError(null);
          startVolumePolling();
        },
        onDisconnect: () => {
          teardown();
          setState('idle');
        },
        onModeChange: (mode: { mode: string }) => {
          if (!isActiveRef.current) return;
          setState(mode.mode === 'speaking' ? 'speaking' : 'listening');
        },
        onError: (message: unknown) => {
          console.error('[VoiceOrb] error', message);
          teardown();
          setError(typeof message === 'string' ? message : 'Voice call failed');
          setState('idle');
        },
      });
      sessionRef.current = session;
      boostOutput(session);
    } catch (err) {
      console.error('[VoiceOrb] start failed', err);
      teardown();
      const isMicDenied =
        typeof err === 'object' && err !== null && (err as { name?: string }).name === 'NotAllowedError';
      setError(isMicDenied ? 'Microphone access is needed for the voice demo' : 'Could not start call');
      setState('idle');
    }
  };

  const isBusy = state === 'connecting' || state === 'ending';
  const isLive = state === 'listening' || state === 'speaking';
  const showAssistantWave = state === 'speaking';
  const showUserWave = state === 'listening' && isUserSpeaking;

  // Dataset for CSS to differentiate cool (user) vs warm (assistant) glow.
  const speakerAttr: 'user' | 'assistant' | 'idle' =
    showAssistantWave ? 'assistant' : showUserWave ? 'user' : 'idle';

  return (
    <div className="proxe-voice-orb-wrap" ref={wrapRef}>
      <button
        type="button"
        className="proxe-voice-orb"
        aria-label={isLive ? 'End voice call' : 'Start voice call'}
        aria-busy={isBusy}
        data-vapi-state={state}
        data-speaker={speakerAttr}
        disabled={state === 'ending'}
        onClick={handleClick}
      >
        {state === 'connecting' ? <ConnectingRing /> : null}
        {/* Voice-reactive halo — opacity/scale driven by --orb-level. */}
        <span className="proxe-voice-orb-glow" aria-hidden="true" />
        <span className="proxe-voice-orb-ring" aria-hidden="true" />
        <span className="proxe-voice-orb-inner" aria-hidden="true">
          <Grainient
            color1="#7C3AED"
            color2="#4C1D95"
            color3="#1E1B4B"
            timeSpeed={0.9}
            warpStrength={1.2}
            warpFrequency={6}
            warpSpeed={3}
            warpAmplitude={30}
            blendAngle={20}
            blendSoftness={0.2}
            rotationAmount={800}
            noiseScale={2.5}
            grainAmount={0.06}
            grainScale={3}
            grainAnimated
            contrast={1.4}
            gamma={1}
            saturation={1.1}
            zoom={0.7}
          />
        </span>
        <span className="proxe-voice-orb-shine" aria-hidden="true" />
        <span className="proxe-voice-orb-rim" aria-hidden="true" />
      </button>

      <div className="proxe-voice-orb-label" data-live={isLive}>
        {isLive ? <span className="proxe-voice-orb-livedot" aria-hidden="true" /> : null}
        <span>{LABELS[state]}</span>
      </div>

      {error ? (
        <div className="proxe-voice-orb-error" role="alert">
          {error}
        </div>
      ) : null}
    </div>
  );
}
