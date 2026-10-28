import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { registerHooks } from "node:module";

// Node 단독 테스트에서 확장자를 생략한 TypeScript 모듈 경로 해석
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.endsWith("/requestServerApi")) specifier += ".ts";
    return nextResolve(specifier, context);
  },
});
const { requestServerHomeData } = await import("../requestServerHomeData.ts");

const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
});

// 홈 조회 조건과 인증 전달 확인 및 느린 API와 무관한 영역별 완료 검증
test("starts all home requests together and resolves each independently", async () => {
  const calls = [];
  let releaseHoldings;
  globalThis.fetch = async (url, options) => {
    calls.push({ url: String(url), options });
    if (String(url).includes("/holdings"))
      await new Promise((resolve) => {
        releaseHoldings = resolve;
      });
    return Response.json({ ok: true });
  };
  const requests = requestServerHomeData(
    "https://api.example.com",
    "token",
    772,
  );
  assert.equal(calls.length, 3);
  assert.deepEqual(
    calls.map((c) => c.url),
    [
      "https://api.example.com/api/v1/users/me/accounts/772",
      "https://api.example.com/api/v1/users/me/accounts/772/holdings?sort=latest_purchase&order=desc&limit=3",
      "https://api.example.com/api/v1/accounts/772/orders?limit=3&order_status=executed",
    ],
  );
  for (const { options } of calls) {
    assert.equal(options.headers.Cookie, "access_token=token");
    assert.equal(options.cache, "no-store");
    assert.equal(options.redirect, "error");
    assert.ok(options.signal instanceof AbortSignal);
  }
  assert.deepEqual(await requests.account, { ok: true });
  assert.deepEqual(await requests.orders, { ok: true });
  releaseHoldings();
  assert.deepEqual(await requests.holdings, { ok: true });
});

// 인증 만료와 서버 장애가 발생한 영역만 브라우저 재조회로 전환 검증
test("keeps successful sections when another request fails", async () => {
  globalThis.fetch = async (url) => {
    if (String(url).includes("/holdings")) throw new Error("timeout");
    if (String(url).includes("/orders"))
      return new Response(null, { status: 401 });
    return Response.json({ account_id: 772 });
  };
  const requests = requestServerHomeData(
    "https://api.example.com",
    "token",
    772,
  );
  assert.deepEqual(await requests.account, { account_id: 772 });
  assert.equal(await requests.holdings, null);
  assert.equal(await requests.orders, null);
});
