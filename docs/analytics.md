# StockSpoon GA4 이벤트 설계

StockSpoon 배포 이후 사용자 행동을 분석하기 위한 GA4 이벤트 측정 기준을 정의한다.

GA4 기본 페이지뷰만으로 확인하기 어려운 StockSpoon 고유 행동을 커스텀 이벤트로 수집하고,
서비스 버전별 핵심 사용자 행동과 기능 사용 여부를 분석한다.

---

## 공통 측정 기준

### 페이지뷰

GA4 향상된 측정의 `page_view`를 사용한다.

Next.js App Router의 클라이언트 라우팅에 따른 페이지 이동은
**브라우저 기록 이벤트에 따른 페이지 변경** 옵션을 통해 자동 수집한다.

따라서 특정 페이지 진입만을 확인하기 위한 별도의 커스텀 이벤트는 생성하지 않는다.

예:

```text
/home
/ai-trade-history
/ai-reasoning
```

### User-ID

로그인 성공 후 서비스 내부 사용자 ID를 GA4 `user_id`로 설정한다.

- PII가 아닌 내부 사용자 ID 사용
- 동일 사용자의 여러 세션 간 행동을 연결해 분석
- 로그아웃 시 `user_id` 초기화

## 이벤트 파라미터 규칙

카테고리형 파라미터는 자유 문자열 대신 TypeScript 유니온 타입으로 관리한다.

예:

```ts
type TradeType = "buy" | "sell";

type UnsupportedFeature =
  "manual_investment" | "favorites" | "competition" | "discover" | "search";

type AnalyticsScreen =
  | "home_holdings"
  | "home_ai_trades"
  | "holdings_list"
  | "ai_trade_history"
  | "ai_reasoning";

// reasoning 배열의 인덱스 순번(`step-${index + 1}`)을 그대로 쓴다.
// 항목 개수와 각 항목의 의미가 고정돼 있지 않아 의미 기반 이름을 붙일 수 없다.
type ReasonSection = `step-${number}`;
```

동일한 의미의 값이 서로 다른 문자열로 수집되는 것을 방지한다.
예: `manual-invest`, `manual_invest`, `AI_OFF`, `manual_investment`이 전부 같은 의미로 쓰이는 것을 막는다.

## V1

V1에서는 사용자가 AI에게 투자를 위임한 뒤,
계좌를 생성하고 AI의 매매 결과와 판단 근거를 확인하는 과정을 중심으로 측정한다.

### 이벤트 목록

| 이벤트                      | 파라미터                                     | 측정 목적                                                                    |
| --------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------- |
| `sign_up` / `login`         | `method: "kakao"`                            | 신규 가입과 기존 사용자 로그인을 구분해 가입 및 재방문 흐름 분석             |
| `onboarding_start`          | -                                            | 로그인 이후 온보딩에 진입한 사용자를 기준으로 온보딩 완료율 계산             |
| `onboarding_complete`       | -                                            | 로그인 후 첫 계좌 생성까지 완료한 비율을 측정하는 V1 핵심 Activation 지표    |
| `account_create`            | `account_count_after`                        | 추가 계좌가 얼마나 생성되는지 확인해 멀티 계좌 기능의 실제 사용 여부 분석    |
| `account_delete`            | `account_count_after`                        | 계좌 삭제 빈도 및 계좌가 0개가 되는 예외 케이스 발생 여부 확인               |
| `account_rename`            | -                                            | 계좌명 변경 기능의 실제 사용 빈도 확인                                       |
| `account_switch`            | `account_count`                              | 여러 계좌를 생성하는 것에서 끝나지 않고 실제로 계좌를 전환해 사용하는지 확인 |
| `ai_trade_list_view`        | `trade_count`, `account_count`               | 사용자가 AI의 매매 결과를 실제로 확인하는지 측정                             |
| `ai_reason_view`            | `stock_code`, `trade_type`, `elapsed_bucket` | AI 판단 근거의 실사용률과 매매 발생 이후 확인까지 걸린 시간 분석             |
| `ai_reason_expand`          | `reason_section`                             | AI 판단 근거 중 어떤 정보가 실제로 열람되는지 확인                           |
| `unsupported_feature_click` | `feature_name`                               | V1에서 제공하지 않는 기능에 대한 실제 사용자 수요 측정                       |
| `empty_state_view`          | `screen`, `empty_type`                       | 데이터 부족으로 기능을 사용할 수 없는 Empty State 발생 빈도 확인             |
| `error_view`                | `screen`, `error_code`, `api_name`           | 사용자가 실제로 경험한 화면/API별 오류 노출 빈도 확인                        |
| `retry_click`               | `screen`, `error_code`, `api_name`           | 오류 발생 후 사용자의 재시도 행동 확인                                       |
| `logout`                    | -                                            | 사용자가 명시적으로 로그아웃한 행동 기록. 핵심 KPI에는 포함하지 않음         |

