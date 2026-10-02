"use client";

import { useEffect, useRef } from "react";
import { AiExecutionResult } from "@/features/ai/components/AiExecutionResult";
import { AiOneLineJudgmentCard } from "@/features/ai/components/AiOneLineJudgmentCard";
import { AiReasoningTitle } from "@/features/ai/components/AiReasoningTitle";
import { FromBuyToSell } from "@/features/ai/components/FromBuyToSell";
import { JudgmentFlowAccordion } from "@/features/ai/components/JudgmentFlowAccordion";
import { useAiReportQuery } from "@/features/ai/hooks/useAiReportQuery";
import {
  toBuyExecutionResult,
  toBuyReasoningTitle,
  toFromBuyToSell,
  toJudgmentFlow,
  toSellExecutionResult,
  toSellReasoningTitle,
} from "@/features/ai/utils/toAiReasoningView";
import { useSelectedAccountId } from "@/features/account/hooks/useSelectedAccountId";
import { ErrorState } from "@/shared/components/ErrorState";
import { Header, HeaderBackButton } from "@/shared/components/Header";
import { getElapsedBucket, trackEvent } from "@/shared/utils/analytics";

interface AiReasoningContainerProps {
  orderId: number;
}

export function AiReasoningContainer({ orderId }: AiReasoningContainerProps) {
  const accountId = useSelectedAccountId();
  const {
    data: report,
    isError,
    refetch,
  } = useAiReportQuery(accountId, orderId);

  const isBuy = report?.order_side === "buy";
  const headerTitle = isBuy ? "매수 판단 근거" : "매도 판단 근거";

  const hasTrackedView = useRef(false);
  useEffect(() => {
    if (report && !hasTrackedView.current) {
      hasTrackedView.current = true;
      trackEvent("ai_reason_view", {
        stock_code: report.stock_code,
        trade_type: report.order_side,
        elapsed_bucket: getElapsedBucket(report.execution.executed_at),
      });
    }
  }, [report]);

  useEffect(() => {
    if (isError) {
      trackEvent("error_view", {
        screen: "ai_reasoning",
        api_name: "ai_report",
      });
    }
  }, [isError]);

  return (
    <div className="pt-screen-top flex h-full flex-col">
      <Header
        title={headerTitle}
        className="px-5 py-3"
        left={<HeaderBackButton />}
      />

      {isError ? (
        <ErrorState
          onRetry={() => {
            trackEvent("retry_click", {
              screen: "ai_reasoning",
              api_name: "ai_report",
            });
            refetch();
          }}
        />
      ) : (
        report && (
          <div className="flex flex-1 flex-col gap-6 px-5 pt-4 pb-8">
            <div className="flex flex-col gap-4">
              <AiReasoningTitle
                {...(isBuy
                  ? toBuyReasoningTitle(report)
                  : toSellReasoningTitle(report))}
              />
              <AiOneLineJudgmentCard oneLineJudgment={report.summary} />
            </div>

            <div className="flex flex-col gap-2">
              <span className="body-1-bold">실행 결과</span>
              <AiExecutionResult
                items={
                  isBuy
                    ? toBuyExecutionResult(report)
                    : toSellExecutionResult(report)
                }
              />
            </div>

            {isBuy ? (
              <div className="flex flex-col gap-2">
                <span className="body-1-bold">판단 흐름</span>
                <JudgmentFlowAccordion steps={toJudgmentFlow(report)} />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <span className="body-1-bold">매수부터 매도까지</span>
                <FromBuyToSell items={toFromBuyToSell(report)} />
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}
