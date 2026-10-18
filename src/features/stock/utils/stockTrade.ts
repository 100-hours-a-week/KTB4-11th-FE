export function appendTradeDigit(value: string, key: string): string {
  const digits = `${value}${key}`.replace(/^0+/, "");
  return digits.slice(0, 9);
}

// market 서비스가 상·하한가를 따로 제공하지 않아 KRX 가격제한폭(전일종가 ±30%) 공식으로 직접 계산
export function getPriceLimits(currentPrice: number, changeRate: number) {
  const previousClose = currentPrice / (1 + changeRate / 100);
  return {
    upperLimitPrice: Math.round(previousClose * 1.3),
    lowerLimitPrice: Math.round(previousClose * 0.7),
  };
}
