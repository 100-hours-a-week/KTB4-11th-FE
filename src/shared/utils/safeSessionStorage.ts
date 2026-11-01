// sessionStorage 읽기·쓰기·삭제 중 예외가 발생해도 화면 동작 유지
export const safeSessionStorage: Pick<
  Storage,
  "getItem" | "setItem" | "removeItem"
> = {
  getItem(key) {
    try {
      return window.sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key, value) {
    try {
      window.sessionStorage.setItem(key, value);
    } catch {
      // 저장소 사용 불가 또는 용량 초과
    }
  },
  removeItem(key) {
    try {
      window.sessionStorage.removeItem(key);
    } catch {
      // 저장소 사용 불가
    }
  },
};
