import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === "production",
  release: process.env.NEXT_PUBLIC_RELEASE,
  tracesSampleRate: 0,
  ignoreErrors: [
    "Network Error",
    "Failed to fetch",
    "Load failed",
    "AbortError",
    "The operation was aborted",
    "ResizeObserver loop limit exceeded",
    "ResizeObserver loop completed with undelivered notifications",
    "Non-Error promise rejection captured",
  ],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
