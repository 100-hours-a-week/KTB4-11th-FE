import { TERMS_SECTIONS, TERMS_TITLE } from "@/features/auth/legalContentData";
import { LegalContent } from "@/features/auth/components/LegalContent";
import { Header, HeaderBackButton } from "@/shared/components/Header";

export function TermsContainer() {
  return (
    <div className="pt-screen-top flex h-full flex-col">
      <Header
        title={TERMS_TITLE}
        className="px-5 py-3"
        left={<HeaderBackButton />}
      />

      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-8">
        <LegalContent sections={TERMS_SECTIONS} />
      </div>
    </div>
  );
}
