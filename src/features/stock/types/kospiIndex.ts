export interface KospiIndexResponse {
  name: "KOSPI" | "KOSPI200";
  value: number;
  change: number;
  rate: number;
  timestamp: string;
}
