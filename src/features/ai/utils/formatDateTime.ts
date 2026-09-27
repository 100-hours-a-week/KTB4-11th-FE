export function formatDateTime(isoString: string) {
  const date = new Date(isoString);
  const pad = (n: number) => String(n).padStart(2, "0");

  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