### 주요 분석 흐름

**가입 및 활성화**

```text
sign_up / login
→ onboarding_start
→ onboarding_complete
```

로그인한 사용자가 실제 AI 위임 계좌 생성까지 완료하는 비율과
온보딩 과정의 이탈 여부를 확인한다.

**AI 투자 결과 소비**

```text
page_view (/home)
→ ai_trade_list_view
→ ai_reason_view
→ ai_reason_expand
```

사용자가 서비스에 접속하는 데서 끝나지 않고,
AI의 매매 결과와 판단 과정까지 실제로 확인하는지 분석한다.

**멀티 계좌 사용**

```text
account_create
→ account_switch
→ account_rename / account_delete
```

추가 계좌 생성뿐 아니라 실제 계좌 전환 및 관리 행동까지 이어지는지 확인한다.

**미구현 기능 수요**

- `unsupported_feature_click`
  - `feature_name`
    - `manual_investment`
    - `favorites`
    - `competition`
    - `discover`
    - `search`

V1에서 제공하지 않는 기능에 대한 실제 클릭 데이터를 기반으로
이후 버전 기능 우선순위 판단에 활용한다.

### 코드 삽입 지점

| 파일                                                                                                       | 이벤트                      | 위치                                                        |
| ---------------------------------------------------------------------------------------------------------- | --------------------------- | ----------------------------------------------------------- |
| `useKakaoLoginMutation.ts`                                                                                 | `sign_up` / `login`         | 로그인 성공 `onSuccess`, User-ID 설정 포함                  |
| `LogoutConfirmModal.tsx`                                                                                   | `logout`                    | `handleLogout` 내부, User-ID 초기화 포함                    |
| `AccountCreationContainer.tsx`                                                                             | `onboarding_start`          | 최초 온보딩 진입 시 (`showAccountNameField===false`)        |
| `AccountCreationContainer.tsx`                                                                             | `onboarding_complete`       | 최초 계좌 생성 mutation 성공 시                             |
| `AccountCreationContainer.tsx`                                                                             | `account_create`            | 추가 계좌 생성 mutation 성공 시                             |
| `useDeleteAccountMutation.ts`                                                                              | `account_delete`            | 삭제 mutation `onSuccess`                                   |
| `useUpdateAccountNameMutation.ts`                                                                          | `account_rename`            | 수정 mutation `onSuccess`                                   |
| `AccountSelectSheet.tsx`                                                                                   | `account_switch`            | 사용자가 다른 계좌 선택을 완료한 시점                       |
| `AccountCreationContainer.tsx` (`AiDelegationSwitch` 호출부)                                               | `unsupported_feature_click` | 직접 투자(AI 위임 OFF) 시도 시                              |
| `BottomTabBar.tsx`                                                                                         | `unsupported_feature_click` | `/favorites`, `/competition`, `/discover` 미구현 탭 클릭 시 |
| `HomeContainer.tsx` (검색 아이콘 클릭부)                                                                   | `unsupported_feature_click` | 미구현 검색 아이콘 클릭 시                                  |
| `AiTradeHistoryContainer.tsx`                                                                              | `ai_trade_list_view`        | AI 매매 내역이 정상적으로 화면에 노출된 시점                |
| `AiReasoningContainer.tsx`                                                                                 | `ai_reason_view`            | 판단 근거 조회 성공 후 화면에 노출된 시점                   |
| `JudgmentFlowAccordion.tsx`                                                                                | `ai_reason_expand`          | 닫혀 있던 판단 근거 섹션을 사용자가 펼친 시점               |
| `HomeContainer.tsx` / `AiTradeHistoryContainer.tsx` / `HoldingsContainer.tsx`                              | `empty_state_view`          | 실제 데이터가 없어 EmptyState가 노출된 시점                 |
| `HomeContainer.tsx` / `AiTradeHistoryContainer.tsx` / `AiReasoningContainer.tsx` / `HoldingsContainer.tsx` | `error_view`                | API 에러로 ErrorState가 노출된 시점 (컨테이너별 개별 호출)  |
| `HomeContainer.tsx` / `AiTradeHistoryContainer.tsx` / `AiReasoningContainer.tsx` / `HoldingsContainer.tsx` | `retry_click`               | ErrorState의 `onRetry` 실행 시 (컨테이너별 개별 호출)       |

