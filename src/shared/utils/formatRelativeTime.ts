export function formatRelativeTime(isoDate: string): string {
  const diffMinutes = Math.floor(
    (Date.now() - new Date(isoDate).getTime()) / 60_000,
  );

  if (diffMinutes < 1) return "방금 전";
  if (diffMinutes < 60) return `${diffMinutes}분 전`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}일 전`;
}
