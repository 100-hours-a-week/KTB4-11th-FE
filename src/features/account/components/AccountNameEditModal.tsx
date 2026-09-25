"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { isAccountNameAlreadyExistsError } from "@/features/account/hooks/useCreateAccountMutation";
import { useUpdateAccountNameMutation } from "@/features/account/hooks/useUpdateAccountNameMutation";
import { ACCOUNT_NAME_MAX_LENGTH } from "@/features/account/schemas/accountCreationFormSchema";
import {
  accountNameEditFormSchema,
  type AccountNameEditFormValues,
} from "@/features/account/schemas/accountNameEditFormSchema";
import EditIcon from "@/assets/icons/fill/edit.svg";

interface AccountNameEditModalProps {
  accountId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValue: string;
}

export function AccountNameEditModal({
  accountId,
  open,
  onOpenChange,
  defaultValue,
}: AccountNameEditModalProps) {
  const [prevOpen, setPrevOpen] = useState(open);
  const {
    watch,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountNameEditFormValues>({
    resolver: zodResolver(accountNameEditFormSchema),
    defaultValues: { accountName: defaultValue },
  });
  const accountName = watch("accountName");

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setValue("accountName", defaultValue);
    }
  }

  const { mutate, isPending } = useUpdateAccountNameMutation(accountId);

  const onSubmit = handleSubmit((values) => {
    mutate(values.accountName, {
      onSuccess: () => {
        onOpenChange(false);
        toast.success("계좌명이 수정됐어요");
      },
      onError: (error) => {
        if (isAccountNameAlreadyExistsError(error)) {
          setError("accountName", {
            message: "이미 존재하는 계좌명이에요",
          });
        } else {
          toast.error("계좌명을 수정하지 못했어요. 다시 시도해 주세요.");
        }
      },
    });
  });

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
              onChange={(value) =>
                setValue("accountName", value, { shouldValidate: true })
              }
              error={!!errors.accountName}
              helperText={errors.accountName?.message}
              right={<EditIcon width={20} height={20} />}
            />
          </ModalBody>
          <ModalFooter>
            <ModalClose asChild>
              <Button className="bg-bg-neutral-tertiary text-text-neutral-secondary active:text-text-neutral-primary flex-1 active:bg-gray-50">
                취소
              </Button>
            </ModalClose>
            <Button className="flex-1" onClick={onSubmit} disabled={isPending}>
              저장
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
}
