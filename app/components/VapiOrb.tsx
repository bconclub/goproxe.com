'use client';

import { useEffect, useRef, useState } from 'react';
import Vapi from '@vapi-ai/web';
import Grainient from './Grainient';

const PUBLIC_API_KEY = 'f2b9a58e-d2c8-427b-847c-fc54a87c6a61';
const ASSISTANT_ID = 'be61e583-de32-4df8-a04f-104f6c3a7b6e';

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
 * steady full ring with a subtle glow pulse until call-start fires (state
 * transitions to 'listening' and this component unmounts).
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

export default function VapiOrb() {
  const vapiRef = useRef<Vapi | null>(null);
  const [state, setState] = useState<OrbState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);

  const isActiveRef = useRef(false);
  const userSpeakTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear the user-speaking debounce timer.
  const clearUserSpeakTimer = () => {
    if (userSpeakTimerRef.current) {
      clearTimeout(userSpeakTimerRef.current);
      userSpeakTimerRef.current = null;
    }
  };

  useEffect(() => {
    const vapi = new Vapi(PUBLIC_API_KEY);
    vapiRef.current = vapi;

    const handleCallStart = () => {
      isActiveRef.current = true;
      setState('listening');
      setError(null);
    };
    const handleCallEnd = () => {
      isActiveRef.current = false;
      setState('idle');
      setIsUserSpeaking(false);
      clearUserSpeakTimer();
    };
    const handleSpeechStart = () => {
      // Vapi's `speech-start` is the assistant starting to speak.
      if (isActiveRef.current) setState('speaking');
    };
    const handleSpeechEnd = () => {
      if (isActiveRef.current) setState('listening');
    };
    /**
     * Vapi message stream — we use it to detect *user* speaking.
     * Partial user transcripts arrive while the user talks; we set
     * isUserSpeaking=true on each one and clear it 700ms after the last.
     */
    const handleMessage = (msg: unknown) => {
      const m = msg as { type?: string; role?: string };
      if (!m || typeof m !== 'object') return;
      if (m.type === 'transcript' && m.role === 'user') {
        setIsUserSpeaking(true);
        clearUserSpeakTimer();
        userSpeakTimerRef.current = setTimeout(() => setIsUserSpeaking(false), 700);
      }
    };
    const handleError = (err: unknown) => {
      console.error('[VapiOrb] error', err);
      isActiveRef.current = false;
      setError(
        typeof err === 'object' && err && 'message' in err
          ? String((err as { message?: unknown }).message ?? 'Voice call failed')
          : 'Voice call failed'
      );
      setState('idle');
      setIsUserSpeaking(false);
      clearUserSpeakTimer();
    };

    vapi.on('call-start', handleCallStart);
    vapi.on('call-end', handleCallEnd);
    vapi.on('speech-start', handleSpeechStart);
    vapi.on('speech-end', handleSpeechEnd);
    vapi.on('message', handleMessage);
    vapi.on('error', handleError);

    return () => {
      vapi.off('call-start', handleCallStart);
      vapi.off('call-end', handleCallEnd);
      vapi.off('speech-start', handleSpeechStart);
      vapi.off('speech-end', handleSpeechEnd);
      vapi.off('message', handleMessage);
      vapi.off('error', handleError);
      clearUserSpeakTimer();
      try {
        vapi.stop();
      } catch {
        /* no-op */
      }
      vapiRef.current = null;
    };
  }, []);

  const handleClick = async () => {
    const vapi = vapiRef.current;
    if (!vapi) return;
    if (state === 'connecting' || state === 'ending') return;

    if (isActiveRef.current) {
      setState('ending');
      try {
        vapi.stop();
      } catch (err) {
        console.error('[VapiOrb] stop failed', err);
        isActiveRef.current = false;
        setState('idle');
      }
      return;
    }

    setError(null);
    setState('connecting');
    try {
      await vapi.start(ASSISTANT_ID);
    } catch (err) {
      console.error('[VapiOrb] start failed', err);
      setError(
        typeof err === 'object' && err && 'message' in err
          ? String((err as { message?: unknown }).message ?? 'Could not start call')
          : 'Could not start call'
      );
      isActiveRef.current = false;
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
          {/* Wave overlay removed per user feedback — the spinning waves
              were redundant with the Grainient swirl. State is now
              communicated only via the halo color (data-speaker). */}
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
