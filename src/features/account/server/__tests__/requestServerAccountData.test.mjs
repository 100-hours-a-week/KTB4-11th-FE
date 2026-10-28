import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { registerHooks } from "node:module";

// Node 단독 테스트에서 공통 서버 요청 모듈의 TypeScript 경로 해석
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.endsWith("/requestServerApi")) specifier += ".ts";
    return nextResolve(specifier, context);
  },
});
const { requestServerAccountDetail } =
  await import("../requestServerAccountData.ts");

const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
});

const account = {
  account_id: 772,
  account_name: "기본 계좌",
  is_duel_account: false,
  initial_capital: 10_000,
  cash_balance: 10_000,
  available_cash: 10_000,
  holdings_market_value: 0,
  total_assets: 10_000,
  return_percent: 0,
  executed_trade_count: 0,
  message: "조회 성공",
};

// 쿠키로 전달받은 선택 계좌의 상세 정보만 서버에서 조회 확인
test("requests only the selected account detail", async () => {
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url: String(url), options });
    return Response.json(account);
  };

  const data = await requestServerAccountDetail(
    "https://api.example.com",
    "access-token",
    772,
  );

  assert.equal(calls.length, 1);
  assert.equal(
    calls[0].url,
    "https://api.example.com/api/v1/users/me/accounts/772",
  );
  assert.deepEqual(calls[0].options.headers, {
    Cookie: "access_token=access-token",
  });
  assert.equal(calls[0].options.cache, "no-store");
  assert.deepEqual(data, account);
});

// 오래된 선택 계좌는 기존 브라우저 조회 흐름으로 넘기기 위해 빈 결과 반환 확인
test("returns null when the selected account is unavailable", async () => {
  globalThis.fetch = async (url) => {
    assert.equal(
      String(url),
      "https://api.example.com/api/v1/users/me/accounts/999",
    );
    return new Response(null, { status: 404 });
  };

  const data = await requestServerAccountDetail(
    "https://api.example.com",
    "access-token",
    999,
  );

  assert.equal(data, null);
});
