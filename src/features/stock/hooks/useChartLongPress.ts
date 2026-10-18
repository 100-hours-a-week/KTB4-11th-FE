"use client";

// 길게 누르기·드래그·클릭 구분과 상세 조회 열기·닫기

import { useEffect, type RefObject } from "react";

// 450ms 동안 움직임이 없으면 상세 조회. 드래그·핀치는 제외
export function useChartLongPress(
  ref: RefObject<HTMLElement | null>,
  handlers: {
    onStart: (x: number, y: number) => void;
    onMove: (x: number, y: number) => void;
    onEnd: () => void;
  },
) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let origin:
      | {
          x: number;
          y: number;
          id: number;
          dismissOnClick: boolean;
          moved: boolean;
        }
      | undefined;
    let active = false;
    const pointers = new Set<number>();
    const cancelTimer = () => {
      clearTimeout(timer);
      timer = undefined;
    };
    const end = () => {
      cancelTimer();
      origin = undefined;
      if (active) handlers.onEnd();
      active = false;
    };
    const local = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      return [event.clientX - rect.left, event.clientY - rect.top] as const;
    };
    const down = (event: PointerEvent) => {
      if (event.button !== 0) return;
      pointers.add(event.pointerId);
      if (pointers.size !== 1) {
        end();
        return;
      }
      origin = {
        x: event.clientX,
        y: event.clientY,
        id: event.pointerId,
        dismissOnClick: active,
        moved: false,
      };
      const [x, y] = local(event);
      if (active) {
        event.stopImmediatePropagation();
        element.setPointerCapture(event.pointerId);
        return;
      }
      timer = setTimeout(() => {
        active = true;
        element.setPointerCapture(event.pointerId);
        handlers.onStart(x, y);
      }, 450);
    };
    const move = (event: PointerEvent) => {
      if (
        origin?.id === event.pointerId &&
        Math.hypot(event.clientX - origin.x, event.clientY - origin.y) > 8
      )
        origin.moved = true;
      if (active && origin?.id === event.pointerId) {
        event.stopImmediatePropagation();
        event.preventDefault();
        if (!origin.dismissOnClick || origin.moved)
          handlers.onMove(...local(event));
      } else if (
        origin &&
        Math.hypot(event.clientX - origin.x, event.clientY - origin.y) > 8
      ) {
        cancelTimer();
      }
    };
    const up = (event: PointerEvent) => {
      pointers.delete(event.pointerId);
      if (origin?.id === event.pointerId) {
        const shouldDismiss =
          origin.dismissOnClick && !origin.moved && event.type === "pointerup";
        cancelTimer();
        origin = undefined;
        if (shouldDismiss) end();
      }
    };
    const outside = (event: PointerEvent) => {
      if (!element.contains(event.target as Node)) end();
    };
    const leave = () => {
      if (!active) cancelTimer();
    };
    const context = (event: Event) => event.preventDefault();
    element.addEventListener("pointerdown", down, true);
    element.addEventListener("pointermove", move, {
      capture: true,
      passive: false,
    });
    window.addEventListener("pointerdown", outside, true);
    window.addEventListener("pointerup", up, true);
    window.addEventListener("pointercancel", up, true);
    element.addEventListener("pointerleave", leave);
    element.addEventListener("contextmenu", context);
    window.addEventListener("blur", end);
    return () => {
      end();
      element.removeEventListener("pointerdown", down, true);
      element.removeEventListener("pointermove", move, true);
      window.removeEventListener("pointerdown", outside, true);
      window.removeEventListener("pointerup", up, true);
      window.removeEventListener("pointercancel", up, true);
      element.removeEventListener("pointerleave", leave);
      element.removeEventListener("contextmenu", context);
      window.removeEventListener("blur", end);
    };
  }, [ref, handlers]);
}
