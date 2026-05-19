import type { CustomLink } from "@/lib/types";

type UrlFields = {
  kakaoUrl: string;
  kakaoBookingUrl: string;
  kakaoChanUrl: string;
  naverBookingUrl: string;
  instaDmUrl: string;
  customLinks: CustomLink[];
  instagramId: string;
};

type UrlCheck = {
  label: string;
  value: string;
  requireKakao?: boolean;
  requireNaver?: boolean;
  example: string;
};

export function validateProfileUrls(fields: UrlFields): string | null {
  const checks: UrlCheck[] = [
    { label: "카카오 오픈채팅 URL", value: fields.kakaoUrl,        requireKakao: true, example: "https://open.kakao.com/o/예시" },
    { label: "카카오 예약 URL",     value: fields.kakaoBookingUrl, requireKakao: true, example: "https://pf.kakao.com/_예시" },
    { label: "카카오채널 URL",       value: fields.kakaoChanUrl,    requireKakao: true, example: "https://pf.kakao.com/_채널아이디" },
    { label: "네이버 예약 URL",     value: fields.naverBookingUrl, requireNaver: true, example: "https://booking.naver.com/..." },
    { label: "인스타 DM URL",       value: fields.instaDmUrl,                          example: "https://ig.me/m/아이디" },
  ];

  for (const c of checks) {
    const v = c.value?.trim();
    if (!v) continue;

    let parsed: URL;
    try {
      parsed = new URL(v);
    } catch {
      return `[${c.label}] 입력하신 "${v}"는 올바른 주소가 아닙니다. 전체 주소를 https:// 부터 그대로 복사해 붙여넣어 주세요.\n예시: ${c.example}`;
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return `[${c.label}] http:// 또는 https:// 로 시작하는 주소만 사용할 수 있습니다.\n예시: ${c.example}`;
    }

    if (c.requireKakao) {
      const host = parsed.hostname.toLowerCase();
      if (host !== "open.kakao.com" && host !== "pf.kakao.com") {
        return `[${c.label}] 이 칸에는 카카오 주소만 넣을 수 있어요. (open.kakao.com 또는 pf.kakao.com)\n현재 입력: "${v}"\n예시: ${c.example}`;
      }
    }

    if (c.requireNaver) {
      const host = parsed.hostname.toLowerCase();
      if (!host.endsWith("naver.com")) {
        return `[${c.label}] 네이버 예약 페이지 주소(booking.naver.com)를 넣어주세요.\n현재 입력: "${v}"\n예시: ${c.example}`;
      }
    }
  }

  for (let i = 0; i < (fields.customLinks ?? []).length; i++) {
    const link = fields.customLinks[i];
    const v = link?.url?.trim();
    if (!v) continue;
    try {
      const u = new URL(v);
      if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error();
    } catch {
      const labelText = link.label?.trim() || "(이름 없음)";
      return `[추가 링크 ${i + 1}번 — "${labelText}"] "${v}"는 올바른 주소가 아닙니다.\nhttps:// 부터 시작하는 전체 주소를 입력해주세요.`;
    }
  }

  if (fields.instagramId && !/^[a-zA-Z0-9_.]{1,30}$/.test(fields.instagramId.trim())) {
    return `[인스타그램 ID] "${fields.instagramId}"는 사용할 수 없습니다.\n@를 빼고 영문, 숫자, 밑줄(_), 점(.)만 입력해주세요. (예: fitwithji)`;
  }

  return null;
}
