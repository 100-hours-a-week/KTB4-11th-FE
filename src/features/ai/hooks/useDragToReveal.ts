"use client";

import { useRef, useState } from "react";

// 단순 클릭과 구분하기 위한 최소 이동 거리
const DRAG_DISTANCE_THRESHOLD_PX = 4;

// 누르고 일정 거리 이상 움직이면 드래그로 인식하고, 그 직후의 클릭(네비게이션 등)은 막는다
export function useDragToReveal() {
  const [isDragging, setIsDragging] = useState(false);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const didDragRef = useRef(false);

  function onPointerDown(event: React.PointerEvent) {
    pointerStartRef.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent) {
    if (!pointerStartRef.current || isDragging) return;
    const dx = Math.abs(event.clientX - pointerStartRef.current.x);
    const dy = Math.abs(event.clientY - pointerStartRef.current.y);
    if (dx > DRAG_DISTANCE_THRESHOLD_PX || dy > DRAG_DISTANCE_THRESHOLD_PX) {
      didDragRef.current = true;
      setIsDragging(true);
    }
  }

  function onPointerEnd() {
    pointerStartRef.current = null;
    setIsDragging(false);
  }

  function onClick(event: React.MouseEvent) {
    if (didDragRef.current) {
      event.preventDefault();
      event.stopPropagation();
      didDragRef.current = false;
    }
  }

  return {
    isDragging,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: onPointerEnd,
      onPointerCancel: onPointerEnd,
      onClick,
    },
  };
}
