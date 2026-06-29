"use client";

import Link from "next/link";
import { useState } from "react";
import Section from "@/components/edit/Section";
import { FONT_OPTIONS } from "@/lib/fonts";

// ── 원클릭 색상 프리셋 (배경·카드·글자·포인트 한 번에) ──
type Palette = { name: string; bg: string; card: string; text: string; accent: string };
const PRESETS: Palette[] = [
  { name: "미니멀 화이트", bg: "#ffffff", card: "#f6f6f7", text: "#111827", accent: "#111827" },
  { name: "크림 베이지",   bg: "#f7f1e8", card: "#fffdf8", text: "#4a3f35", accent: "#b08968" },
  { name: "차콜 다크",     bg: "#16181d", card: "#22252c", text: "#f3f4f6", accent: "#a3e635" },
  { name: "포레스트",      bg: "#edf4ef", card: "#ffffff", text: "#22372b", accent: "#3f7d5a" },
  { name: "라벤더",        bg: "#f1eefb", card: "#fbfaff", text: "#2e2a40", accent: "#7c5cff" },
  { name: "코랄 선셋",     bg: "#fdeee8", card: "#fffaf8", text: "#3d2b26", accent: "#f0653f" },
];

export type AppearanceCustomizerProps = {
  isProPlan: boolean;
  bgColor: string;        setBgColor: (v: string) => void;
  cardColor: string;      setCardColor: (v: string) => void;
  textColor: string;      setTextColor: (v: string) => void;
  accentColor: string;    setAccentColor: (v: string) => void;
  fontKey: string;        setFontKey: (v: string) => void;
  buttonColor: string;        setButtonColor: (v: string) => void;
  buttonTextColor: string;    setButtonTextColor: (v: string) => void;
};

// ── 단일 색상 입력 행 ──
function ColorRow({
  label, hint, value, fallback, onChange, resetLabel = "초기화",
}: {
  label: string; hint?: string; value: string; fallback: string;
  onChange: (v: string) => void; resetLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-foreground">{label}</p>
        {value && (
          <button type="button" onClick={() => onChange("")}
            className="text-[11px] text-(--muted) hover:text-foreground transition-colors">
            {resetLabel}
          </button>
        )}
      </div>
      {hint && <p className="text-[11px] text-(--muted)">{hint}</p>}
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value || fallback}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-11 cursor-pointer rounded-lg border border-gray-200 p-0.5"
        />
        <span className="text-sm font-mono text-foreground">{value || fallback}</span>
      </div>
    </div>
  );
}

