"use client";

import { useEffect, useRef, useState } from "react";

export function useInputFeedback<T extends HTMLElement = HTMLDivElement>(
  durationMs = 1500,
) {
  const feedbackRef = useRef<T>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isErrorFading, setIsErrorFading] = useState(false);
  const [errorToken, setErrorToken] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationRef = useRef<Animation | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
      animationRef.current?.cancel();
    };
  }, []);

  // 에러 메시지가 화면에 실제로 반영된 뒤(ref가 유효해진 뒤) 흔들림 애니메이션 실행
  useEffect(() => {
    if (errorToken === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
  }, [errorToken]);

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
    setErrorToken((token) => token + 1);
    timeoutRef.current = setTimeout(() => {
      setIsErrorFading(true);
      timeoutRef.current = setTimeout(() => {
        setErrorMessage(null);
        setIsErrorFading(false);
        timeoutRef.current = null;
      }, 200);
    }, durationMs);
  }

  return { feedbackRef, errorMessage, isErrorFading, showError, clearError };
}
