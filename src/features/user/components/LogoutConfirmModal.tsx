"use client";

import { toast } from "sonner";
import { Button } from "@/shared/components/Button";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalFooter,
  ModalPortal,
  ModalTitle,
} from "@/shared/components/Modal";
import { useLogoutMutation } from "@/features/auth/hooks/useLogoutMutation";
import LogoutIcon from "@/assets/icons/fill/logout.svg";

interface LogoutConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogoutConfirmModal({
  open,
  onOpenChange,
}: LogoutConfirmModalProps) {
  const { mutate, isPending } = useLogoutMutation();

  const handleLogout = () => {
    mutate(undefined, {
      onError: () => {
        toast.error("로그아웃하지 못했어요. 다시 시도해 주세요.");
      },
    });
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalPortal>
        <ModalContent>
          <div className="flex justify-center">
            <LogoutIcon className="text-icon-accent size-10" />
          </div>
          <ModalTitle className="mt-3">로그아웃 하시겠어요?</ModalTitle>
          <ModalFooter>
            <ModalClose asChild>
              <Button className="bg-bg-neutral-tertiary text-text-neutral-secondary active:text-text-neutral-primary flex-1 active:bg-gray-50">
                유지하기
              </Button>
            </ModalClose>
            <Button
              className="flex-1"
              onClick={handleLogout}
              disabled={isPending}
            >
              로그아웃
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
}
