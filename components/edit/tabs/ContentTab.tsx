import Section from "@/components/edit/Section";
import GalleryManager from "@/components/dashboard/GalleryManager";
import ReviewManager from "@/components/dashboard/ReviewManager";
import type { GalleryImage, Review } from "@/lib/types";

export type ContentTabProps = {
  gallery: GalleryImage[];
  setGallery: (v: GalleryImage[]) => void;
  galleryLimit?: number;
  reviews: Review[];
  setReviews: (v: Review[]) => void;
  reviewsLimit?: number;
  profileSlug?: string;
};

export default function ContentTab({
  gallery,
  setGallery,
  galleryLimit,
  reviews,
  setReviews,
  reviewsLimit,
  profileSlug,
}: ContentTabProps) {
  return (
    <>
      <Section title="포트폴리오 · 갤러리 (선택)">
        <div className="mb-3 rounded-xl bg-blue-50 border border-blue-100 px-3.5 py-3">
          <p className="text-xs font-semibold text-blue-800">💡 TIP</p>
          <p className="mt-0.5 text-xs text-blue-700 leading-relaxed">
            인스타그램에서 잘 나온 사진 2~3장만 올려도 고객 신뢰도가 확
            높아져요. 작업 결과물이나 매장 분위기 사진을 추가해보세요.
          </p>
        </div>
        <GalleryManager
          images={gallery}
          onChange={setGallery}
          limit={galleryLimit}
        />
      </Section>

      <Section title="고객 후기">
        <div className="mb-3 rounded-xl bg-blue-50 border border-blue-100 px-3.5 py-3">
          <p className="text-xs font-semibold text-blue-800">💡 TIP</p>
          <p className="mt-0.5 text-xs text-blue-700 leading-relaxed">
            직접 입력하거나 대시보드-하단 「후기 수집」을 공유해 고객이 직접
            남기게 할 수 있어요. 후기 3개 이상이면 신뢰도가 눈에 띄게 올라가요!
          </p>
        </div>
        <ReviewManager
          reviews={reviews}
          onChange={setReviews}
          limit={reviewsLimit}
          reviewUrl={profileSlug ? `/${profileSlug}/review` : undefined}
        />
      </Section>
    </>
  );
}
