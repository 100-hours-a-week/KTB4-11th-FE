"use client";

import { Button } from "@/shared/components/Button";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalFooter,
  ModalPortal,
  ModalTitle,
} from "@/shared/components/Modal";
import BellHappyIcon from "@/assets/icons/stockspoon/bell-happy.svg";

interface MarkAllReadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function MarkAllReadModal({
  open,
  onOpenChange,
  onConfirm,
}: MarkAllReadModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalPortal>
        <ModalContent>
          <div className="flex justify-center">
            <BellHappyIcon width={61} height={60} />
          </div>
          <ModalTitle className="mt-3">모든 알림을 읽음 처리할까요?</ModalTitle>
          <ModalFooter>
            <ModalClose asChild>
              <Button className="bg-bg-neutral-tertiary text-text-neutral-secondary active:text-text-neutral-primary flex-1 active:bg-gray-50">
                취소
              </Button>
            </ModalClose>
            <Button
              className="flex-1"
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
            >
              모두 읽기
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
}
