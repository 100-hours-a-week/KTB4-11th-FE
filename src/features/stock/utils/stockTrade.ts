export function appendTradeDigit(value: string, key: string): string {
  const digits = `${value}${key}`.replace(/^0+/, "");
  return digits.slice(0, 9);
}
