"use client";

import { useState } from "react";
import Link from "next/link";
import ProfilePage from "@/components/ProfilePage";
import type { Profile, Theme, Service } from "@/lib/types";

// ── 업종별 테마·템플릿 ─────────────────────────────────────
const CATEGORIES = [
  { id: "PT/헬스",             label: "PT / 헬스",           emoji: "🏋️", theme: "energysteel" as Theme },
  { id: "필라테스/요가",       label: "필라테스 / 요가",      emoji: "🧘", theme: "softsage"    as Theme },
  { id: "미용실/네일",         label: "미용실 / 네일",        emoji: "✂️", theme: "warmlinen"   as Theme },
  { id: "카페",                label: "카페 / 음료",          emoji: "☕", theme: "light"       as Theme },
  { id: "프리랜서/크리에이터", label: "프리랜서 / 크리에이터", emoji: "🎨", theme: "ucc"         as Theme },
];

type TemplateData = { tagline: string; description: string; services: Service[] };

const TEMPLATES: Record<string, TemplateData> = {
  "PT/헬스": {
    tagline: "여성 전문 1:1 PT · 체형교정 · 다이어트",
    description: "✔ 여성 전문 1:1 맞춤 PT\n✔ 체형교정 · 다이어트 · 근력 향상\n✔ 식단 + 운동 통합 관리\n✔ 첫 상담 무료 — 카카오로 문의하세요",
    services: [
      { name: "PT 1회", price: "80,000원" },
      { name: "PT 10회 패키지", price: "700,000원", note: "회당 70,000원" },
    ],
  },
  "필라테스/요가": {
    tagline: "소규모 프라이빗 필라테스 스튜디오",
    description: "✔ 소그룹(4명 이하) & 1:1 프라이빗 수업\n✔ 척추 측만 · 거북목 · 체형교정 전문\n✔ 카카오로 체험 수업 신청하세요",
    services: [
      { name: "그룹 필라테스 1회", price: "25,000원" },
      { name: "1:1 개인 레슨 1회", price: "80,000원" },
    ],
  },
  "미용실/네일": {
    tagline: "트렌드 컬러 전문 — 당신만의 헤어 스타일",
    description: "✔ 트렌드 컬러 · 펌 · 케라틴 트리트먼트 전문\n✔ 예약제 운영 — 대기 없이 편안하게",
    services: [
      { name: "커트", price: "30,000원" },
      { name: "펌", price: "80,000원~" },
      { name: "염색", price: "70,000원~" },
    ],
  },
  "카페": {
    tagline: "직접 로스팅하는 스페셜티 커피 한 잔",
    description: "✔ 매주 직접 로스팅하는 스페셜티 원두\n✔ 노트북 작업 & 소모임 환영",
    services: [
      { name: "아메리카노", price: "4,500원" },
      { name: "카페라떼", price: "5,500원" },
      { name: "핸드드립", price: "7,000원~" },
    ],
  },
  "프리랜서/크리에이터": {
    tagline: "브랜드 디자인 & 콘텐츠 제작 전문",
    description: "✔ 브랜드 로고 · 상세페이지 · SNS 콘텐츠 디자인\n✔ 수정 2회 무료 포함",
    services: [
      { name: "SNS 콘텐츠 디자인", price: "30,000원~" },
      { name: "로고 디자인", price: "150,000원~" },
    ],
  },
};

function buildProfile(name: string, kakaoUrl: string, categoryId: string): Profile {
  const cat = CATEGORIES.find((c) => c.id === categoryId) ?? CATEGORIES[0];
  const tmpl = TEMPLATES[categoryId] ?? TEMPLATES["PT/헬스"];
  const displayName = name.trim() || "내 이름";
  return {
    id: "",
    slug: "demo",
    owner_id: "",
    name: displayName,
    shop_name: displayName,
    tagline: tmpl.tagline,
    description: tmpl.description,
    kakao_url: kakaoUrl.trim() || "https://open.kakao.com/o/example",
    instagram_id: "",
    location: "",
    hours: "",
    image_url: "/user_img.svg",
    theme: cat.theme,
    plan: "basic",
    services: tmpl.services,
    reviews: [
      { text: "정말 만족스러웠어요! 꼼꼼하게 알려주셔서 감사합니다 😊", author: "김**" },
      { text: "처음에는 걱정했는데 결과가 너무 좋아서 주변에도 추천했어요.", author: "이**" },
    ],
    is_active: true,
    created_at: new Date().toISOString(),
  };
}

const inputCls =
  "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm placeholder:text-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/15 transition-colors";

