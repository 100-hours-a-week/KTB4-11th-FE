"use client";

import type { ReactNode } from "react";
import DeleteIcon from "@/assets/icons/fill/delete.svg";
import EditIcon from "@/assets/icons/fill/edit.svg";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/Sheet";

interface AccountSettingsSheetProps {
  trigger: ReactNode;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
}

export function AccountSettingsSheet({
  trigger,
  onEditClick,
  onDeleteClick,
}: AccountSettingsSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetPortal>
        <SheetContent>
          <div className="flex flex-col gap-3 p-6">
            <div className="bg-bg-neutral-tertiary mx-auto mb-1 h-1 w-9 rounded-full" />
            <SheetTitle className="text-center">계좌 설정</SheetTitle>
            <SheetClose asChild>
              <button
                type="button"
                onClick={onEditClick}
                className="border-border-neutral-muted flex items-center gap-3 rounded-2xl border p-4"
              >
                <span className="bg-bg-layer-basement flex size-10 items-center justify-center rounded-full">
                  <EditIcon
                    width={24}
                    height={24}
                    className="text-icon-neutral-primary"
                  />
                </span>
                <span className="body-1-semibold">계좌명 수정</span>
              </button>
            </SheetClose>
            <SheetClose asChild>
              <button
                type="button"
                onClick={onDeleteClick}
                className="border-border-neutral-muted flex items-center gap-3 rounded-2xl border p-4"
              >
                <span className="bg-bg-layer-basement flex size-10 items-center justify-center rounded-full">
                  <DeleteIcon
                    width={24}
                    height={24}
                    className="text-icon-neutral-primary"
                  />
                </span>
                <span className="body-1-semibold">계좌 삭제</span>
              </button>
            </SheetClose>
          </div>
        </SheetContent>
      </SheetPortal>
    </Sheet>
  );
}
