import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { requestServerUser } from "../requestServerUser.ts";

// 다음 테스트에 가짜 응답이 남지 않도록 각 테스트 종료 후 원래 fetch 복원
const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
});

// 액세스 쿠키 전달·사용자별 응답 분리·불필요한 응답 필드 제외 확인
test("forwards only the access cookie and never caches personal data", async () => {
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url: String(url), options });
    return Response.json({
      nickname: options.headers.Cookie,
      profile_image_url: "http://example.com/profile",
      onboarding_completed: true,
      private_field: "must not hydrate",
    });
  };
  const first = await requestServerUser("https://api.example.com", "user-a");
  const second = await requestServerUser("https://api.example.com", "user-b");
  assert.equal(calls.length, 2);
  assert.equal(calls[0].url, "https://api.example.com/api/v1/users/me");
  assert.equal(calls[0].options.cache, "no-store");
  assert.equal(calls[0].options.redirect, "error");
  assert.deepEqual(calls[0].options.headers, { Cookie: "access_token=user-a" });
  assert.ok(calls[0].options.signal instanceof AbortSignal);
  assert.equal(first.nickname, "access_token=user-a");
  assert.equal(second.nickname, "access_token=user-b");
  assert.equal(first.profile_image_url, "https://example.com/profile");
  assert.equal("private_field" in first, false);
});

// 인증 만료 시 브라우저가 세션 복구를 시도할 수 있도록 null 반환 확인
test("401 delegates to browser session recovery", async () => {
  globalThis.fetch = async () => new Response(null, { status: 401 });
  assert.equal(
    await requestServerUser("https://api.example.com", "expired"),
    null,
  );
});

// 권한·요청 제한·서버 오류를 비로그인으로 처리하지 않고 오류로 전달하는지 확인
test("backend failures are not treated as logged-out sessions", async () => {
  for (const status of [403, 429, 500, 503]) {
    globalThis.fetch = async () => new Response(null, { status });
    await assert.rejects(
      requestServerUser("https://api.example.com", "valid"),
      new RegExp(String(status)),
    );
  }
});

// 요청 시간 초과를 비로그인으로 처리하지 않고 원래 오류로 전달하는지 확인
test("network/timeout errors propagate without exposing credentials", async () => {
  globalThis.fetch = async () => {
    throw new DOMException("Request timed out", "TimeoutError");
  };
  await assert.rejects(requestServerUser("https://api.example.com", "valid"), {
    name: "TimeoutError",
  });
});

// 응답이 성공해도 사용자 정보 형식이 잘못되면 오류로 처리하는지 확인
test("malformed successful responses cannot grant an onboarded session", async () => {
  for (const body of [
    null,
    {},
    {
      nickname: "user",
      profile_image_url: null,
      onboarding_completed: "false",
    },
  ]) {
    globalThis.fetch = async () => Response.json(body);
    await assert.rejects(
      requestServerUser("https://api.example.com", "valid"),
      /응답 형식/,
    );
  }
});