export default function DemoPage() {
  const [name, setName]       = useState("");
  const [kakaoUrl, setKakao]  = useState("");
  const [category, setCategory] = useState("PT/헬스");
  const [showPreview, setShowPreview] = useState(false);

  const profile = buildProfile(name, kakaoUrl, category);
  const signupUrl = `/auth/signup?name=${encodeURIComponent(name)}&category=${encodeURIComponent(category)}`;

  return (
    <div className="min-h-screen bg-(--secondary)">
      {/* 헤더 */}
      <div className="border-b border-gray-100 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="font-display text-base font-bold text-foreground">
            InstaLink
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-xl bg-foreground px-4 py-2 text-sm font-semibold text-white hover:opacity-80 transition-opacity"
          >
            가입하기
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-foreground">내 링크페이지 미리보기</h1>
          <p className="mt-1 text-sm text-gray-500">정보를 입력하면 오른쪽에 내 페이지가 실시간으로 만들어집니다.</p>
        </div>

        <div className="lg:grid lg:grid-cols-[380px_1fr] lg:gap-8">
          {/* ── 입력 폼 ── */}
          <div className="flex flex-col gap-5">
            <div className="rounded-2xl bg-white p-5 shadow-[0_2px_12px_rgba(17,24,39,0.06)]">
              <h2 className="mb-4 text-sm font-semibold text-foreground">내 정보 입력</h2>

              {/* 업종 선택 */}
              <div className="mb-4">
                <label className="mb-2 block text-xs font-medium text-gray-600">업종 선택</label>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`flex flex-col items-center gap-1 rounded-xl border-2 py-3 text-center transition-all active:scale-95 ${
                        category === cat.id
                          ? "border-foreground bg-(--secondary)"
                          : "border-gray-100 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-xl">{cat.emoji}</span>
                      <span className="text-[10px] font-semibold leading-tight text-foreground">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 이름 */}
              <div className="mb-3">
                <label className="mb-1.5 block text-xs font-medium text-gray-600">이름 · 닉네임</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="홍길동 트레이너"
                  className={inputCls}
                />
              </div>

              {/* 카카오 */}
              <div className="mb-5">
                <label className="mb-1.5 block text-xs font-medium text-gray-600">
                  카카오 오픈채팅 URL <span className="text-gray-400">(선택)</span>
                </label>
                <input
                  type="url"
                  value={kakaoUrl}
                  onChange={(e) => setKakao(e.target.value)}
                  placeholder="https://open.kakao.com/o/..."
                  className={inputCls}
                />
              </div>

              {/* 모바일 미리보기 토글 */}
              <button
                type="button"
                onClick={() => setShowPreview((v) => !v)}
                className="lg:hidden mb-4 w-full rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {showPreview ? "미리보기 닫기 ▲" : "미리보기 보기 ▼"}
              </button>

              {/* CTA */}
              <Link
                href={signupUrl}
                className="flex w-full items-center justify-center rounded-xl bg-foreground py-3 text-sm font-bold text-white hover:opacity-85 transition-opacity"
              >
                이 페이지로 가입하기 🎉
              </Link>
              <p className="mt-2 text-center text-xs text-gray-400">
                카드 등록 없이 무료로 시작할 수 있어요.
              </p>
            </div>
          </div>

          {/* ── 미리보기 ── */}
          <div className={`mt-5 lg:mt-0 ${showPreview ? "block" : "hidden lg:block"}`}>
            <div className="rounded-2xl bg-white p-4 shadow-[0_2px_12px_rgba(17,24,39,0.06)]">
              <p className="mb-3 text-center text-xs text-gray-400">미리보기 — 실제 페이지와 동일합니다</p>
              {/* 테마 래퍼 */}
              <div
                data-theme={profile.theme}
                className="rounded-xl overflow-hidden"
                style={{ maxWidth: 480, margin: "0 auto" }}
              >
                <div className="bg-(--background) px-4 py-6">
                  <ProfilePage profile={profile} />
                </div>
              </div>
            </div>

            {/* 하단 가입 CTA */}
            <div className="mt-4 rounded-2xl bg-foreground p-5 text-center">
              <p className="text-base font-bold text-white">마음에 드세요?</p>
              <p className="mt-1 text-xs text-white/70">가입하면 이 페이지가 바로 내 것이 됩니다.</p>
              <Link
                href={signupUrl}
                className="mt-4 inline-block rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-foreground hover:opacity-90 transition-opacity"
              >
                무료로 내 페이지 만들기 →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