> `error_view`/`retry_click`은 공통 컴포넌트인 `ErrorState.tsx`가 아니라, 이를 사용하는 각 컨테이너에서 개별적으로 호출한다. `ErrorState.tsx`는 `icon`/`message`/`onRetry`만 받는 순수 프레젠테이션 컴포넌트인데, 트래킹을 이 안으로 옮기려면 `screen`/`api_name`/`error_code`를 새 prop으로 추가해야 한다. 그러면 분석 목적이 아닌 곳에서 `ErrorState`를 써도 이 값들을 넘겨야 하는 부담이 생기고, 컨테이너 쪽 중복 가드(`useRef`) 로직도 어차피 그대로 필요해 실익 대비 결합 비용이 더 크다고 판단해 의도적으로 컨테이너별 호출을 유지했다.

최초 계좌 생성 시 `onboarding_complete`와 `account_create`가 함께 발생하지 않는다 — `showAccountNameField` 값에 따라 둘 중 하나만 발생한다.

- `onboarding_complete`: 사용자 Activation 측정 (최초 계좌, 이름 입력 없이 자동 생성)
- `account_create`: 추가 계좌 생성 행동 측정 (이름 입력 필요)

`account_count_after`가 1이면 최초 계좌, 2 이상이면 추가 계좌로 구분한다.

## 제외 항목

- **`home_view`** — 향상된 측정의 `page_view`와 중복되므로 별도 이벤트를 생성하지 않는다. `page_view`, `page_path=/home`으로 홈 진입을 분석한다.
- **`filter_change`** — V1의 핵심 분석 대상은 매수/매도 필터 선호도가 아니라 AI 매매 결과와 판단 근거를 실제로 소비하는지 여부다. 향후 필터 UX 개선이 필요해질 경우 추가한다.
- **`empty_type: no_trades_filtered`** — 실제 데이터가 없는 상태가 아니라 필터 적용 결과가 0건인 상태이므로 측정 대상에서 제외한다. 필터가 없는 전체 상태에서도 매매 내역이 없을 때만 `no_trades`로 수집한다.
- **진입 경로 `source`** — `ai_trade_list_view`, `ai_reason_view`의 진입 경로별 UI 개선 계획이 현재 없으므로 V1에서는 수집하지 않는다.
- **`account_id`** — 계좌별 사용자 행동을 분석할 계획이 없고 값의 종류가 많은 식별자이므로 수집하지 않는다. 필요한 분석은 `account_count`, `account_count_after`로 대체한다.
- **`retry_result`** — 재시도 이후 성공/실패까지 별도 이벤트로 추적하는 것은 V1에서 제외한다. 향후 필요할 경우 `refetch()` 결과와 연결해 추가한다.
- **매도 판단 근거 스크롤 깊이** — 매도 판단 근거 화면은 아코디언 구조가 아니어서 별도 노출 측정을 위해 `IntersectionObserver`가 필요하므로 V1에서는 제외한다.
- **`stock_code` Custom Dimension 등록** — `ai_reason_view` 이벤트 파라미터로는 수집하되, 값의 종류가 많으므로 GA4 Custom Dimension으로는 등록하지 않는다.
- **Consent Mode** — V1에서는 별도 구현 범위에 포함하지 않는다. 향후 쿠키 동의 정책, 광고 기능, 해외 서비스 범위 등 개인정보 및 동의 요구사항이 변경될 경우 별도 검토 후 도입한다.

## 검증

구현 후 다음 항목을 확인한다.

1. 페이지 이동마다 `page_view`가 한 번씩 발생하는지 확인
2. 로그인 성공 후 `user_id`가 정상적으로 설정되는지 확인
3. 로그아웃 후 `user_id`가 초기화되는지 확인
4. 신규 사용자의 `sign_up`, 기존 사용자의 `login`이 의도대로 구분되는지 확인
5. 온보딩 진입 시 `onboarding_start`가 한 번만 발생하는지 확인
6. 최초 계좌 생성 시 `onboarding_complete`와 `account_create`가 정상적으로 구분 발생하는지 확인
7. AI 매매 내역 및 판단 근거 조회 시 이벤트가 노출당 한 번만 발생하는지 확인
8. `feature_name`, `trade_type`, `screen`, `reason_section`이 정의된 값으로만 전송되는지 확인
9. Error / Empty State 이벤트가 리렌더링으로 중복 전송되지 않는지 확인

## V2

V2에서는 대결(나 vs AI), 종목 상세·매매, 발견/관심종목 화면이 추가되면서
V1에는 없던 탐색·매매·대결 참여 행동을 측정한다.

