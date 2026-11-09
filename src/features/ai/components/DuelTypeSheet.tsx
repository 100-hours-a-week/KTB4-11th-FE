"use client";

import { useRouter } from "next/navigation";
import HeadCircuitIcon from "@/assets/icons/fill/head-circuit.svg";
import TrophyIcon from "@/assets/icons/nav/filled/trophy.svg";
import {
  Sheet,
  SheetContent,
  SheetPortal,
  SheetTitle,
} from "@/shared/components/Sheet";

interface DuelTypeSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isCheckingExistingDuel: boolean;
  onSelectUserVsAi: () => void;
}

export function DuelTypeSheet({
  open,
  onOpenChange,
  isCheckingExistingDuel,
  onSelectUserVsAi,
}: DuelTypeSheetProps) {
  const router = useRouter();

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetPortal>
          <SheetContent>
            <div className="flex flex-col gap-3 p-6">
              <div className="bg-bg-neutral-tertiary mx-auto mb-1 h-1 w-9 rounded-full" />
              <SheetTitle className="text-center">
                어떤 대결을 만들까요?
              </SheetTitle>
              <button
                type="button"
                disabled={isCheckingExistingDuel}
                onClick={onSelectUserVsAi}
                className="border-border-neutral-muted flex flex-col items-start gap-1 rounded-2xl border p-4 text-left"
              >
                <span className="flex items-center gap-1">
                  <TrophyIcon
                    width={18}
                    height={18}
                    className="text-text-accent"
                  />
                  <span className="body-1-semibold">나 vs AI</span>
                </span>
                <span className="body-2-regular text-text-neutral-secondary">
                  내가 직접 매매해서 AI와 겨뤄요 · 한 번에 하나만
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  router.push("/duel/create/ai-vs-ai");
                }}
                className="border-border-neutral-muted flex flex-col items-start gap-1 rounded-2xl border p-4 text-left"
              >
                <span className="flex items-center gap-1">
                  <HeadCircuitIcon
                    width={18}
                    height={18}
                    className="text-text-accent"
                  />
                  <span className="body-1-semibold">AI끼리</span>
                </span>
                <span className="body-2-regular text-text-neutral-secondary">
                  같은 모델, 다른 전략끼리 경쟁해요 · 여러 개 가능
                </span>
              </button>
            </div>
          </SheetContent>
        </SheetPortal>
      </Sheet>
    </>
  );
}
