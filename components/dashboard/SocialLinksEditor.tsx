"use client";

import type { SocialLink, SocialPlatform } from "@/lib/types";
import { SOCIAL_PLATFORMS, SOCIAL_PLATFORM_ORDER } from "@/lib/social";

type Props = {
  socialLinks: SocialLink[];
  setSocialLinks: (links: SocialLink[]) => void;
};

/** 편집 — 플랫폼별 URL 입력. 비우면 해당 채널 제거. */
export default function SocialLinksEditor({ socialLinks, setSocialLinks }: Props) {
  function getUrl(platform: SocialPlatform): string {
    return socialLinks.find((l) => l.platform === platform)?.url ?? "";
  }

  function setUrl(platform: SocialPlatform, url: string) {
    const others = socialLinks.filter((l) => l.platform !== platform);
    const trimmed = url.trim();
    setSocialLinks(trimmed ? [...others, { platform, url: trimmed }] : others);
  }

  return (
    <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-bold text-foreground">소셜 채널</h3>
      <p className="mt-1 text-xs leading-5 text-(--muted)">
        유튜브·블로그·틱톡 등 운영 중인 채널을 연결하면 공개 페이지 하단에 아이콘으로 표시돼요. 비워두면 표시되지 않아요.
      </p>
      <div className="mt-4 flex flex-col gap-2.5">
        {SOCIAL_PLATFORM_ORDER.map((platform) => {
          const meta = SOCIAL_PLATFORMS[platform];
          return (
            <div key={platform} className="flex items-center gap-2.5">
              <span
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/[0.05] text-(--muted)"
                title={meta.label}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={meta.icon} />
                </svg>
              </span>
              <input
                type="url"
                inputMode="url"
                value={getUrl(platform)}
                onChange={(e) => setUrl(platform, e.target.value)}
                placeholder={meta.placeholder}
                aria-label={`${meta.label} 링크`}
                className="min-w-0 flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-foreground"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
