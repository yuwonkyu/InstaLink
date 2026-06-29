"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { publishQuickStart } from "@/app/dashboard/actions";

type Props = {
  defaultName: string;
  defaultShopName: string;
};

const inputCls =
  "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-foreground placeholder:text-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 transition-colors";

export default function QuickStartCard({ defaultName, defaultShopName }: Props) {
  const router = useRouter();
  const [name, setName] = useState(defaultName);
  const [shopName, setShopName] = useState(defaultShopName);
  const [primaryLink, setPrimaryLink] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handlePublish() {
    setError(null);
    if (!name.trim()) {
      setError("이름을 입력해주세요.");
      return;
    }
    startTransition(async () => {
      try {
        await publishQuickStart({ name, shop_name: shopName, primaryLink });
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "공개 중 오류가 발생했습니다.");
      }
    });
  }

  return (
    <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-5 shadow-[0_4px_20px_rgba(79,70,229,0.08)]">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-lg">🚀</span>
        <h2 className="text-base font-bold text-foreground">아직 페이지가 공개되지 않았어요</h2>
      </div>
      <p className="mb-4 text-sm text-(--muted)">
        이름과 대표 링크만 넣으면 <b className="text-foreground">바로 공개</b>돼요. 나머지는 공개 후 천천히 꾸며도 괜찮아요.
      </p>

      <div className="flex flex-col gap-2.5">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-(--muted)">
            이름 · 닉네임 <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="홍길동 트레이너"
            className={inputCls}
            maxLength={30}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-(--muted)">
            브랜드명 · 상호 <span className="text-(--muted)">(선택)</span>
          </label>
          <input
            type="text"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="FIT WITH JI"
            className={inputCls}
            maxLength={30}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-(--muted)">
            대표 링크 <span className="text-(--muted)">(카카오·네이버 예약, 인스타그램 등 아무 링크나, 선택)</span>
          </label>
          <input
            type="url"
            value={primaryLink}
            onChange={(e) => setPrimaryLink(e.target.value)}
            placeholder="예: open.kakao.com / naver.me / instagram.com/..."
            className={inputCls}
            maxLength={300}
          />
        </div>
      </div>

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={handlePublish}
          disabled={isPending || !name.trim()}
          className="flex-1 rounded-xl bg-indigo-500 py-3 text-sm font-bold text-white hover:bg-indigo-600 disabled:opacity-50 transition-colors"
        >
          {isPending ? "공개하는 중…" : "내 페이지 공개하기 →"}
        </button>
        <Link
          href="/dashboard/edit"
          className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-(--muted) hover:bg-(--secondary) transition-colors"
        >
          직접 편집
        </Link>
      </div>
    </div>
  );
}
