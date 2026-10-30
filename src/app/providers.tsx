"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";

import { trackNavigationHistory } from "@/shared/utils/navigationHistory";
import { DeferredWebFont } from "@/shared/components/DeferredWebFont";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => trackNavigationHistory(window.history), []);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <DeferredWebFont />
    </QueryClientProvider>
  );
}
