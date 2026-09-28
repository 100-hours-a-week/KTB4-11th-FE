import Link from "next/link";
import { cn } from "@/shared/utils/cn";

interface TermsAgreementNoticeProps {
  action: string;
  className?: string;
}

const LINK_CLASS_NAME =
  "underline decoration-solid [text-decoration-skip-ink:none] [text-underline-position:from-font]";

export function TermsAgreementNotice({
  action,
  className,
}: TermsAgreementNoticeProps) {
  return (
    <p
      className={cn(
        "caption-1-semibold text-text-neutral-tertiary text-center",
        className,
      )}
    >
      {action} 시{" "}
      <Link href="/terms" className={LINK_CLASS_NAME}>
        이용약관
      </Link>
      {" 및 "}
      <Link href="/privacy" className={LINK_CLASS_NAME}>
        개인정보 처리방침
      </Link>
      에 동의하게 됩니다.
    </p>
  );
}
