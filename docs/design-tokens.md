# StockSpoon 디자인 토큰 가이드

전담 디자이너가 없는 상황에서 컴포넌트별 색상과 Typography가 달라지지 않도록 공통 기준을 정의한다.

v1 화면 설계서를 기준으로 현재 필요한 Token만 우선 정의하며, 개발 과정에서 새로운 Color나 Style이 필요한 경우 Figma를 확인한 뒤 추가한다.

- **Token 정의**
  - [`src/styles/globals.css`](../src/styles/globals.css)
  - [`src/styles/typography.css`](../src/styles/typography.css)
- **디자인 기준**
  - [StockSpoon 1.0.0 제출용 (Figma)](https://www.figma.com/design/4yC3yRoHHnxtcAYRXWymPr/StockSpoon-1.0.0--제출용-?node-id=13468-22773)

## 기본 원칙

- 컴포넌트에서는 `bg-red-600`처럼 Color Scale을 직접 사용하기보다 `bg-error`와 같은 **Semantic Token**을 사용한다.
  - 디자인 변경 시 Token 값만 수정하여 관련 컴포넌트에 일관되게 반영할 수 있도록 구성
- Token 이름은 `{속성}-{용도}` 형식을 사용한다.
  - 속성: `bg` / `text` / `border` / `icon`
  - 예: `text-error`, `bg-accent`, `icon-neutral-primary`

## Color

### 메인 (Accent)

> 현재 Main Color는 Sky Blue (`#1BAEFD`)를 사용한다.  
> Main Color 변경 시 `bg-accent`, `text-accent`, `border-accent`, `icon-accent` Token 값을 수정하여 전체 UI에 반영한다.

| Token | 값 | 적용 상황 |
| --- | --- | --- |
| `bg-accent` | sky-blue-500 | 주요 CTA 버튼, 활성 탭 배경 |
| `text-accent` | sky-blue-600 | 강조 텍스트, 링크 |
| `border-accent` | sky-blue-400 | 강조 테두리 |
| `icon-accent` | sky-blue-500 | 강조 아이콘 |

### 상태 (Warning / Error / Success / Informative)

| 상태 | bg | text | border | icon | 적용 상황 |
| --- | --- | --- | --- | --- | --- |
| Warning | yellow-50 | yellow-900 | yellow-400 | yellow-500 | 주의가 필요한 배너·카드 |
| Error | red-50 | red-600 | red-400 | red-300 | 실패 Toast, 입력값 오류 |
| Success | green-50 | green-600 | green-400 | green-600 | 완료 Toast, 체결 성공 |
| Informative | blue-50 | blue-600 | blue-400 | blue-600 | 안내 배너, 도움말 |

### 시세 등락

> 국내 주식 UI Convention에 따라 **상승은 빨강, 하락은 파랑, 보합은 회색**으로 표시하며 Main Color와 관계없이 유지한다.

| 상태 | text / icon | bg |
| --- | --- | --- |
| 상승 | red-600 | red-50 |
| 하락 | blue-600 | blue-50 |
| 보합 | gray-600 | gray-75 |

### 레이어 (Layer)

| Token | 값 | 적용 상황 |
| --- | --- | --- |
| `bg-layer-default` | base-50 | 기본 Page 배경 |
| `bg-layer-floating` | base-50 | Modal, Bottom Sheet 등 떠 있는 영역의 배경 |
| `bg-layer-basement` | gray-50 | 가장 아래에 위치하는 배경 |
| `bg-layer-overlay` | black 40% | Modal, Bottom Sheet 뒤 Dim 처리 |

### 회색조 (Neutral)

| 속성 | primary | secondary | tertiary | 기타 |
| --- | --- | --- | --- | --- |
| bg | gray-900 | gray-800 | gray-75 | — |
| text | gray-950 | gray-600 | gray-300 | inverse: base-50 |
| border | gray-700 | gray-500 | gray-300 | muted: gray-75 |
| icon | gray-600 | gray-300 | — | inverse: base-50 |

## Typography

화면 내 정보의 중요도와 위계에 따라 Typography Style을 적용하며, 같은 Font Size에서는 Weight를 통해 강조 정도를 조절한다.

| 순서 | 스타일 | 크기 / 굵기 | 적용 상황 |
| --- | --- | --- | --- |
| 1 | `title-1` | 24 · Bold | Page 최상단 Title |
| 2 | `heading-1-bold` / `heading-1-semibold` | 20 · Bold / Semibold | Section Title |
| 3 | `heading-2-semibold` / `heading-2-medium` | 18 · Semibold / Medium | Sub Section, Card Title |
| 4 | `body-1-bold` / `body-1-semibold` / `body-1-medium` | 16 | 핵심 본문, 강조 수치 |
| 5 | `body-2-semibold` / `body-2-medium` / `body-2-regular` | 14 | 일반 본문, List Item |
| 6 | `caption-1-semibold` / `caption-1-regular` | 12 | 부가 정보, Timestamp, Label |

- Font Family는 **Pretendard Variable**을 사용한다.
- 같은 Font Size에서는 `Bold > Semibold > Medium > Regular` 순으로 강조 정도를 구분한다.

## Radius

| Token | 값 | 적용 상황 |
| --- | --- | --- |
| `radius-r3` | 12px | Card, Button |
| `radius-r4` | 24px | Modal |
| `radius-full` | 9999px | Avatar, Pill Button, Badge |

> `r1`, `r2` 등 그 외 Radius Scale은 현재 v1 화면에서 확인되지 않아 정의하지 않으며, 필요 시 Figma 확인 후 추가한다.