### 이벤트 목록

기존 `empty_state_view` / `error_view` / `retry_click`은 그대로 재사용하며,
`screen` / `api_name` / `empty_type`에 아래 값을 추가해 V2 화면을 포괄한다.

| 타입               | 추가된 값                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------ |
| `AnalyticsScreen`  | `discover_ranking`, `favorites`, `duel_list`, `duel_detail`, `duel_result`, `stock_detail` |
| `AnalyticsApiName` | `ranking`, `watchlist`, `competitions`                                                     |
| `EmptyType`        | `no_ranking`, `no_favorites`, `no_duels`                                                   |

신규 이벤트는 다음과 같다.

| 이벤트                     | 파라미터                                       | 측정 목적                                                                |
| -------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------ |
| `withdraw`                 | -                                              | 사용자가 명시적으로 회원 탈퇴한 행동 기록. 핵심 KPI에는 포함하지 않음    |
| `duel_create`              | -                                              | 대결 생성 완료 빈도 확인                                                 |
| `duel_card_click`          | `status: DuelCardStatus`                       | 대결 카드가 상태(시작 대기/진행 중/종료/취소)별로 얼마나 클릭되는지 확인 |
| `duel_report_click`        | `competition_id`                               | 대결 결과 화면에서 AI 리포트로 이동하는 비율 확인                        |
| `duel_report_view`         | `competition_id`                               | AI 리포트 페이지가 실제로 열람되는지 확인                                |
| `duel_market_event_expand` | `competition_id`, `event_index`                | 리포트의 시황 분석 중 어떤 항목이 펼쳐지는지 확인                        |
| `stock_detail_view`        | `stock_code`                                   | 종목 상세 조회 빈도 및 어떤 종목이 많이 조회되는지 확인                  |
| `trade_attempt`            | `stock_code`, `side: TradeType`, `price_mode`  | 매수/매도 주문 시도 빈도 확인                                            |
| `trade_success`            | `stock_code`, `side: TradeType`, `is_filled`   | 주문 성공 중 즉시 체결과 미체결(대기) 비율 확인                          |
| `trade_fail`               | `stock_code`, `side: TradeType`, `error_code?` | 주문 실패 원인별 빈도 확인                                               |
| `trade_button_click`       | `stock_code`, `side: TradeType`                | 종목 상세에서 매매 화면 진입 버튼 클릭 빈도 확인                         |
| `trade_input_mode_change`  | `stock_code`, `mode: "number" \| "orderbook"`  | 매매 화면에서 숫자 입력과 호가 선택 중 어느 쪽을 더 쓰는지 확인          |
| `trade_orderbook_select`   | `stock_code`, `side: TradeType`, `price`       | 호가 리스트에서 특정 가격을 지정가로 선택하는 빈도 확인                  |
| `order_cancel`             | `stock_code`                                   | 대기 주문 취소 빈도 확인                                                 |
| `chart_period_change`      | `stock_code`, `period`                         | 기본 차트에서 조회 기간(1일/1주/3달/1년/전체) 선호도 확인                |
| `chart_granularity_change` | `stock_code`, `granularity`                    | 자세한 차트에서 분봉 단위 선호도 확인                                    |
| `chart_detail_toggle`      | `stock_code`, `detailed`                       | 자세한 차트 전환 사용률 확인                                             |
| `filter_chip_click`        | `screen: AnalyticsScreen`, `filter_value`      | 화면별 필터/탭/토글 칩 클릭 빈도를 공용 이벤트로 확인                    |

> `filter_chip_click`은 발견 랭킹 탭, 관심종목 업종 필터, 대결 목록 상태 필터, 매매내역 필터, 보유종목 카테고리, 대결 상세 포트폴리오 토글, 종목 상세 탭 등 구조가 동일한 칩/탭 UI 전반에 공용으로 사용한다. 화면마다 전용 이벤트를 만들면 종류만 늘어나고 분석 방식은 동일해, `screen` 값으로 구분하는 쪽을 택했다.

### 주요 분석 흐름

**대결 생성 및 참여**

```text
duel_create
→ duel_card_click (status: in_progress)
→ duel_card_click (status: completed)
→ duel_report_click
→ duel_report_view
→ duel_market_event_expand
```

대결을 생성한 뒤 진행 중/종료된 대결을 실제로 다시 찾아보고,
AI 리포트까지 소비하는지 확인한다.

**종목 매매**

```text
stock_detail_view
→ trade_button_click
→ trade_input_mode_change / trade_orderbook_select
→ trade_attempt
→ trade_success / trade_fail
```

