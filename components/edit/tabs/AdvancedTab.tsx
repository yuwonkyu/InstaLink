"use client";

import Section from "@/components/edit/Section";
import type { GalleryLayout } from "@/lib/types";
import { useDragReorder } from "@/lib/use-drag-reorder";

export type AdvancedTabProps = {
  isProPlan: boolean;
  sectionOrder: string[];        setSectionOrder: (v: string[]) => void;
  galleryLayout: GalleryLayout;  setGalleryLayout: (v: GalleryLayout) => void;
};

const SECTION_LABEL: Record<string, string> = {
  services: "서비스 & 가격",
  gallery:  "포트폴리오 · 갤러리",
  reviews:  "고객 후기",
};

export default function AdvancedTab({
  isProPlan,
  sectionOrder, setSectionOrder,
  galleryLayout, setGalleryLayout,
}: AdvancedTabProps) {
  const { dragIdx, overIdx, dragProps } = useDragReorder(sectionOrder, setSectionOrder);
  if (!isProPlan) return null;

  return (
    <>
      {/* ── Pro TIP ── */}
      <div className="rounded-xl bg-blue-50 border border-blue-100 px-3.5 py-3">
        <p className="text-xs font-semibold text-blue-800">💡 TIP</p>
        <p className="mt-0.5 text-xs text-blue-700 leading-relaxed">
          섹션 순서를 조정해 가장 보여주고 싶은 내용을 위쪽에 올리고, 갤러리 표시 방식을 골라보세요. (색상·폰트·버튼색은 「내 페이지」 탭의 색상·폰트 꾸미기에서 바꿔요.)
        </p>
      </div>

      {/* ── 섹션 순서 ── */}
      <Section title="섹션 순서 (Pro)">
        <div className="flex flex-col gap-2">
          <p className="text-xs text-(--muted)">드래그하거나 ↑ ↓ 버튼으로 공개 페이지의 섹션 순서를 조정하세요.</p>
          {sectionOrder.map((key, idx) => (
            <div
              key={key}
              {...dragProps(idx)}
              className={`flex items-center justify-between rounded-xl bg-(--secondary) px-4 py-2.5 cursor-grab active:cursor-grabbing ${
                dragIdx === idx ? "opacity-50" : ""
              } ${overIdx === idx && dragIdx !== idx ? "ring-2 ring-blue-400" : ""}`}
            >
              <span className="text-sm font-medium text-foreground">
                {SECTION_LABEL[key] ?? key}
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => {
                    const next = [...sectionOrder];
                    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                    setSectionOrder(next);
                  }}
                  className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-sm text-foreground disabled:opacity-30 hover:bg-gray-50 transition-colors"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={idx === sectionOrder.length - 1}
                  onClick={() => {
                    const next = [...sectionOrder];
                    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
                    setSectionOrder(next);
                  }}
                  className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-sm text-foreground disabled:opacity-30 hover:bg-gray-50 transition-colors"
                >
                  ↓
                </button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 갤러리 레이아웃 ── */}
      <Section title="갤러리 레이아웃 (Pro)">
        <p className="mb-3 text-xs text-(--muted)">고객 페이지에서 갤러리를 표시할 방식을 선택하세요.</p>
        <div className="grid grid-cols-2 gap-2">
          {(["grid3", "grid2"] as GalleryLayout[]).map((layout) => (
            <button
              key={layout}
              type="button"
              onClick={() => setGalleryLayout(layout)}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-colors ${
                galleryLayout === layout
                  ? "border-foreground bg-foreground/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className={`grid w-full gap-0.5 ${layout === "grid2" ? "grid-cols-2" : "grid-cols-3"}`}>
                {Array.from({ length: layout === "grid2" ? 4 : 6 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-sm bg-gray-200" />
                ))}
              </div>
              <span className="text-xs font-semibold text-foreground">
                {layout === "grid3" ? "3열 (기본)" : "2열 (큰 사진)"}
              </span>
              <span className="text-[10px] text-(--muted)">
                {layout === "grid3" ? "더 많은 사진 표시" : "사진이 크게 표시됨"}
              </span>
            </button>
          ))}
        </div>
      </Section>
    </>
  );
}
