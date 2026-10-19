// 정규장: 평일 09:00~15:30 (공휴일은 고려하지 않음)
export function isRegularMarketHours(now = new Date()): boolean {
  const day = now.getDay();
  if (day === 0 || day === 6) return false;
  const minutes = now.getHours() * 60 + now.getMinutes();
  return minutes >= 9 * 60 && minutes <= 15 * 60 + 30;
}
