import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { MSWProvider } from "@/mocks/MSWProvider";
import { MobileContainer } from "@/shared/components/MobileContainer";
import { Toaster } from "@/shared/components/Toaster";
import { Providers } from "./providers";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "StockSpoon - AI와 함께하는 모의투자",
  description: "AI와 함께하는 손실 없는 모의투자 서비스",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ko" className="h-full overflow-hidden antialiased">
      <body className="h-full overflow-hidden">
        <MobileContainer>
          <MSWProvider>
            <Providers>{children}</Providers>
          </MSWProvider>
        </MobileContainer>
        <Toaster />
      </body>
    </html>
  );
}
