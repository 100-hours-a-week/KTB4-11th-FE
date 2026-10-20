"use client";

import { useEffect, useRef, useState } from "react";

export function useInputFeedback<T extends HTMLElement = HTMLDivElement>(
  durationMs = 1500,
) {
  const feedbackRef = useRef<T>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isErrorFading, setIsErrorFading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationRef = useRef<Animation | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
      animationRef.current?.cancel();
    };
  }, []);

  function clearError() {
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    animationRef.current?.cancel();
    setErrorMessage(null);
    setIsErrorFading(false);
  }

  function showError(message: string) {
    clearError();
    setErrorMessage(message);
    timeoutRef.current = setTimeout(() => {
      setIsErrorFading(true);
      timeoutRef.current = setTimeout(() => {
        setErrorMessage(null);
        setIsErrorFading(false);
        timeoutRef.current = null;
      }, 200);
    }, durationMs);

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      animationRef.current =
        feedbackRef.current?.animate(
          [
            { transform: "translateX(0)" },
            { transform: "translateX(-6px)" },
            { transform: "translateX(6px)" },
            { transform: "translateX(-4px)" },
            { transform: "translateX(4px)" },
            { transform: "translateX(0)" },
          ],
          { duration: 300, easing: "ease-out" },
        ) ?? null;
    }
  }

  return { feedbackRef, errorMessage, isErrorFading, showError, clearError };
}
