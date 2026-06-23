"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface Options {
  duration?: number;
  onComplete?: (cps: number) => void;
}

export function useClickSpeed({ duration = 10, onComplete }: Options = {}) {
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [active, setActive] = useState(false);
  const [finished, setFinished] = useState(false);
  const [cps, setCps] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const clicksRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!active) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [active]);

  useEffect(() => {
    if (active && timeLeft === 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      setActive(false);
      setFinished(true);
      const result = Math.round((clicksRef.current / duration) * 10) / 10;
      setCps(result);
      onCompleteRef.current?.(result);
    }
  }, [timeLeft, active, duration]);

  const start = useCallback(() => {
    if (active || finished) return;
    clicksRef.current = 0;
    setClicks(0);
    setTimeLeft(duration);
    setActive(true);
  }, [active, finished, duration]);

  const handleClick = useCallback(() => {
    if (!active) return;
    clicksRef.current += 1;
    setClicks((c) => c + 1);
  }, [active]);

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setClicks(0);
    setTimeLeft(duration);
    setActive(false);
    setFinished(false);
    setCps(0);
    clicksRef.current = 0;
  }, [duration]);

  return { clicks, timeLeft, active, finished, cps, start, handleClick, reset };
}
