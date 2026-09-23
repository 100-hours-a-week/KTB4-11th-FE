import type { ReactNode } from "react";

export function MobileContainer({ children }: { children: ReactNode }) {
  return (
    <div className="bg-bg-layer-basement hide-scrollbar mx-auto h-full max-w-120 overflow-y-auto">
      {children}
    </div>
  );
}
