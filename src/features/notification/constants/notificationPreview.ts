import type { Notification } from "@/features/notification/types/notification";

const now = Date.now();
const minutesAgo = (minutes: number) =>
  new Date(now - minutes * 60_000).toISOString();

export const NOTIFICATION_PREVIEW: Notification[] = [
  {
    id: 1,
    kind: "ORDER",
    title: "삼성전자 매수 주문이 체결됐어요",
    body: "71,000원에 4주 체결됐어요",
    createdAt: minutesAgo(8),
    isRead: false,
    href: "/trades",
    stockCode: "005930",
  },
  {
    id: 2,
    kind: "AI_REPORT",
    title: "AI 리포트가 완성됐어요",
    body: "삼성전자 매수 판단 근거를 확인해보세요",
    createdAt: minutesAgo(20),
    isRead: false,
    stockCode: "005930",
  },
  {
    id: 3,
    kind: "DUEL_START",
    title: "AI끼리 대결이 시작됐어요",
    body: "7월 배당주 실험 대결이 시작됐어요",
    createdAt: minutesAgo(50),
    isRead: false,
    href: "/duel",
  },
  {
    id: 4,
    kind: "DUEL_REMINDER",
    title: "대결 종료까지 1일 남았어요",
    body: "7월 배당주 실험 대결이 내일 종료돼요",
    createdAt: minutesAgo(130),
    isRead: false,
    href: "/duel",
  },
  {
    id: 6,
    kind: "APP_UPDATE",
    title: "스톡스푼이 업데이트됐어요",
    body: "더 편리해진 알림 기능을 만나보세요",
    createdAt: minutesAgo(600),
    isRead: true,
  },
  {
    id: 7,
    kind: "ORDER",
    title: "카카오 매도 주문이 체결 대기 중이에요",
    body: "장 시작 후 순차적으로 체결될 예정이에요",
    createdAt: minutesAgo(900),
    isRead: true,
    href: "/trades",
    stockCode: "035720",
  },
  {
    id: 8,
    kind: "DUEL_END",
    title: "대결이 종료됐어요",
    body: "AI 2가 이겼어요. 결과를 확인해보세요",
    createdAt: minutesAgo(1_500),
    isRead: true,
    href: "/duel",
  },
  {
    id: 10,
    kind: "ORDER",
    title: "카카오 매도 주문이 체결됐어요",
    body: "42,000원에 10주 체결됐어요",
    createdAt: minutesAgo(2_900),
    isRead: true,
    href: "/trades",
    stockCode: "035720",
  },
];

export const HAS_UNREAD_NOTIFICATION_PREVIEW = NOTIFICATION_PREVIEW.some(
  (notification) => !notification.isRead,
);
