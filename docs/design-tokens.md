# 디자인 토큰 가이드

전담 디자이너가 없어서, 컴포넌트를 만들 때 색상·타이포를 일관되게 쓰기 위한
기준을 여기 정리해둔다. **v1 화면 설계서 기준으로 필요한 것만 뽑았고,
개발하면서 더 필요한 색/스타일이 생기면 그때그때 추가한다.**

토큰 정의: [`src/styles/globals.css`](../src/styles/globals.css),
[`src/styles/typography.css`](../src/styles/typography.css)
출처: [StockSpoon 1.0.0 제출용 (Figma)](https://www.figma.com/design/4yC3yRoHHnxtcAYRXWymPr/StockSpoon-1.0.0--제출용-?node-id=13468-22773)

## 기본 원칙

- 컴포넌트에서는 `bg-red-600`처럼 atomic 값을 직접 쓰지 말고,
  `bg-error`처럼 **semantic 토큰**을 쓴다. 나중에 색을 바꿀 때 한 군데만
  고치면 되게 하기 위함
- 이름 규칙: `{속성}-{용도}` (예: `text-error`, `bg-accent`,
  `icon-neutral-primary`). 속성은 `bg` / `text` / `border` / `icon` 중 하나.

## Color — 어떤 상황에 어떤 색을 쓰는지

### 메인(Accent)

> 지금은 Sky Blue(`#1baefd`)를 쓴다. 바꾸고 싶으면 `bg-accent` /
> `text-accent` / `border-accent` / `icon-accent` 네 줄만 수정하면 전체에 반영된다.

| 토큰 | 값 | 적용 상황 |
| --- | --- | --- |
| `bg-accent` | sky-blue-500 | 주요 CTA 버튼, 활성 탭 배경 |
| `text-accent` | sky-blue-600 | 강조 텍스트, 링크 |
| `border-accent` | sky-blue-400 | 강조 테두리 |
| `icon-accent` | sky-blue-500 | 강조 아이콘 (즐겨찾기 별 등) |

### 상태 (경고 / 에러 / 성공 / 안내)

| 상태 | bg | text | border | icon | 적용 상황 |
| --- | --- | --- | --- | --- | --- |
| Warning | yellow-50 | yellow-900 | yellow-400 | yellow-500 | 주의가 필요한 배너·카드 |
| Error | red-50 | red-600 | red-400 | red-300 | 실패 토스트, 입력값 오류 |
| Success | green-50 | green-600 | green-400 | green-600 | 완료 토스트, 체결 성공 |
| Informative | blue-50 | blue-600 | blue-400 | blue-600 | 안내 배너, 도움말 |

### 시세 등락 (국내 주식 컨벤션)

> 상승 = 빨강, 하락 = 파랑, 보합 = 회색. **메인 컬러와 무관하게 고정**

| 상태 | text / icon | bg |
| --- | --- | --- |
| 상승 | red-600 | red-50 |
| 하락 | blue-600 | blue-50 |
| 보합 | gray-600 | gray-75 |

### 레이어 (화면 깊이)

| 토큰 | 값 | 적용 상황 |
| --- | --- | --- |
| `bg-layer-default` | base-50 | 기본 페이지 배경 |
| `bg-layer-floating` | base-50 | 모달·바텀시트처럼 떠있는 배경 |
| `bg-layer-basement` | gray-50 | 가장 아래 깔리는 배경 |
| `bg-layer-overlay` | black 40% | 모달 뒤 딤 처리 |

### 회색조 (Neutral)

| 속성 | primary | secondary | tertiary | 기타 |
| --- | --- | --- | --- | --- |
| bg | gray-900 (다크 버튼 등) | gray-800 | gray-75 (비활성 배경) | — |
| text | gray-950 (본문 기본) | gray-600 (보조 설명) | gray-300 (placeholder) | inverse: base-50 |
| border | gray-700 (입력창 등) | gray-500 (일반 구분선) | gray-300 (옅은 구분선) | muted: gray-75 |
| icon | gray-600 (기본 아이콘) | gray-300 (비활성 아이콘) | — | inverse: base-50 |

## Typography — 보통 이 순서로 적용

화면 위에서 아래로 정보 위계가 내려갈수록 작고 약한 스타일을 쓴다.

| 순서 | 스타일 | 크기 / 굵기 | 보통 쓰는 곳 |
| --- | --- | --- | --- |
| 1 | `title-1` | 24 · Bold | 페이지 최상단 타이틀 (예: "내 포트폴리오") |
| 2 | `heading-1-bold` / `-semibold` | 20 · Bold/Semibold | 섹션 제목 (예: "관심종목") |
| 3 | `heading-2-semibold` / `-medium` | 18 · Semibold/Medium | 서브 섹션, 카드 제목 (예: "삼성전자 005930") |
| 4 | `body-1-bold` / `-semibold` / `-medium` | 16 | 핵심 본문, 강조 수치 (예: "68,700원") |
| 5 | `body-2-semibold` / `-medium` / `-regular` | 14 | 일반 본문, 리스트 항목 |
| 6 | `caption-1-semibold` / `-regular` | 12 | 부가정보, 타임스탬프, 라벨 |

같은 크기 안에서는 **굵기로 강조 정도를 조절**한다 (bold > semibold > medium >
regular). 폰트는 Pretendard Variable 하나만 쓴다.

## Radius

| 토큰 | 값 | 적용 상황 |
| --- | --- | --- |
| `radius-r3` | 12px | 카드, 버튼 |
| `radius-full` | 9999px | 아바타, 필(pill) 버튼, 뱃지 |

> r1 / r2 / r4처럼 더 작거나 큰 스케일은 아직 확인 안 됨 — 필요해지면 Figma
> 확인 후 추가
