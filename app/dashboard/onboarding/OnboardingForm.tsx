"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { saveOnboardingStep1, saveOnboardingStep2, saveOnboardingStep3 } from "./actions";
import { getSiteUrl } from "@/lib/site-url";
import { trackSignup } from "@/lib/tracking";
import type { Service, CustomLink } from "@/lib/types";
import LinkManager from "@/components/dashboard/LinkManager";

type Step = 1 | 2 | 3 | 4;

type Props = {
  defaultName: string;
  slug: string;
  defaultShopName?: string;
  defaultTagline?: string;
  defaultDescription?: string;
  defaultInstagramId?: string;
  defaultImageUrl?: string;
  defaultServices?: Service[];
  defaultCustomLinks?: CustomLink[];
};

const STEP_LABELS = ["기본 정보", "서비스", "링크", "완성!"];

const inputCls =
  "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-foreground placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-colors";

export default function OnboardingForm({
  defaultName, slug,
  defaultShopName = "", defaultTagline = "", defaultDescription = "",
  defaultInstagramId = "", defaultImageUrl = "",
  defaultServices = [], defaultCustomLinks = [],
}: Props) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Step 1
  const [name,        setName]        = useState(defaultName);
  const [shopName,    setShopName]    = useState(defaultShopName);
  const [tagline,     setTagline]     = useState(defaultTagline);
  const [description, setDescription] = useState(defaultDescription);
  const [instagramId, setInstagramId] = useState(defaultInstagramId);
  const [imageUrl,    setImageUrl]    = useState(defaultImageUrl);

  // Step 2
  const [services, setServices] = useState<Service[]>(defaultServices);

  // Step 3
  const [customLinks, setCustomLinks] = useState<CustomLink[]>(defaultCustomLinks);

  const origin = typeof window !== "undefined" ? window.location.origin : getSiteUrl();
  const myUrl = `${origin}/${slug}`;

  function run(fn: () => Promise<void>) {
    setError(null);
    startTransition(async () => {
      try {
        await fn();
      } catch (e) {
        setError(e instanceof Error ? e.message : "오류가 발생했습니다.");
      }
    });
  }

  function handleStep1() {
    if (!name.trim()) return;
    run(async () => {
      await saveOnboardingStep1({
        name: name.trim(),
        shop_name: shopName.trim() || name.trim(),
        tagline: tagline.trim(),
        description: description.trim(),
        instagram_id: instagramId.trim(),
        image_url: imageUrl,
      });
      trackSignup();
      setStep(2);
    });
  }

  function handleStep2(skip = false) {
    run(async () => {
      if (!skip && services.some((s) => s.name.trim())) {
        await saveOnboardingStep2(services.filter((s) => s.name.trim()));
      }
      setStep(3);
    });
  }

  function handleStep3(skip = false) {
    run(async () => {
      if (!skip && customLinks.length > 0) {
        await saveOnboardingStep3(customLinks);
      }
      setStep(4);
    });
  }

  return (
    <div className="flex flex-col gap-5">
      {/* 진행 표시 */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-(--muted)">{step}/4단계</span>
          <span className="text-xs text-(--muted)">{STEP_LABELS[step - 1]}</span>
        </div>
        <div className="flex gap-1.5">
          {STEP_LABELS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                step > i ? "bg-foreground" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
      )}

      {/* ── 1단계: 기본 정보 ── */}
      {step === 1 && (
        <>
          <div>
            <h2 className="text-lg font-bold text-foreground">내 링크페이지 만들기</h2>
            <p className="mt-1 text-sm text-(--muted)">기본 정보만 입력하면 바로 완성돼요!</p>
          </div>

          {slug && (
            <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
              <p className="text-xs font-medium text-blue-500 mb-0.5">내 링크 주소</p>
              <p className="text-sm font-semibold text-blue-700 break-all">
                {origin}/<span className="text-blue-900">{slug}</span>
              </p>
            </div>
          )}

          {/* 프로필 사진 */}
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-gray-100 ring-2 ring-black/8">
              {imageUrl ? (
                <Image src={imageUrl} alt="" fill sizes="64px" className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl">👤</div>
              )}
            </div>
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "instalink"}
              options={{ maxFiles: 1, resourceType: "image", clientAllowedFormats: ["jpg","jpeg","png","webp"] }}
              onSuccess={(result) => {
                const info = result.info;
                if (typeof info === "object" && "secure_url" in info) {
                  setImageUrl(info.secure_url as string);
                }
              }}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-foreground hover:border-gray-300 transition-colors"
                >
                  {imageUrl ? "사진 변경" : "사진 추가"}
                </button>
              )}
            </CldUploadWidget>
          </div>

          {/* 이름 (필수) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              이름 · 닉네임 <span className="text-red-400">*</span>
            </label>
            <input
              type="text" value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동 트레이너"
              className={inputCls} autoFocus maxLength={30}
            />
          </div>

          {/* 상호명 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              브랜드명 · 상호 <span className="text-xs font-normal text-(--muted)">(선택)</span>
            </label>
            <input
              type="text" value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="FIT WITH JI" className={inputCls} maxLength={30}
            />
          </div>

          {/* 한 줄 소개 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              한 줄 소개 <span className="text-xs font-normal text-(--muted)">(선택)</span>
            </label>
            <input
              type="text" value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="10년 경력 PT 트레이너" className={inputCls} maxLength={50}
            />
          </div>

          {/* 자기소개 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              자기소개 <span className="text-xs font-normal text-(--muted)">(선택)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="안녕하세요! 강남에서 PT를 하고 있는 홍길동입니다..."
              className={`${inputCls} min-h-[80px] resize-none`} maxLength={300}
            />
          </div>

          {/* 인스타 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              인스타그램 아이디 <span className="text-xs font-normal text-(--muted)">(선택)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-(--muted)">@</span>
              <input
                type="text"
                value={instagramId}
                onChange={(e) => setInstagramId(e.target.value.replace(/^@/, ""))}
                placeholder="my_instagram"
                className={`${inputCls} pl-8`} maxLength={30}
              />
            </div>
          </div>

          <button
            type="button" onClick={handleStep1}
            disabled={isPending || !name.trim()}
            className="w-full rounded-xl bg-foreground py-3 text-sm font-bold text-white hover:opacity-85 disabled:opacity-40 transition-opacity"
          >
            {isPending ? <Spinner /> : "다음 →"}
          </button>
        </>
      )}

      {/* ── 2단계: 서비스 ── */}
      {step === 2 && (
        <>
          <div>
            <h2 className="text-lg font-bold text-foreground">서비스 · 가격</h2>
            <p className="mt-1 text-sm text-(--muted)">
              제공하는 서비스를 입력해요. 가격을 보여주면 문의가 늘어요!
            </p>
          </div>

          <SimpleServiceEditor services={services} onChange={setServices} />

          <div className="flex flex-col gap-2 pt-1">
            <button
              type="button" onClick={() => handleStep2(false)}
              disabled={isPending}
              className="w-full rounded-xl bg-foreground py-3 text-sm font-bold text-white hover:opacity-85 disabled:opacity-40 transition-opacity"
            >
              {isPending ? <Spinner /> : services.some((s) => s.name.trim()) ? "저장하고 다음 →" : "다음 →"}
            </button>
            <button
              type="button" onClick={() => handleStep2(true)}
              disabled={isPending}
              className="w-full rounded-xl py-2.5 text-sm text-(--muted) hover:text-foreground transition-colors"
            >
              나중에 추가할게요
            </button>
          </div>
        </>
      )}

      {/* ── 3단계: 링크 ── */}
      {step === 3 && (
        <>
          <div>
            <h2 className="text-lg font-bold text-foreground">링크 추가</h2>
            <p className="mt-1 text-sm text-(--muted)">
              카카오, 인스타DM, 네이버 예약 등을 추가해요.
            </p>
          </div>

          <LinkManager links={customLinks} limit={5} onChange={setCustomLinks} />

          <div className="flex flex-col gap-2 pt-1">
            <button
              type="button" onClick={() => handleStep3(false)}
              disabled={isPending}
              className="w-full rounded-xl bg-foreground py-3 text-sm font-bold text-white hover:opacity-85 disabled:opacity-40 transition-opacity"
            >
              {isPending ? <Spinner /> : customLinks.length > 0 ? "저장하고 완성! 🎉" : "완성! 🎉"}
            </button>
            <button
              type="button" onClick={() => handleStep3(true)}
              disabled={isPending}
              className="w-full rounded-xl py-2.5 text-sm text-(--muted) hover:text-foreground transition-colors"
            >
              나중에 추가할게요
            </button>
          </div>
        </>
      )}

      {/* ── 4단계: 완성! ── */}
      {step === 4 && (
        <div className="flex flex-col items-center gap-5 py-2 text-center">
          <div className="text-5xl">🎉</div>
          <div>
            <h2 className="text-xl font-bold text-foreground">내 링크페이지 완성!</h2>
            <p className="mt-1 text-sm text-(--muted)">
              아래 링크를 인스타 바이오에 붙여넣으세요.
            </p>
          </div>

          {/* 링크 복사 */}
          <div className="w-full rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
            <p className="mb-1 text-xs font-medium text-blue-500">내 링크</p>
            <p className="break-all text-sm font-semibold text-blue-800">{myUrl}</p>
          </div>

          <div className="flex w-full flex-col gap-2">
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(myUrl).catch(() => {});
                alert("링크가 복사됐어요!");
              }}
              className="w-full rounded-xl border border-foreground py-3 text-sm font-bold text-foreground hover:bg-foreground hover:text-white transition-colors"
            >
              링크 복사하기
            </button>
            <button
              type="button"
              onClick={() => router.push("/dashboard?onboarded=1")}
              className="w-full rounded-xl bg-foreground py-3 text-sm font-bold text-white hover:opacity-85 transition-opacity"
            >
              대시보드에서 더 꾸미기 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── 스피너 ────────────────────────────────────────────────────

