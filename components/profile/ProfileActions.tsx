"use client";

import Image from "next/image";
import type { CustomLink } from "@/lib/types";
import { getLinkTitle } from "@/lib/types";
import { normalizeExternalHref } from "@/lib/profile-utils";
import { PLAN_LIMITS, toPlanKey } from "@/lib/plan-limits";

type Props = {
  customLinks?: CustomLink[] | null;
  btnColor: string | null;
  btnTextColor: string | null;
  plan?: string | null;
  // 기존 CTA 필드 — 마이그레이션 전 폴백용
  kakaoUrl?: string | null;
  kakaoBookingUrl?: string | null;
  kakaoChannelUrl?: string | null;
  naverBookingUrl?: string | null;
  instagramDmUrl?: string | null;
  profileId: string;
};

export default function ProfileActions({
  customLinks, btnColor, btnTextColor, plan,
  kakaoUrl, kakaoBookingUrl, kakaoChannelUrl, naverBookingUrl, instagramDmUrl,
}: Props) {
  const planKey = toPlanKey(plan);
  const limit = PLAN_LIMITS[planKey].links;
  const isFree = planKey === "free";

  // custom_links가 없으면 구형 CTA 필드로 폴백 (마이그레이션 전 기존 유저 보호)
  const hasCustomLinks = (customLinks?.length ?? 0) > 0;
  const hasLegacyCta = !hasCustomLinks && !!(kakaoUrl || kakaoBookingUrl || kakaoChannelUrl || naverBookingUrl || instagramDmUrl);

  if (!hasCustomLinks && !hasLegacyCta) return null;

  if (hasLegacyCta) {
    return <LegacyCtaFallback
      kakaoUrl={kakaoUrl}
      kakaoBookingUrl={kakaoBookingUrl}
      kakaoChannelUrl={kakaoChannelUrl}
      naverBookingUrl={naverBookingUrl}
      instagramDmUrl={instagramDmUrl}
      btnColor={btnColor}
      btnTextColor={btnTextColor}
    />;
  }

  const visible = (limit === Infinity ? customLinks! : customLinks!.slice(0, limit))
    .map((link) => ({ ...link, url: normalizeExternalHref(link.url) ?? "" }))
    .filter((link) => link.url);

  const hiddenCount = limit === Infinity ? 0 : Math.max(0, (customLinks?.length ?? 0) - (limit as number));

  return (
    <div className="mt-5 flex flex-col gap-3">
      {visible.map((link, idx) => {
        const title = getLinkTitle(link);
        const style = link.style ?? "text";
        if (style === "card") return <CardLink key={idx} link={{ ...link, url: link.url }} title={title} btnColor={btnColor} btnTextColor={btnTextColor} />;
        if (style === "thumb") return <ThumbLink key={idx} link={{ ...link, url: link.url }} title={title} btnColor={btnColor} btnTextColor={btnTextColor} />;
        return <TextLink key={idx} link={{ ...link, url: link.url }} title={title} btnColor={btnColor} btnTextColor={btnTextColor} />;
      })}
      {hiddenCount > 0 && (
        <div className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-black/10 py-3 text-xs text-(--muted)">
          <span>🔒</span>
          <span>링크 {hiddenCount}개 더 보려면 업그레이드 필요</span>
        </div>
      )}
    </div>
  );
}

// ── 카드형 ────────────────────────────────────────────────────

function CardLink({
  link, title, btnColor, btnTextColor,
}: { link: CustomLink & { url: string }; title: string; btnColor: string | null; btnTextColor: string | null }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block overflow-hidden rounded-2xl border border-black/[0.07] shadow-sm active:translate-y-px transition-transform"
    >
      {link.image_url ? (
        <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
          <Image src={link.image_url} alt={title} fill sizes="480px" className="object-cover" />
        </div>
      ) : (
        <div className="aspect-video w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <span className="text-3xl">🔗</span>
        </div>
      )}
      <div
        className="px-4 py-3"
        style={
          btnColor
            ? { backgroundColor: btnColor, color: btnTextColor || "#fff" }
            : { backgroundColor: "rgba(255,255,255,0.6)", color: "#111827" }
        }
      >
        <p className="text-sm font-semibold">{title}</p>
      </div>
    </a>
  );
}

