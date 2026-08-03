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

export default function VapiOrb({ onActiveChange }: VapiOrbProps = {}) {
  const sessionRef = useRef<Session | null>(null);
  const [state, setState] = useState<OrbState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);

  const isActiveRef = useRef(false);
  const volumeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopVolumePolling = () => {
    if (volumeTimerRef.current) {
      clearInterval(volumeTimerRef.current);
      volumeTimerRef.current = null;
    }
  };

  /**
   * User-speaking detection: the SDK's onModeChange only reports the AGENT's
   * mode, so we poll mic input volume while live and light the cool halo when
   * the visitor is talking.
   */
  const startVolumePolling = () => {
    stopVolumePolling();
    volumeTimerRef.current = setInterval(async () => {
      const session = sessionRef.current;
      if (!session || !isActiveRef.current) return;
      try {
        const volume = await session.getInputVolume();
        setIsUserSpeaking(volume > 0.08);
      } catch {
        /* volume is cosmetic — never let it break the call */
      }
    }, 250);
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
    <div className="proxe-voice-orb-wrap">
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
