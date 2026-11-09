import { withSentryConfig } from "@sentry/nextjs/config";
import type { NextConfig } from "next";
import { STOCK_LOGO_BASE_URL } from "./src/shared/constants/stockLogo";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "k.kakaocdn.net",
        port: "",
        pathname: "/dn/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: new URL(STOCK_LOGO_BASE_URL).hostname,
      },
    ],
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

export default withSentryConfig(nextConfig, {
  org: "9e4bc6e1ec1d",
  project: "stockspoon-fe",
  /** SENTRY_AUTH_TOKEN이 있을 때만(CI 빌드) 소스맵 업로드 */
  silent: !process.env.CI,
  /** 소스맵 업로드 후 클라이언트 번들에서 제거 (원본 코드 유출 방지) */
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
  bundleSizeOptimizations: {
    excludeDebugStatements: true,
  },
});
