import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // eslint-disable-next-line no-console -- CloudWatch가 컨테이너 stdout을 수집
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      method: request.method,
      pathname: request.nextUrl.pathname,
    }),
  );

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
