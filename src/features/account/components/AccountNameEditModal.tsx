"use client";

import { useState } from "react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalFooter,
  ModalPortal,
  ModalTitle,
} from "@/shared/components/Modal";
import { ACCOUNT_NAME_MAX_LENGTH } from "@/features/account/schemas/accountCreationFormSchema";
import EditIcon from "@/assets/icons/fill/edit.svg";

interface AccountNameEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValue: string;
  onSave?: (accountName: string) => void;
}

export function AccountNameEditModal({
  open,
  onOpenChange,
  defaultValue,
  onSave,
}: AccountNameEditModalProps) {
  const [prevOpen, setPrevOpen] = useState(open);
  const [accountName, setAccountName] = useState(defaultValue);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setAccountName(defaultValue);
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalPortal>
        <ModalContent>
          <ModalTitle>계좌명 수정</ModalTitle>
          <ModalBody>
            <Input
              bordered
              value={accountName}
              maxLength={ACCOUNT_NAME_MAX_LENGTH}
              placeholder="계좌 이름을 입력해 주세요"
              onChange={setAccountName}
              right={<EditIcon width={20} height={20} />}
            />
          </ModalBody>
          <ModalFooter>
            <ModalClose asChild>
              <Button className="bg-bg-neutral-tertiary text-text-neutral-secondary active:text-text-neutral-primary flex-1 active:bg-gray-50">
                취소
              </Button>
            </ModalClose>
            <Button className="flex-1" onClick={() => onSave?.(accountName)}>
              저장
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
}
