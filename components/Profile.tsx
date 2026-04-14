import Image from "next/image";
import type { ReviewItem, ServiceItem } from "@/data/mockData";

type ProfileProps = {
  brandName: string;
  name: string;
  role: string;
  intro: string;
  location: string;
  availability: string;
  ctaLabel: string;
  ctaBackgroundColor: string;
  showReviews: boolean;
  showLocation: boolean;
  showEditableFrame: boolean;
  serviceFooterLabel: string | false;
  instagramUrl: string;
  instagramHandle: string;
  imageSrc: string;
  services: ServiceItem[];
  reviews: ReviewItem[];
  kakaoUrl?: string;
};

export default function Profile({
  brandName,
  name,
  role,
  intro,
  location,
  availability,
  ctaLabel,
  ctaBackgroundColor,
  showReviews,
  showLocation,
  showEditableFrame,
  serviceFooterLabel,
  instagramUrl,
  instagramHandle,
  imageSrc,
  services,
  reviews,
  kakaoUrl = "https://open.kakao.com/o/sample",
}: ProfileProps) {
  // editable-frame 클래스 적용 헬퍼
  const ef = (base: string) => `${showEditableFrame ? "editable-frame " : ""}${base}`;

  return (
    <section className="rounded-xl p-8 backdrop-blur">
      <div className="flex items-start gap-4">
        <div className={ef("relative h-24 w-24 shrink-0 overflow-hidden")}> 
          <Image
            src={imageSrc}
            alt={name}
            fill
            sizes="96px"
            className="object-cover"
            priority
          />
        </div>
        <div className="profile-header-copy min-w-0 flex-1">
          <p className={ef("profile-brand mb-2 inline-flex px-2 py-1 font-semibold tracking-[0.08em] text-(--third) uppercase")}>{brandName}</p>
          <h1 className={ef("profile-name font-display font-bold leading-none text-foreground")}>{name}</h1>
          <p className={ef("profile-role mt-2 font-medium text-(--muted)")}>{role}</p>
        </div>
      </div>

      <p className={ef("mt-5 text-sm leading-6 text-(--muted) whitespace-pre-line")}>{intro}</p>

      <div className="mt-5">
        <a
          href={kakaoUrl}
          target="_blank"
          rel="noreferrer"
          className="reserve-button flex min-h-12 w-full items-center justify-center overflow-hidden rounded-xl px-2 text-sm font-semibold text-black! shadow-[0_4px_10px_rgba(17,24,39,0.12)] active:translate-y-px"
          style={{ backgroundColor: ctaBackgroundColor }}
        >
          <span className="reserve-button__content">
            <Image src="/kakaosimbol.svg" alt="" width={18} height={18} className="h-4.5 w-4.5 shrink-0" />
            <Image src="/kakaoText.svg" alt="Kakao" width={74} height={18} className="h-4.5 w-auto shrink-0" style={{ width: "auto" }} />
            <span className="text-black! whitespace-nowrap">{ctaLabel}</span>
          </span>
        </a>
      </div>

      <div className="my-7 h-px bg-black/20" />

      <section className={ef("")}>
        <h2 className="text-base font-bold text-foreground">서비스</h2>
        <ul className="mt-4 space-y-3">
          {services.map((service) => (
            <li
              key={service.name + service.price}
              className="flex items-center justify-between gap-3 text-base"
            >
              <span className="font-medium text-foreground">{service.name}</span>
              <span className="font-semibold text-foreground">{service.price}</span>
            </li>
          ))}
        </ul>
        {serviceFooterLabel && (
          <p className="mt-3 text-right text-xs text-(--muted)">{serviceFooterLabel}</p>
        )}
      </section>

      {showReviews && (
        <>
          <div className="my-7 h-px bg-black/20" />
          <section className={ef("")}>
            <h2 className="text-base font-bold text-foreground">후기</h2>
            <ul className="mt-4 space-y-3">
              {reviews.map((review, idx) => (
                <li key={review.author + idx} className="rounded-2xl bg-white/80 p-4">
                  <p className="text-left text-sm leading-6 text-(--muted)">“{review.content}”</p>
                  <p className="mt-2 text-right text-xs font-semibold text-foreground">{review.author}</p>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {showLocation && (
        <>
          <div className="my-7 h-px bg-black/20" />
          <p className={ef("text-sm font-medium text-(--muted) mt-0.5")}>운영시간 : {availability}</p>
          <p className={ef("text-sm font-medium text-(--muted)")}>위치 : {location}</p>
        </>
      )}

      <a
        href={instagramUrl}
        target="_blank"
        rel="noreferrer"
        className={ef("mt-3 inline-flex text-sm font-medium text-(--muted) underline underline-offset-4")}
      >
        Instagram {instagramHandle}
      </a>
    </section>
  );
}
