import type { CustomLink } from "@/lib/types";
import { toInstagramUrl } from "@/lib/profile-utils";

/**
 * 신규 가입자의 첫 페이지가 비어 보이지 않도록 넣는 예시 링크 2개.
 * - 첫 공개 시점에 custom_links 가 "비어 있을 때만" 시드한다(실제 링크는 절대 덮지 않음).
 * - 사용자는 에디터에서 자신의 링크로 교체한다(BasicTab 안내 문구로 유도).
 */
export function getExampleLinks(
  siteUrl: string,
  instagramId?: string | null,
): CustomLink[] {
  const igUrl = instagramId?.trim()
    ? toInstagramUrl(instagramId)
    : "https://instagram.com";

  return [
    { title: "InstaLink 대시보드", url: `${siteUrl}/dashboard`, style: "card" },
    { title: "인스타그램", url: igUrl, style: "card" },
  ];
}
