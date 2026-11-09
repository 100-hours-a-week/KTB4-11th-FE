export interface ThemeCategoryItem {
  code: string;
  name: string;
}

export interface ThemeCategory {
  name: string;
  items: ThemeCategoryItem[];
}