// ── 썸네일형 ──────────────────────────────────────────────────

function ThumbLink({
  link, title, btnColor, btnTextColor,
}: { link: CustomLink & { url: string }; title: string; btnColor: string | null; btnTextColor: string | null }) {
  const bg = btnColor ?? "rgba(255,255,255,0.6)";
  const color = btnColor ? (btnTextColor || "#fff") : "#111827";
  const border = btnColor ? "none" : "1px solid rgba(0,0,0,0.09)";

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex min-h-14 items-center gap-3 overflow-hidden rounded-xl px-3 shadow-sm active:translate-y-px transition-transform"
      style={{ backgroundColor: bg, color, border }}
    >
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
        {link.image_url ? (
          <Image src={link.image_url} alt="" fill sizes="40px" className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-lg">🔗</div>
        )}
      </div>
      <span className="flex-1 text-sm font-semibold">{title}</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-40">
        <path d="M9 18l6-6-6-6" />
      </svg>
    </a>
  );
}

// ── 텍스트형 ──────────────────────────────────────────────────

function TextLink({
  link, title, btnColor, btnTextColor,
}: { link: CustomLink & { url: string }; title: string; btnColor: string | null; btnTextColor: string | null }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium active:translate-y-px transition-transform"
      style={
        btnColor
          ? { backgroundColor: btnColor, color: btnTextColor || "#fff", border: "none" }
          : { backgroundColor: "rgba(255,255,255,0.6)", color: "#111827", border: "1px solid rgba(0,0,0,0.09)" }
      }
    >
      {title}
    </a>
  );
}

// ── 구형 CTA 폴백 (마이그레이션 전 기존 유저용) ───────────────

function LegacyCtaFallback({
  kakaoUrl, kakaoBookingUrl, kakaoChannelUrl, naverBookingUrl, instagramDmUrl,
  btnColor, btnTextColor,
}: {
  kakaoUrl?: string | null; kakaoBookingUrl?: string | null; kakaoChannelUrl?: string | null;
  naverBookingUrl?: string | null; instagramDmUrl?: string | null;
  btnColor: string | null; btnTextColor: string | null;
}) {
  const items = [
    kakaoUrl && { href: kakaoUrl, label: "카카오톡으로 무료 상담 받기", bg: "#FEE500", color: "#000" },
    kakaoBookingUrl && { href: kakaoBookingUrl, label: "카카오로 예약하기", bg: "#FEE500", color: "#000" },
    kakaoChannelUrl && { href: kakaoChannelUrl, label: "카카오채널 문의", bg: "#FEE500", color: "#000" },
    naverBookingUrl && { href: naverBookingUrl, label: "네이버로 예약하기", bg: "#03C75A", color: "#fff" },
    instagramDmUrl && { href: instagramDmUrl, label: "인스타그램 DM 보내기", bg: "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", color: "#fff" },
  ].filter(Boolean) as { href: string; label: string; bg: string; color: string }[];

  if (!items.length) return null;

  const [primary, ...secondary] = items.map((item) => ({ ...item, href: normalizeExternalHref(item.href) ?? item.href }));

  return (
    <div className="mt-5 flex flex-col gap-2">
      <a href={primary.href} target="_blank" rel="noopener noreferrer"
        className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl px-3 text-[14.5px] font-bold shadow-[0_4px_18px_rgba(17,24,39,0.18)] active:translate-y-px"
        style={{ background: primary.bg, color: primary.color }}>
        {primary.label}
      </a>
      {secondary.length > 0 && (
        <div className={`grid gap-2 ${secondary.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
          {secondary.map((item, i) => (
            <a key={i} href={item.href} target="_blank" rel="noopener noreferrer"
              className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl px-2 text-[13px] font-semibold shadow-[0_2px_8px_rgba(17,24,39,0.10)] active:translate-y-px"
              style={{ background: item.bg, color: item.color }}>
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
