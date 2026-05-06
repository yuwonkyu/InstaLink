import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProfilePage from "@/components/ProfilePage";
import { getSupabaseServerClient } from "@/lib/supabase";
import type { Profile } from "@/lib/types";
import { getUserByUsername } from "@/data/users";
import ShareButton from "./ShareButton";
import FreeCtaBanner from "./FreeCtaBanner";
import SamplePlanBanner from "./SamplePlanBanner";
import { toPlanKey } from "@/lib/plan-limits";
import { COMPANY_INFO } from "@/lib/company-info";
import { getSiteUrl as getCanonicalSiteUrl } from "@/lib/site-url";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

// 항상 canonical 도메인 반환 — kku-ui.vercel.app 으로 접속해도 OG/canonical 은 instalink 도메인
function getSiteUrl(): string {
  return getCanonicalSiteUrl();
}

async function getProfileBySlug(slug: string): Promise<Profile | null> {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error(`[slug] Supabase 조회 오류 (${slug}):`, error.message);
    }

    if (data) {
      return data as Profile;
    }
  } catch (e) {
    console.error(`[slug] Supabase 클라이언트 오류 (${slug}):`, e);
  }

  // 로컬 샘플 데이터 폴백 (sample, sample2 등)
  const localUser = getUserByUsername(slug);
  if (!localUser) {
    return null;
  }

  return {
    id: `local-${localUser.username}`,
    slug: localUser.username,
    owner_id: "local-owner",
    name: localUser.name,
    shop_name: localUser.brandName,
    tagline: localUser.role,
    description: localUser.intro,
    kakao_url: localUser.kakaoUrl ?? "",
    kakao_booking_url: "",
    naver_booking_url: "",
    phone_url: "",
    instagram_dm_url: "",
    kakao_channel_url: "",
    instagram_id: localUser.instagramHandle,
    location: localUser.location,
    hours: localUser.availability,
    image_url: localUser.imageSrc,
    parking_info: "",
    services: localUser.services.map((service) => ({
      name: service.name,
      price: service.price,
      note: service.note,
    })),
    reviews: localUser.reviews.map((review) => ({
      text: review.content,
      author: review.author,
    })),
    gallery: localUser.gallery ?? null,
    custom_links: localUser.links
      ? localUser.links.map((l) => ({ label: l.label, url: l.url }))
      : null,
    plan: localUser.plan ?? "free",
    button_color: localUser.options?.highlightColor ?? null,
    button_text_color: null,
    section_order: localUser.sectionOrder ?? null,
    gallery_layout: "grid3",
    business_hours: {},
    category: null,
    is_active: true,
    created_at: new Date().toISOString(),
    theme: localUser.options?.theme,
  } as Profile;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);
  const SITE = getSiteUrl();

  const title = profile ? `${profile.name} — ${profile.shop_name}` : slug;
  const description = profile?.tagline ?? "인스타 프로필 링크 페이지";
  const imageUrl = profile ? `${SITE}/${slug}/opengraph-image` : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE}/${slug}`,
    },
    openGraph: {
      type: "website",
      url: `${SITE}/${slug}`,
      title: profile?.name ?? slug,
      description,
      images: imageUrl ? [imageUrl] : [],
      siteName: "InstaLink",
    },
    twitter: {
      card: "summary_large_image",
      title: profile?.name ?? slug,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function SlugPage({ params }: PageProps) {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);
  const SITE = getSiteUrl();

  // 조회수 증가 (서버리스 환경에서 fire-and-forget은 완료 보장 안 됨 → await 사용)
  if (profile?.is_active) {
    const supabase = await getSupabaseServerClient();
    await supabase.rpc("increment_view_count", { profile_slug: slug });
  }

  if (!profile) {
    notFound();
  }

  if (!profile.is_active) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-(--secondary) px-4 py-6 sm:px-6">
        <div className="w-full max-w-md rounded-2xl bg-(--card) p-8 text-center shadow-[0_4px_20px_rgba(17,24,39,0.06)] backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-foreground">서비스 준비 중</h1>
          <p className="mt-3 text-sm text-(--muted)">
            현재 페이지는 활성화되지 않았습니다. 잠시 후 다시 확인해주세요.
          </p>
        </div>
      </main>
    );
  }

  const themeClass =
    profile.theme && profile.theme !== "light" ? `theme-${profile.theme}` : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: profile.shop_name || profile.name,
    description: profile.tagline ?? profile.description,
    url: `${SITE}/${slug}`,
    ...(profile.image_url ? { image: profile.image_url } : {}),
    ...(profile.location
      ? {
          address: {
            "@type": "PostalAddress",
            addressLocality: profile.location,
            addressCountry: "KR",
          },
        }
      : {}),
    // 영업시간 정보
    ...(profile.hours
      ? { openingHours: profile.hours }
      : {}),
    // 카카오 상담 연결
    ...(profile.kakao_url
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            url: profile.kakao_url,
            availableLanguage: "Korean",
          },
        }
      : {}),
    // 인스타그램 sameAs
    ...(profile.instagram_id
      ? {
          sameAs: [
            `https://www.instagram.com/${profile.instagram_id.replace(/^@/, "")}/`,
          ],
        }
      : {}),
    // 서비스 목록 (최대 5개)
    ...(profile.services && profile.services.length > 0
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "서비스 목록",
            itemListElement: profile.services.slice(0, 5).map((s, i) => ({
              "@type": "Offer",
              position: i + 1,
              name: s.name,
              ...(s.price ? { price: s.price, priceCurrency: "KRW" } : {}),
            })),
          },
        }
      : {}),
  };

  return (
    <main
      className={`flex min-h-screen w-full flex-col items-center bg-(--secondary) px-4 py-6 sm:px-6 ${themeClass}`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd)
            .replace(/</g, "\\u003c")
            .replace(/>/g, "\\u003e"),
        }}
      />
      <div className="w-full max-w-md">
        {/^sample[123]$/.test(slug) && (
          <SamplePlanBanner plan={toPlanKey(profile.plan)} />
        )}
        <div className="rounded-2xl bg-(--card) p-2 shadow-[0_4px_20px_rgba(17,24,39,0.06)] backdrop-blur-sm">
          <ProfilePage profile={profile} />
        </div>
        <div className="mt-3">
          <ShareButton url={`${SITE}/${slug}`} />
        </div>
        <div className="mt-4 mb-20 text-center">
          <a
            href={`mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent(`[신고] ${SITE}/${slug}`)}&body=${encodeURIComponent(`신고 페이지 URL: ${SITE}/${slug}\n\n신고 사유:\n\n(자세히 작성해주세요)`)}`}
            className="text-xs text-(--muted) hover:text-foreground transition-colors underline underline-offset-2"
          >
            이 페이지 신고하기
          </a>
        </div>
      </div>
      {(!profile.plan || profile.plan === "free") && <FreeCtaBanner />}
    </main>
  );
}