export default function AppearanceCustomizer({
  isProPlan,
  bgColor, setBgColor,
  cardColor, setCardColor,
  textColor, setTextColor,
  accentColor, setAccentColor,
  fontKey, setFontKey,
  buttonColor, setButtonColor,
  buttonTextColor, setButtonTextColor,
}: AppearanceCustomizerProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // 현재 선택된 폰트 (빈 값 = 기본 프리텐다드)
  const activeFontKey = fontKey || "pretendard";
  const activeFont = FONT_OPTIONS.find((f) => f.key === activeFontKey) ?? FONT_OPTIONS[0];

  // 미리보기에 쓸 실제 값 (커스텀 없으면 라이트 테마 기본값으로 표시)
  const pvBg     = bgColor     || "#f5f5f5";
  const pvCard   = cardColor   || "#ffffff";
  const pvText   = textColor   || "#111827";
  const pvAccent = accentColor || "#111827";
  const pvBtnBg  = buttonColor || "#111827";
  const pvBtnTx  = buttonTextColor || "#ffffff";

  function applyPreset(p: Palette) {
    setBgColor(p.bg);
    setCardColor(p.card);
    setTextColor(p.text);
    setAccentColor(p.accent);
  }

  const presetActive = (p: Palette) =>
    bgColor.toLowerCase() === p.bg.toLowerCase() &&
    cardColor.toLowerCase() === p.card.toLowerCase() &&
    textColor.toLowerCase() === p.text.toLowerCase() &&
    accentColor.toLowerCase() === p.accent.toLowerCase();

  const hasAnyCustom = !!(bgColor || cardColor || textColor || accentColor || fontKey);

  // ── 비-Pro: 업그레이드 유도(프리셋 미리보기 + 잠금) ──
  if (!isProPlan) {
    return (
      <Section title="색상·폰트 꾸미기 (Pro)">
        <div className="relative">
          <div className="grid grid-cols-3 gap-2 opacity-50 select-none pointer-events-none">
            {PRESETS.map((p) => (
              <div key={p.name} className="flex flex-col items-center gap-1.5 rounded-xl border-2 border-transparent p-2">
                <div className="flex h-10 w-full items-center justify-center rounded-lg" style={{ background: p.bg }}>
                  <div className="h-5 w-9 rounded-md" style={{ background: p.card, border: `1px solid ${p.accent}33` }} />
                </div>
                <span className="text-[11px] font-medium text-foreground">{p.name}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 text-center">
            <p className="text-sm">🎨</p>
            <p className="mt-0.5 text-xs font-semibold text-amber-800">배경·글자·포인트 색상과 폰트를 자유롭게</p>
            <p className="mt-0.5 text-[11px] text-amber-700">나만의 브랜드 분위기를 입혀보세요.</p>
            <Link href="/billing"
              className="mt-2 inline-block rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-500 transition-colors">
              Pro로 업그레이드 →
            </Link>
          </div>
        </div>
      </Section>
    );
  }

  // ── Pro: 풀 커스텀 ──
  return (
    <Section title="색상·폰트 꾸미기 (Pro)">
      <div className="mb-3 rounded-xl bg-blue-50 border border-blue-100 px-3.5 py-3">
        <p className="text-xs font-semibold text-blue-800">💡 가장 쉬운 방법</p>
        <p className="mt-0.5 text-xs text-blue-700 leading-relaxed">
          아래 <b>색상 테마</b>를 한 번 누르면 배경·카드·글자·포인트 색이 한꺼번에 적용돼요. 더 세밀하게 바꾸고 싶으면 「직접 고르기」를 펼치세요. (라이트 테마에서 가장 깔끔하게 보여요.)
        </p>
      </div>

      {/* ① 원클릭 프리셋 */}
      <p className="mb-2 text-xs font-medium text-(--muted)">색상 테마</p>
      <div className="grid grid-cols-3 gap-2">
        {PRESETS.map((p) => {
          const active = presetActive(p);
          return (
            <button
              key={p.name}
              type="button"
              onClick={() => applyPreset(p)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-2 transition-all ${
                active ? "border-foreground" : "border-transparent hover:border-gray-200"
              }`}
            >
              <div className="flex h-10 w-full items-center justify-center rounded-lg" style={{ background: p.bg }}>
                <div className="flex h-5 w-9 items-center justify-center rounded-md" style={{ background: p.card }}>
                  <div className="h-1.5 w-4 rounded-full" style={{ background: p.accent }} />
                </div>
              </div>
              <span className="text-[11px] font-medium text-foreground">{p.name}</span>
            </button>
          );
        })}
      </div>

      {/* ② 직접 고르기 (접이식) */}
      <button
        type="button"
        onClick={() => setShowAdvanced((v) => !v)}
        className="mt-4 flex w-full items-center justify-between rounded-xl bg-(--secondary) px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-gray-100"
      >
        <span>🎛️ 색상 직접 고르기 {hasAnyCustom && !PRESETS.some(presetActive) ? "(사용자 지정)" : ""}</span>
        <span className="text-(--muted)">{showAdvanced ? "▲" : "▼"}</span>
      </button>
      {showAdvanced && (
        <div className="mt-3 flex flex-col gap-4 rounded-xl border border-gray-100 p-4">
          <ColorRow label="배경색" hint="페이지 전체 바탕" value={bgColor} fallback="#f5f5f5" onChange={setBgColor} />
          <ColorRow label="카드·섹션색" hint="내용이 담기는 카드 배경" value={cardColor} fallback="#ffffff" onChange={setCardColor} />
          <ColorRow label="글자색" hint="제목·본문 글자" value={textColor} fallback="#111827" onChange={setTextColor} />
          <ColorRow label="포인트색" hint="상호 배지 등 강조" value={accentColor} fallback="#111827" onChange={setAccentColor} />
          <div className="h-px bg-gray-100" />
          <ColorRow label="버튼 배경색" hint="링크·전화 버튼" value={buttonColor} fallback="#111827" onChange={setButtonColor} />
          <ColorRow label="버튼 글자색" value={buttonTextColor} fallback="#ffffff" onChange={setButtonTextColor} resetLabel="초기화 (흰색)" />
          {hasAnyCustom && (
            <button
              type="button"
              onClick={() => { setBgColor(""); setCardColor(""); setTextColor(""); setAccentColor(""); }}
              className="self-start text-xs text-(--muted) hover:text-foreground transition-colors underline underline-offset-2"
            >
              색상 전체 초기화
            </button>
          )}
        </div>
      )}

      {/* ③ 폰트 */}
      <p className="mt-5 mb-2 text-xs font-medium text-(--muted)">폰트</p>
      <div className="grid grid-cols-2 gap-2">
        {FONT_OPTIONS.map((f) => {
          const active = activeFontKey === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFontKey(f.key === "pretendard" ? "" : f.key)}
              className={`flex flex-col gap-0.5 rounded-xl border-2 p-3 text-left transition-all ${
                active ? "border-foreground bg-foreground/5" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="text-base text-foreground" style={{ fontFamily: f.previewFamily }}>
                가나다 ABC
              </span>
              <span className="text-xs font-semibold text-foreground">{f.label}</span>
              <span className="text-[10px] text-(--muted)">{f.hint}</span>
            </button>
          );
        })}
      </div>
      {/* 편집 화면에서 모든 폰트 버튼이 실제 글꼴로 보이도록 CDN 로드 (Pro 편집 화면 한정) */}
      {FONT_OPTIONS.map((f) =>
        f.googleHref ? <link key={f.key} rel="stylesheet" href={f.googleHref} /> : null,
      )}

      {/* ④ 라이브 미니 프리뷰 */}
      <p className="mt-5 mb-2 text-xs font-medium text-(--muted)">미리보기</p>
      <div className="rounded-2xl p-4" style={{ background: pvBg, fontFamily: activeFont.previewFamily }}>
        <div className="rounded-xl p-4" style={{ background: pvCard }}>
          <p className="text-[10px] font-bold tracking-wider uppercase" style={{ color: pvAccent }}>
            내 가게 이름
          </p>
          <p className="mt-1 text-base font-bold" style={{ color: pvText }}>홍길동 원장</p>
          <p className="mt-0.5 text-xs" style={{ color: pvText, opacity: 0.62 }}>
            한 줄 소개가 여기에 보여요
          </p>
          <div className="mt-3 flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold"
            style={{ background: pvBtnBg, color: pvBtnTx }}>
            카카오로 문의하기
          </div>
        </div>
      </div>
      <p className="mt-1.5 text-center text-[10px] text-(--muted)">저장하면 실제 페이지에 반영됩니다</p>
    </Section>
  );
}
