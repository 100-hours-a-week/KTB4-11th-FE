function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/** "2026.08.14" */
export function formatFullDotDate(isoDate: string): string {
  const date = new Date(isoDate);
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
}

/** "09.07" */
export function formatShortDotDate(isoDate: string): string {
  const date = new Date(isoDate);
  return `${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
}

/** "8.25" */
export function formatEventDate(isoDate: string): string {
  const date = new Date(isoDate);
  return `${date.getMonth() + 1}.${date.getDate()}`;
}
