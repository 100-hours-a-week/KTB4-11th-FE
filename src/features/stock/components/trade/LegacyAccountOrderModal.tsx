"use client";

import { Button } from "@/shared/components/Button";
import WalletFlusteredIcon from "@/assets/icons/stockspoon/wallet-flustered.svg";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalPortal,
  ModalTitle,
} from "@/shared/components/Modal";

interface LegacyAccountOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateAccount: () => void;
}

export function LegacyAccountOrderModal({
  open,
  onOpenChange,
  onCreateAccount,
}: LegacyAccountOrderModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalPortal>
        <ModalContent>
          <div className="mb-4 flex justify-center" aria-hidden="true">
            <WalletFlusteredIcon width={63} height={60} />
          </div>
          <ModalTitle>새 계좌에서 주문할 수 있어요</ModalTitle>
          <ModalDescription>
            이전 버전에서 만든 계좌는 직접 구매·판매를 지원하지 않아요
          </ModalDescription>
          <ModalFooter>
            <Button onClick={onCreateAccount}>새 계좌 만들기</Button>
          </ModalFooter>
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
}
