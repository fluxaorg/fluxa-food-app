'use client';

import { useCallback, useRef } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'order';

const TOAST_EVENT = 'fluxa-toast';

export function useNotifications() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSound = useCallback(() => {
    try {
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      const beep = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.3, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };
      beep(880, 0, 0.15);
      beep(1100, 0.2, 0.15);
    } catch {}
  }, []);

  const vibrate = useCallback(() => {
    try {
      navigator.vibrate?.([200, 100, 200]);
    } catch {}
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: { message, type } }));
  }, []);

  return { playSound, vibrate, showToast };
}
