"use client";

import { useState, useTransition } from "react";
import { saveOnboarding } from "./actions";
import { getSiteUrl } from "@/lib/site-url";

type Props = {
  defaultName: string;
  slug: string;
};

export default function OnboardingForm({ defaultName, slug }: Props) {
  const [name, setName]           = useState(defaultName);
  const [kakaoUrl, setKakaoUrl]   = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError]         = useState<string | null>(null);

  const origin =
    typeof window !== "undefined" ? window.location.origin : getSiteUrl();

  const inputCls =
    "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-foreground placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-colors";

  function handleSave() {
    setError(null);
    startTransition(async () => {
      try {
        await saveOnboarding({
          name: name.trim() || defaultName,
          kakao_url: kakaoUrl.trim(),
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "오류가 발생했습니다.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-bold text-foreground">내 링크페이지 만들기</h2>
        <p className="mt-1 text-sm text-(--muted)">딱 2가지만 입력하면 바로 완성돼요.</p>
      </div>

      {/* 슬러그 미리보기 */}
      {slug && (
        <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
          <p className="text-xs font-medium text-blue-500 mb-0.5">내 링크 주소</p>
          <p className="text-sm font-semibold text-blue-700 break-all">
            {origin}/<span className="text-blue-900">{slug}</span>
          </p>
          <p className="mt-1 text-xs text-(--muted)">주소는 대시보드에서 변경할 수 있어요.</p>
        </div>
      )}

      {/* 이름 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          이름 · 닉네임 <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="홍길동 트레이너"
          className={inputCls}
          autoFocus
        />
        <p className="text-xs text-(--muted)">고객에게 보이는 이름이에요.</p>
      </div>

      {/* 카카오 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          카카오 오픈채팅 URL{" "}
          <span className="text-xs font-normal text-(--muted)">(선택)</span>
        </label>
        <input
          type="url"
          value={kakaoUrl}
          onChange={(e) => setKakaoUrl(e.target.value)}
          placeholder="https://open.kakao.com/o/..."
          className={inputCls}
        />
        <p className="text-xs text-(--muted)">
          카카오톡 → 채팅 탭 → 오픈채팅 만들기 → 링크 복사.{" "}
          나중에 추가해도 돼요.
        </p>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={isPending || !name.trim()}
        className="w-full rounded-xl bg-foreground py-3 text-sm font-bold text-white hover:opacity-85 disabled:opacity-40 transition-opacity"
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            만드는 중…
          </span>
        ) : (
          "내 페이지 완성하기 🎉"
        )}
      </button>
    </div>
  );
}
