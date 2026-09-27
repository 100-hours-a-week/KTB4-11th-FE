export interface LegalSection {
  heading: string;
  body: string;
  items?: string[];
  table?: {
    headers: string[];
    rows: string[][];
  };
}
