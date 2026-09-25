"use client";

import type { ReactNode } from "react";

let mobileContainerElement: HTMLDivElement | null = null;

export function getMobileContainerElement() {
  return mobileContainerElement;
}

export function MobileContainer({ children }: { children: ReactNode }) {
  return (
    <div
      ref={(node) => {
        mobileContainerElement = node;
      }}
      className="bg-bg-layer-basement hide-scrollbar relative mx-auto h-full max-w-120 overflow-y-auto"
    >
      {children}
    </div>
  );
}
