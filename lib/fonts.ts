/**
 * Pro 디자인 커스텀 — 폰트 선택지.
 * 공개 페이지(`app/[slug]/page.tsx`)에서 선택값을 `--font-body`/`--font-display`로 주입하고,
 * `googleHref`가 있으면 해당 페이지에서만 <link>를 조건부 로드한다(전체 사용자 폰트 로드 방지).
 */

const KO_FALLBACK =
  '"Pretendard Variable", "Pretendard", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif';

export type FontKey = "pretendard" | "gowun" | "jua" | "nanummyeongjo";

export type FontOption = {
  key: FontKey;
  label: string;       // 사용자 표시 이름
  hint: string;        // 분위기 한 줄
  /** --font-body / --font-display 에 들어갈 font-family 스택 */
  stack: string;
  /** Google Fonts 스타일시트 (기본 폰트는 추가 로드 없음) */
  googleHref?: string;
  /** 미리보기 버튼에 직접 적용할 font-family (CDN 로드 전이면 폴백) */
  previewFamily: string;
};

export const FONT_OPTIONS: FontOption[] = [
  {
    key: "pretendard",
    label: "기본 (프리텐다드)",
    hint: "깔끔하고 가독성 좋은 기본 글꼴",
    stack: KO_FALLBACK,
    previewFamily: KO_FALLBACK,
  },
  {
    key: "gowun",
    label: "고운돋움",
    hint: "단정하고 부드러운 느낌",
    stack: `"Gowun Dodum", ${KO_FALLBACK}`,
    googleHref: "https://fonts.googleapis.com/css2?family=Gowun+Dodum&display=swap",
    previewFamily: `"Gowun Dodum", ${KO_FALLBACK}`,
  },
  {
    key: "jua",
    label: "주아",
    hint: "둥글둥글 친근한 느낌",
    stack: `"Jua", ${KO_FALLBACK}`,
    googleHref: "https://fonts.googleapis.com/css2?family=Jua&display=swap",
    previewFamily: `"Jua", ${KO_FALLBACK}`,
  },
  {
    key: "nanummyeongjo",
    label: "나눔명조",
    hint: "우아하고 고급스러운 느낌",
    stack: `"Nanum Myeongjo", ${KO_FALLBACK}`,
    googleHref:
      "https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap",
    previewFamily: `"Nanum Myeongjo", ${KO_FALLBACK}`,
  },
];

export const DEFAULT_FONT_KEY: FontKey = "pretendard";

const FONT_MAP = new Map(FONT_OPTIONS.map((f) => [f.key, f]));

/** 문자열 키 → FontOption (없거나 잘못된 값이면 null) */
export function getFontOption(key?: string | null): FontOption | null {
  if (!key) return null;
  return FONT_MAP.get(key as FontKey) ?? null;
}

/** 저장 가능한 폰트 키인지 검증 (서버 액션용) */
export function isValidFontKey(key?: string | null): key is FontKey {
  return !!key && FONT_MAP.has(key as FontKey);
}
