"use client";

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

interface StockPendingOrderCancelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function StockPendingOrderCancelModal({
  open,
  onOpenChange,
  onConfirm,
}: StockPendingOrderCancelModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalPortal>
        <ModalContent>
          <ModalTitle>주문을 취소할까요?</ModalTitle>
          <ModalDescription>
            취소한 주문은 다시 되돌릴 수 없어요
          </ModalDescription>
          <ModalFooter>
            <ModalClose asChild>
              <Button className="bg-bg-neutral-tertiary text-text-neutral-secondary active:text-text-neutral-primary flex-1 active:bg-gray-50">
                닫기
              </Button>
            </ModalClose>
            <Button className="flex-1" onClick={onConfirm}>
              취소하기
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
}
