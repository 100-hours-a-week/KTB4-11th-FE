"use client";

import { useState } from "react";

export function useDateRangeDraft(initialStart: string, initialEnd: string) {
  const [draftStart, setDraftStart] = useState<string | undefined>(
    initialStart || undefined,
  );
  const [draftEnd, setDraftEnd] = useState<string | undefined>(
    initialEnd || undefined,
  );

  function reset(start: string, end: string) {
    setDraftStart(start || undefined);
    setDraftEnd(end || undefined);
  }

  function selectDay(value: string) {
    if (!draftStart || draftEnd) {
      setDraftStart(value);
      setDraftEnd(undefined);
      return;
    }
    if (value > draftStart) {
      setDraftEnd(value);
    } else if (value < draftStart) {
      setDraftStart(value);
    }
  }

  return { draftStart, draftEnd, selectDay, reset };
}
