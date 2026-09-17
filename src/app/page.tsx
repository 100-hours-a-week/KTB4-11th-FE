import { KakaoLoginButton } from "@/features/login/components/KakaoLoginButton";

export default function LoginPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 px-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="title-1">StockSpoon</h1>
        <p className="body-2-regular text-text-neutral-secondary">
          AI와 함께 시작하는 모의투자
        </p>
      </div>
      <KakaoLoginButton />
    </div>
  );
}
