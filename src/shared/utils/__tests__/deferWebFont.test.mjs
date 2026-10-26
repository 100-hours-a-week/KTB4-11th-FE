import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { deferWebFont } from "../deferWebFont.ts";

const originalWindow = globalThis.window;
const originalDocument = globalThis.document;
afterEach(() => {
  globalThis.window = originalWindow;
  globalThis.document = originalDocument;
});

function setup() {
  let fetching = 1;
  let notify;
  let load;
  let nextId = 0;
  const idle = new Map();
  const applied = [];
  globalThis.document = {
    readyState: "loading",
    documentElement: {
      style: { setProperty: (...args) => applied.push(args) },
    },
  };
  globalThis.window = {
    addEventListener: (_, callback) => {
      load = callback;
    },
    removeEventListener: () => {
      load = undefined;
    },
    requestIdleCallback: (callback) => {
      idle.set(++nextId, callback);
      return nextId;
    },
    cancelIdleCallback: (id) => idle.delete(id),
  };
  const client = {
    isFetching: () => fetching,
    getQueryCache: () => ({
      subscribe: (callback) => {
        notify = callback;
        return () => {
          notify = undefined;
        };
      },
    }),
  };
  return {
    idle,
    applied,
    client,
    setFetching: (value) => {
      fetching = value;
      notify?.();
    },
    loaded: () => {
      document.readyState = "complete";
      load?.();
    },
    flush: () => {
      const callbacks = [...idle.values()];
      idle.clear();
      callbacks.forEach((cb) => cb());
    },
  };
}

// 초기 리소스와 데이터 조회가 모두 끝난 뒤 한 번만 폰트 적용 확인
test("waits for load and pending queries before applying the font once", () => {
  const state = setup();
  const cleanup = deferWebFont(state.client);
  state.loaded();
  assert.equal(state.idle.size, 0);
  state.setFetching(0);
  assert.equal(state.idle.size, 1);
  state.flush();
  assert.deepEqual(state.applied, [
    ["--font-pretendard", '"Pretendard Variable"'],
  ]);
  state.setFetching(1);
  state.setFetching(0);
  assert.equal(state.idle.size, 0);
  cleanup();
});

// 새 조회 시작과 컴포넌트 해제 시 예약된 폰트 적용 취소 확인
test("cancels scheduled work when a query starts or the loader unmounts", () => {
  const state = setup();
  const cleanup = deferWebFont(state.client);
  state.loaded();
  state.setFetching(0);
  state.setFetching(1);
  assert.equal(state.idle.size, 0);
  state.setFetching(0);
  cleanup();
  state.flush();
  assert.equal(state.applied.length, 0);
});
