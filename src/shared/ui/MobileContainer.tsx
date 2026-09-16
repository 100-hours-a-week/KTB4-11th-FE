import type { ReactNode } from "react";

export function MobileContainer({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-120 flex-1 flex-col">{children}</div>
  );
}
