"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import HeadCircuitIcon from "@/assets/icons/fill/head-circuit.svg";
import TrophyIcon from "@/assets/icons/nav/filled/trophy.svg";
import { Button } from "@/shared/components/Button";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalPortal,
  ModalTitle,
} from "@/shared/components/Modal";
import {
  Sheet,
  SheetContent,
  SheetPortal,
  SheetTitle,
} from "@/shared/components/Sheet";
import { trackEvent } from "@/shared/utils/analytics";

interface DuelTypeSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hasOngoingUserVsAiDuel: boolean;
  onBlockedByOngoingDuel: () => void;
}

export function DuelTypeSheet({
  open,
  onOpenChange,
  hasOngoingUserVsAiDuel,
  onBlockedByOngoingDuel,
}: DuelTypeSheetProps) {
  const router = useRouter();
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);

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
                onClick={() => {
                  onOpenChange(false);
                  if (hasOngoingUserVsAiDuel) {
                    onBlockedByOngoingDuel();
                  } else {
                    router.push("/duel/create");
                  }
                }}
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
                  trackEvent("unsupported_feature_click", {
                    feature_name: "competition",
                  });
                  onOpenChange(false);
                  setIsComingSoonOpen(true);
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

      <Modal open={isComingSoonOpen} onOpenChange={setIsComingSoonOpen}>
        <ModalPortal>
          <ModalContent>
            <ModalTitle>지금은 나 vs AI 대결만 가능해요</ModalTitle>
            <ModalDescription>
              AI 전략 대결은 v3에서 이용할 수 있어요.
              <br />
              조금만 기다려 주세요!
            </ModalDescription>
            <ModalClose asChild>
              <Button className="mt-6">확인</Button>
            </ModalClose>
          </ModalContent>
        </ModalPortal>
      </Modal>
    </>
  );
}
