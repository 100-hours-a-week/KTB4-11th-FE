"use client";

import { useState } from "react";
import CheckCircleIcon from "@/assets/icons/fill/check-circle.svg";
import BellHappyIcon from "@/assets/icons/stockspoon/bell-happy.svg";
import { MarkAllReadModal } from "@/features/notification/components/MarkAllReadModal";
import { NotificationItem } from "@/features/notification/components/NotificationItem";
import { NOTIFICATION_PREVIEW } from "@/features/notification/constants/notificationPreview";
import { EmptyState } from "@/shared/components/EmptyState";
import { EmptyStateCard } from "@/shared/components/EmptyStateCard";
import { Header, HeaderBackButton } from "@/shared/components/Header";

const RETENTION_DAYS = 14;

export function NotificationContainer() {
  const [notifications, setNotifications] = useState(NOTIFICATION_PREVIEW);
  const [isMarkAllReadOpen, setIsMarkAllReadOpen] = useState(false);
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  function markAllRead() {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true })),
    );
  }

  return (
    <div className="pt-screen-top flex h-full flex-col">
      <Header
        className="px-5 py-3"
        title="알림"
        left={<HeaderBackButton fallbackHref="/home" />}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pt-4 pb-10">
        {notifications.length === 0 ? (
          <EmptyStateCard>
            <EmptyState icon={BellHappyIcon} message="새로운 알림이 없어요" />
          </EmptyStateCard>
        ) : (
          <>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => setIsMarkAllReadOpen(true)}
                className="text-text-neutral-secondary caption-1-semibold mb-3 flex items-center gap-1 self-end"
              >
                <CheckCircleIcon width={16} height={16} />
                모두 읽기
              </button>
            )}

            <ul className="bg-bg-layer-default divide-border-neutral-muted divide-y rounded-2xl">
              {notifications.map((notification) => (
                <NotificationItem key={notification.id} {...notification} />
              ))}
            </ul>

            <span className="caption-1-regular text-text-neutral-tertiary mt-4 text-center">
              알림은 {RETENTION_DAYS}일간 보관되며, 이후 자동으로 삭제돼요
            </span>
          </>
        )}
      </div>

      <MarkAllReadModal
        open={isMarkAllReadOpen}
        onOpenChange={setIsMarkAllReadOpen}
        onConfirm={markAllRead}
      />
    </div>
  );
}
