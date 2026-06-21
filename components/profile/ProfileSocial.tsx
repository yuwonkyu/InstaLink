import type { SocialLink } from "@/lib/types";
import { SOCIAL_PLATFORMS } from "@/lib/social";
import { normalizeExternalHref } from "@/lib/profile-utils";

/** 공개 페이지 하단 소셜 채널 아이콘 줄 */
export default function ProfileSocial({ links }: { links: SocialLink[] }) {
  const valid = links
    .map((l) => ({ ...l, url: normalizeExternalHref(l.url) ?? "" }))
    .filter((l) => l.url && SOCIAL_PLATFORMS[l.platform]);

  if (!valid.length) return null;

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
