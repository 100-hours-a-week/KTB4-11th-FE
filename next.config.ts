import { withSentryConfig } from "@sentry/nextjs/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