function Spinner() {
  return (
    <span className="flex items-center justify-center gap-2">
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      저장 중…
    </span>
  );
}

// ── 간단 서비스 편집기 ─────────────────────────────────────────

function SimpleServiceEditor({
  services, onChange,
}: {
  services: Service[];
  onChange: (s: Service[]) => void;
}) {
  function addEmpty() {
    onChange([...services, { name: "", price: "", note: "" }]);
  }
  function update(idx: number, field: keyof Service, value: string) {
    onChange(services.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  }
  function remove(idx: number) {
    onChange(services.filter((_, i) => i !== idx));
  }

  const fieldCls =
    "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-colors";

  return (
    <div className="flex flex-col gap-3">
      {services.map((svc, idx) => (
        <div key={idx} className="flex flex-col gap-2 rounded-xl bg-gray-50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-(--muted)">서비스 {idx + 1}</span>
            <button type="button" onClick={() => remove(idx)} className="text-xs text-red-400 hover:text-red-600">삭제</button>
          </div>
          <input
            type="text" value={svc.name}
            onChange={(e) => update(idx, "name", e.target.value)}
            placeholder="서비스 이름 (예: 1:1 PT 1회)"
            className={fieldCls} maxLength={40}
          />
          <input
            type="text" value={svc.price}
            onChange={(e) => update(idx, "price", e.target.value)}
            placeholder="가격 (예: 80,000원)"
            className={fieldCls} maxLength={20}
          />
          <input
            type="text" value={svc.note ?? ""}
            onChange={(e) => update(idx, "note", e.target.value)}
            placeholder="한 줄 설명 (선택)"
            className={fieldCls} maxLength={60}
          />
        </div>
      ))}
      {services.length < 3 && (
        <button
          type="button" onClick={addEmpty}
          className="rounded-xl border border-dashed border-gray-300 py-2.5 text-sm text-(--muted) hover:border-gray-400 hover:text-foreground transition-colors"
        >
          + 서비스 추가
        </button>
      )}
    </div>
  );
}
