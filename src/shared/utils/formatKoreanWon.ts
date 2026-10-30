/** 금액을 만·억 단위로 나누되 원 단위까지 보존 */
export function formatKoreanWon(amount: number): string {
  const billions = Math.floor(amount / 100_000_000);
  const tenThousands = Math.floor((amount % 100_000_000) / 10_000);
  const remainder = amount % 10_000;
  const parts = [
    billions ? `${billions.toLocaleString()}억` : "",
    tenThousands ? `${tenThousands.toLocaleString()}만` : "",
    remainder ? remainder.toLocaleString() : "",
  ].filter(Boolean);
  return `${parts.length ? parts.join(" ") : "0"}원`;
}
