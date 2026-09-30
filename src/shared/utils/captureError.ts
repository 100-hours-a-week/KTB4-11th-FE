import * as Sentry from "@sentry/nextjs";

type CaptureErrorContext = {
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
};

export function captureError(error: unknown, context?: CaptureErrorContext) {
  Sentry.captureException(error, {
    tags: context?.tags,
    extra: context?.extra,
  });
}
