export function appendTradeDigit(value: string, key: string): string {
  const digits = `${value}${key}`.replace(/^0+/, "");
  return digits.slice(0, 9);
}

// TODO: 종목 시세 API 연동 시 실제 상·하한가로 교체
export function getPriceLimits(currentPrice: number, changeRate: number) {
  const previousClose = currentPrice / (1 + changeRate / 100);
  return {
    upperLimitPrice: Math.round(previousClose * 1.3),
    lowerLimitPrice: Math.round(previousClose * 0.7),
  };
}
