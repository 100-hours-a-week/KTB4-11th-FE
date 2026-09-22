import type { ReactNode } from "react";

export function MobileContainer({ children }: { children: ReactNode }) {
  return (
    <div className="bg-bg-layer-basement mx-auto h-full max-w-120 overflow-y-auto">
      <div className="h-safe-top bg-base-50" />
      {children}
    </div>
  );
}
