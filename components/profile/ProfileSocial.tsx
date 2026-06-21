"use client";

import type { SocialLink } from "@/lib/types";
import { SOCIAL_PLATFORMS, SOCIAL_PLATFORM_ORDER } from "@/lib/social";
import { normalizeExternalHref, toInstagramUrl } from "@/lib/profile-utils";

/** 공개 페이지 하단 소셜 채널 아이콘 줄.
 *  기존 instagram_id는 social_links에 인스타가 없을 때만 폴백으로 표시.
 *  표시 순서는 SOCIAL_PLATFORM_ORDER로 고정. 인스타 클릭은 통계에 기록. */
export default function ProfileSocial({
  links,
  instagramId,
  profileId,
}: {
  links: SocialLink[];
  instagramId?: string | null;
  profileId?: string;
}) {
  const merged: SocialLink[] = [...links];
  if (!links.some((l) => l.platform === "instagram") && instagramId?.trim()) {
    merged.unshift({ platform: "instagram", url: toInstagramUrl(instagramId) });
  }

  const valid = merged
    .map((l) => ({ ...l, url: normalizeExternalHref(l.url) ?? "" }))
    .filter((l) => l.url && SOCIAL_PLATFORMS[l.platform])
    .sort(
      (a, b) =>
        SOCIAL_PLATFORM_ORDER.indexOf(a.platform) - SOCIAL_PLATFORM_ORDER.indexOf(b.platform),
    );

  if (!valid.length) return null;

  // 인스타 클릭만 통계 집계 대상 (track/click 화이트리스트 = kakao·instagram·phone)
  function handleClick(platform: string) {
    if (platform !== "instagram" || !profileId) return;
    fetch("/api/track/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId, linkType: "instagram" }),
    }).catch(() => {});
  }

  return (
    <div className="mt-6 flex flex-wrap items-center gap-2">
      {valid.map((link, i) => {
        const meta = SOCIAL_PLATFORMS[link.platform];
        return (
          <a
            key={`${link.platform}-${i}`}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={meta.label}
            title={meta.label}
            onClick={() => handleClick(link.platform)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/[0.06] text-(--muted) transition-colors hover:text-foreground"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d={meta.icon} />
            </svg>
          </a>
        );
      })}
    </div>
  );
}
