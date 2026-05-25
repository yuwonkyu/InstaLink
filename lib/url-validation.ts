import type { CustomLink } from "@/lib/types";

type UrlFields = {
  customLinks: CustomLink[];
  instagramId: string;
};

export function validateProfileUrls(fields: UrlFields): string | null {
  for (let i = 0; i < (fields.customLinks ?? []).length; i++) {
    const link = fields.customLinks[i];
    const v = link?.url?.trim();
    if (!v) continue;
    try {
      const u = new URL(v);
      if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error();
    } catch {
      const labelText = link.title?.trim() || link.label?.trim() || "(이름 없음)";
      return `[링크 ${i + 1}번 — "${labelText}"] "${v}"는 올바른 주소가 아닙니다.\nhttps:// 부터 시작하는 전체 주소를 입력해주세요.`;
    }
  }

  if (fields.instagramId && !/^[a-zA-Z0-9_.]{1,30}$/.test(fields.instagramId.trim())) {
    return `[인스타그램 ID] "${fields.instagramId}"는 사용할 수 없습니다.\n@를 빼고 영문, 숫자, 밑줄(_), 점(.)만 입력해주세요. (예: fitwithji)`;
  }

  return null;
}
