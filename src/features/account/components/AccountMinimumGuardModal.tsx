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

interface AccountMinimumGuardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AccountMinimumGuardModal({
  open,
  onOpenChange,
}: AccountMinimumGuardModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalPortal>
        <ModalContent>
          <ModalTitle>계좌가 하나뿐이면 삭제할 수 없어요</ModalTitle>
          <ModalDescription>
            새 계좌를 만든 후 다시 시도해 주세요
          </ModalDescription>
          <ModalFooter>
            <ModalClose asChild>
              <Button>확인</Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
}
