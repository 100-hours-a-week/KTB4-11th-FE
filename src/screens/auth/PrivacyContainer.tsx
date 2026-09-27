import {
  PRIVACY_INTRO,
  PRIVACY_SECTIONS,
  PRIVACY_TITLE,
} from "@/features/auth/legalContentData";
import { LegalContent } from "@/features/auth/components/LegalContent";
import { Header, HeaderBackButton } from "@/shared/components/Header";

export function PrivacyContainer() {
  return (
    <div className="pt-safe-top flex h-full flex-col">
      <Header
        title={PRIVACY_TITLE}
        className="px-5 py-3"
        left={<HeaderBackButton />}
      />

      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-8">
        <p className="body-2-regular text-text-neutral-secondary mb-4">
          {PRIVACY_INTRO}
        </p>
        <LegalContent sections={PRIVACY_SECTIONS} />
      </div>
    </div>
  );
}
