import { Fragment } from "react";

// 텍스트에서 검색어와 일치하는 첫 구간만 accent 컬러로 표시
export function highlightMatch(text: string, query: string) {
  if (!query) return text;
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text;

  const before = text.slice(0, index);
  const match = text.slice(index, index + query.length);
  const after = text.slice(index + query.length);

  return (
    <Fragment>
      {before}
      <span className="text-text-accent">{match}</span>
      {after}
    </Fragment>
  );
}
