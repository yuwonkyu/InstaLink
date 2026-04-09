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
  instagramUrl: string;
  instagramHandle: string;
  imageSrc: string;
  services: ServiceItem[];
  reviews: ReviewItem[];
};

export default function Profile({
  brandName,
  name,
  role,
  intro,
  location,
  availability,
  ctaLabel,
  instagramUrl,
  instagramHandle,
  imageSrc,
  services,
  reviews,
}: ProfileProps) {
  return (
    <section className="rounded-xl bg-white/70 p-8 shadow-[0_4px_18px_rgba(17,24,39,0.06)] backdrop-blur">
      <div className="flex items-start gap-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-3xl bg-(--secondary) shadow-[0_4px_14px_rgba(17,24,39,0.08)]">
          <Image
            src={imageSrc}
            alt={name}
            fill
            sizes="96px"
            className="object-cover"
            priority
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="mb-2 inline-flex rounded-md bg-(--secondary) px-2 py-1 text-xs font-semibold tracking-[0.08em] text-(--third) uppercase">
            {brandName}
          </p>
          <h1 className="font-display text-2xl font-bold leading-none text-foreground">
            {name}
          </h1>
          <p className="mt-2 text-sm font-medium text-(--muted)">{role}</p>
        </div>
      </div>

      <p className="mt-5 text-sm leading-6 text-(--muted)">{intro}</p>

      <div className="mt-6">
        <a
          href="https://open.kakao.com/o/sample"
          target="_blank"
          rel="noreferrer"
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-black px-4 text-base font-bold text-white! shadow-[0_6px_16px_rgba(17,24,39,0.18)] active:translate-y-px"
        >
          <span className="text-sm text-white/85!">Kakao</span>
          {ctaLabel}
        </a>
      </div>

      <div className="my-7 h-px bg-black/8" />

      <section>
        <h2 className="text-base font-bold text-foreground">서비스</h2>
        <ul className="mt-4 space-y-3">
          {services.map((service) => (
            <li
              key={service.name}
              className="flex items-center justify-between gap-3 text-base"
            >
              <span className="font-medium text-foreground">
                {service.name}
              </span>
              <span className="font-semibold text-foreground">
                {service.price}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="my-7 h-px bg-black/8" />

      <section>
        <h2 className="text-base font-bold text-foreground">후기</h2>
        <ul className="mt-4 space-y-3">
          {reviews.map((review) => (
            <li key={review.author} className="rounded-2xl bg-white/80 p-4">
              <p className="text-sm leading-6 text-(--muted)">
                “{review.content}”
              </p>
              <p className="mt-2 text-xs font-semibold text-foreground">
                {review.author}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <div className="my-7 h-px bg-black/8" />

      <p className="text-sm font-medium text-(--muted)">
        위치 {location} · {availability}
      </p>
      <a
        href={instagramUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex text-sm font-medium text-(--muted) underline underline-offset-4"
      >
        Instagram {instagramHandle}
      </a>
    </section>
  );
}
