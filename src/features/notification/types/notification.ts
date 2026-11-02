export const NOTIFICATION_KINDS = [
  "ORDER",
  "DUEL_START",
  "DUEL_REMINDER",
  "DUEL_END",
  "APP_UPDATE",
  "AI_REPORT",
] as const;
export type NotificationKind = (typeof NOTIFICATION_KINDS)[number];

export interface Notification {
  id: number;
  kind: NotificationKind;
  title: string;
  body: string;
  createdAt: string;
  isRead: boolean;
  href?: string;
  stockCode?: string;
}