종목 상세 조회가 실제 매매 시도·체결로 이어지는 비율과,
숫자 입력/호가 선택 중 어떤 방식을 선호하는지 분석한다.

**회원 탈퇴**

```text
withdraw
```

로그아웃과 구분해 서비스 이탈 빈도를 별도로 추적한다.

### 코드 삽입 지점

| 파일                                       | 이벤트                                                                     | 위치                                                                          |
| ------------------------------------------ | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `DiscoverContainer.tsx`                    | `error_view` / `empty_state_view` / `retry_click` / `filter_chip_click`    | 랭킹 조회 에러·empty·재시도, 랭킹 탭 클릭                                     |
| `FavoritesContainer.tsx`                   | `error_view` / `empty_state_view` / `retry_click` / `filter_chip_click`    | 관심종목 조회 에러·empty·재시도, 업종 필터 클릭                               |
| `DuelContainer.tsx`                        | `empty_state_view` / `filter_chip_click`                                   | 대결 목록 empty, 상태 필터 클릭                                               |
| `DuelCard.tsx` / `OngoingDuelCarousel.tsx` | `duel_card_click`                                                          | 대결 카드 클릭 시 (`DuelStatus → DuelCardStatus` 매핑)                        |
| `DuelCreateFormContainer.tsx`              | `duel_create`                                                              | 대결 생성 mutation 성공 시                                                    |
| `DuelResultContainer.tsx`                  | `error_view` / `duel_report_click`                                         | 미완료 대결 조회 에러, AI 리포트 보기 클릭                                    |
| `DuelReportContainer.tsx`                  | `duel_report_view`                                                         | 리포트가 준비된 상태로 화면에 노출된 시점                                     |
| `DuelMarketEventAccordion.tsx`             | `duel_market_event_expand`                                                 | 닫혀 있던 시황 분석 항목을 사용자가 펼친 시점                                 |
| `DuelDetailContainer.tsx`                  | `filter_chip_click`                                                        | 내 포트폴리오/AI 포트폴리오 토글 클릭                                         |
| `StockDetailContainer.tsx`                 | `stock_detail_view` / `filter_chip_click` / `trade_button_click`           | 종목 정보 조회, 차트/호가/내 주식 탭 클릭, 매수·판매하기 클릭                 |
| `useStockHoldingTabData.ts`                | `order_cancel`                                                             | 주문 취소 mutation `onSuccess`                                                |
| `StockChart.tsx`                           | `chart_period_change` / `chart_granularity_change` / `chart_detail_toggle` | 기간 칩, 분봉 칩, 자세한 차트 토글 버튼 클릭                                  |
| `useStockTradeOrder.ts`                    | `trade_attempt` / `trade_success` / `trade_fail`                           | 주문 mutation 호출 직전 / `onSuccess` / `onError`                             |
| `StockTradeContainer.tsx`                  | `trade_input_mode_change` / `trade_orderbook_select`                       | 숫자·호가 입력 모드 전환 버튼, 호가 리스트 가격 선택                          |
| `WithdrawConfirmModal.tsx`                 | `withdraw`                                                                 | 탈퇴 mutation `onSuccess` (`LogoutConfirmModal.tsx`의 `logout`과 동일한 패턴) |
| `TradeHistoryContainer.tsx`                | `filter_chip_click`                                                        | 매매내역 필터(전체/매수/매도) 클릭                                            |
| `HoldingsContainer.tsx`                    | `filter_chip_click`                                                        | 보유종목 카테고리 칩 클릭                                                     |

### 제외 항목

- **차트 크로스헤어 드래그·구간 선택** — `StockChartSelectionSummary`에 표시되는 값은 상세 차트 위 포인터 이동에 따라 매 프레임 바뀌는 연속값이라 클릭 단위 이벤트로 의미 있게 집계하기 어려워 V2에서는 제외한다.
- **AI 위임 버튼 관련 이벤트(`unsupported_feature_click` / `manual_investment`)** — 버튼 UI(`AiDelegationSwitch`)가 삭제되면서 이벤트를 쏘던 코드도 함께 삭제됐다. 타입 유니온에는 `manual_investment` 값이 아직 남아 있지만 실제로 발생시키는 코드가 없는 죽은 값이며, V2에서도 되살리지 않는다.
- **`trade_orderbook_select`의 체결 성공 연결** — 호가 선택은 가격 입력 보조 행동이고 이후 `trade_attempt`/`trade_success`로 결과가 이어지므로, 선택과 체결을 직접 연결하는 별도 파라미터는 추가하지 않는다.

## V3

V3 기능 확정 후 이벤트 추가
