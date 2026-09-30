"use client";

import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { useEffect } from "react";
import WarningIcon from "@/assets/icons/fill/warning.svg";
import { Button } from "@/shared/components/Button";

type Props = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function Error({ error, retry }: Props) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <WarningIcon className="text-icon-warning size-15" />
        <div className="flex flex-col items-center gap-2">
          <h1 className="heading-1-semibold">오류가 발생했어요</h1>
          <p className="body-1-medium text-text-neutral-tertiary">
            잠시 후 다시 시도해 주세요
          </p>
        </div>
      </div>
      <div className="flex w-full gap-3">
        <Button
          onClick={retry}
          className="bg-bg-neutral-tertiary text-text-neutral-secondary"
        >
          다시 시도
        </Button>
        <Link href="/" className="w-full">
          <Button>홈으로 가기</Button>
        </Link>
      </div>
    </div>
  );
}
