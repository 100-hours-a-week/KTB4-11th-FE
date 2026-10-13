"use client";

import { useRouter } from "next/navigation";
import CalendarIcon from "@/assets/icons/fill/calendar.svg";
import { DuelMarketEventAccordion } from "@/features/ai/components/DuelMarketEventAccordion";
import type {
  DuelJudgmentClue,
  DuelMarketEvent,
} from "@/features/ai/types/duel";
import { Header, HeaderBackButton } from "@/shared/components/Header";

// TODO : 실제 AI 리포트 조회 API 연동 시 제거
const DEMO_REPORT_HEADER = {
  name: "8월 반도체 집중",
  startDate: "2026.08.14",
  endDate: "09.07",
};

// TODO : 실제 AI 리포트 조회 API 연동 시 제거
const DEMO_MARKET_EVENTS: DuelMarketEvent[] = [
  {
    date: "8.25",
    title:
      "동국제약, 화장품 해외 유통망 확대로 '1조 클럽' 진입 눈앞…올해 화장품 수출 1200억~1400억 전망",
    body: "동국제약이 올해 연 매출 1조 원 이상을 기록한 제약사 모임인 '1조 클럽'에 진입할 것으로 예상된다. 올해 상반기 매출은 5099억 원, 영업이익은 534억 원으로 전년 대비 각각 11.5%, 12.6% 증가했으며, 화장품을 포함한 헬스케어 사업 매출은 2029억 원으로 전년 동기 대비 28.7% 증가했다. 마데카크림은 누적 판매량 1억 개를 돌파했고, 미국·일본의 코스트코·얼타 뷰티·돈키호테 등 오프라인 유통망 입점과 아마존·틱톡샵 등 온라인 채널을 통해 해외 판매가 확대되고 있다. IBK투자증권과 LS증권은 동국제약의 하반기 및 연간 실적을 전망하며 투자의견 '매수'와 목표주가 3만 원을 제시했고, 올해 화장품 수출액은 1200억~1400억 원으로 전년 대비 4배 이상 증가할 것으로 내다봤다.",
  },
  {
    date: "8.22",
    title:
      "두산로보틱스·딥엑스 컨소시엄, 989억원 규모 국책과제 2건 수주…국산 NPU 기반 협동로봇·AI 용접 솔루션 개발",
    body: "두산로보틱스는 산업통상부와 한국산업기술기획평가원이 공동 주관한 'K-온디바이스 AI 반도체 기술개발사업'과 '로봇산업 기술개발사업'에서 차세대 협동로봇 과제와 지능형 용접 솔루션 과제가 모두 국책과제로 선정됐다고 6일 밝혔다. 두 과제의 총 연구개발비는 약 989억 원이며 이 중 정부 지원금은 약 681억 원이다. 차세대 협동로봇 과제는 국산 AI 시스템반도체(SoC)에 NPU와 실시간 통신·제어 기능을 탑재해 외부 PC나 클라우드 없이 로봇이 스스로 인지·판단·제어를 수행하는 것을 핵심으로 한다. 두산로보틱스는 가반하중 5·10·20㎏급 협동로봇 3종과 양팔 작업·전방향 이동이 가능한 산업용 휴머노이드를 개발하고, 2곳 이상 수요 현장에서 72시간 무중단 실증과 국제 안전인증을 거쳐 2031년부터 표준 제품으로 상용화할 계획이다. 지능형 용접 솔루션 과제는 협동로봇에 AI와 디지털 트윈을 결합해 원전 기자재 수준의 고난도 용접을 자동화하는 것이 핵심으로, 두산로보틱스·딥엑스·세이지·국립창원대학교 산학협력단이 공동 개발하고 두산에너빌리티 원전 기자재 제조 현장에서 실증한 뒤 2030년부터 사업화를 추진한다.",
  },
  {
    date: "8.21",
    title:
      "삼성전자, 갤럭시 탭 S12·스마트태그3·버즈 온 국내 출시…태블릿에 포토샵 탑재",
    body: "삼성전자가 갤럭시 탭 S12 시리즈, 갤럭시 스마트태그3, 갤럭시 버즈 온을 공개했다. 갤럭시 탭 S12 시리즈와 스마트태그3는 7일, 버즈 온은 27일 국내에 출시된다. 갤럭시 탭 S12 시리즈는 안드로이드 태블릿 최초로 어도비 포토샵을 기본 탑재했으며 멀티태스킹에 최적화된 갤럭시 AI 기능과 S펜을 지원한다. 스마트태그3는 전작보다 작고 가벼워졌고 iOS 기기와의 호환을 지원하며 최대 790일까지 사용할 수 있는 배터리를 갖췄다. 갤럭시 버즈 온은 귀를 막지 않는 클립형 무선 이어폰으로 갤럭시 AI를 지원하는 기기와 연결해 음성으로 제미나이 라이브를 실행할 수 있다.",
  },
];

// TODO : 실제 AI 리포트 조회 API 연동 시 제거
const DEMO_JUDGMENT_CLUES: DuelJudgmentClue[] = [
  {
    title: "인플레이션",
    description:
      "8월 소비자물가지수 인플레이션은 2.6%로 상승했습니다. 이는 아직 불확실성 관리가 어느 정도 계획대로 진행되고 있음을 뜻합니다. 다만 동시에 기준 금리 인하가 잠시 중단될 가능성이 커졌으며, 이는 시장의 금리 전망과 투자 심리에 영향을 줄 수 있습니다.",
  },
  {
    title: "투자 트렌드",
    description:
      "구글, 메타, TSMC, Adobe, Broadcom 등 AI 중심의 대형 기술기업들이 두 자릿수 수익률을 기대할 수 있는 투자 대상으로 주목받고 있습니다. 생성형 AI의 빠른 확산은 과거 페이스북이 빠르게 성장하던 시기와 비교되고 있으며, AI 기술 분야에 상당한 투자 기회가 존재한다는 평가가 나오고 있습니다.",
  },
];

interface DuelReportContainerProps {
  id: string;
}

export function DuelReportContainer({ id: _id }: DuelReportContainerProps) {
  const router = useRouter();

  return (
    <div className="pt-screen-top flex h-full flex-col">
      <Header
        className="px-5 py-3"
        left={<HeaderBackButton onClick={() => router.back()} />}
        title="AI 리포트"
      />

      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5 pt-4 pb-10">
        <div className="flex flex-col gap-1">
          <span className="heading-1-bold">{DEMO_REPORT_HEADER.name}</span>
          <span className="body-2-regular text-text-neutral-secondary flex items-center gap-1">
            <CalendarIcon width={14} height={14} className="text-icon-accent" />
            {DEMO_REPORT_HEADER.startDate} ~ {DEMO_REPORT_HEADER.endDate}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="body-1-bold">AI가 분석한 시장</span>
          <div className="bg-bg-layer-default rounded-2xl px-4">
            <DuelMarketEventAccordion items={DEMO_MARKET_EVENTS} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="body-1-bold">AI의 판단 단서</span>
          <div className="flex flex-col gap-2">
            {DEMO_JUDGMENT_CLUES.map((clue) => (
              <div
                key={clue.title}
                className="bg-bg-layer-default flex flex-col gap-1 rounded-2xl p-4"
              >
                <span className="body-2-semibold">{clue.title}</span>
                <p className="body-2-regular text-text-neutral-secondary text-justify">
                  {clue.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
