"use client";

import { useEffect, useState, type ReactNode } from "react";

export function MSWProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(
    process.env.NEXT_PUBLIC_API_MOCKING !== "enabled",
  );

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_API_MOCKING !== "enabled") return;

    import("./browser").then(({ worker }) => {
      worker.start({ onUnhandledRequest: "bypass" }).then(() => {
        setIsReady(true);
      });
    });
  }, []);

  if (!isReady) return null;

  return children;
}
