"use client";

import { toast } from "sonner";
import { Button } from "@/shared/components/Button";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalPortal,
  ModalTitle,
} from "@/shared/components/Modal";
import { useWithdrawMutation } from "@/features/user/hooks/useWithdrawMutation";
import WalletSadIcon from "@/assets/icons/stockspoon/wallet-sad.svg";

interface WithdrawConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WithdrawConfirmModal({
  open,
  onOpenChange,
}: WithdrawConfirmModalProps) {
  const { mutate, isPending } = useWithdrawMutation();

  const handleWithdraw = () => {
    mutate(undefined, {
      onError: () => {
        toast.error("회원 탈퇴를 완료하지 못했어요. 다시 시도해 주세요.");
      },
    });
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalPortal>
        <ModalContent>
          <div className="flex justify-center">
            <WalletSadIcon width={61} height={60} />
          </div>
          <ModalTitle className="mt-3">스톡스푼을 정말 떠나시나요?</ModalTitle>
          <ModalDescription>
            지금까지의 매매 기록, 대결 기록이 전부 사라져요
          </ModalDescription>
          <ModalFooter>
            <ModalClose asChild>
              <Button className="bg-bg-neutral-tertiary text-text-neutral-secondary active:text-text-neutral-primary flex-1 active:bg-gray-50">
                더 써볼래요
              </Button>
            </ModalClose>
            <Button
              className="flex-1"
              onClick={handleWithdraw}
              disabled={isPending}
            >
              탈퇴하기
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
}
