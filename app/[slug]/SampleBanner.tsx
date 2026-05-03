"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function SampleBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      }`}
    >
      <Link
        href="https://kku-ui.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between gap-2 rounded-xl bg-(--card) border border-[#FFD600]/40 px-4 py-2.5 shadow-sm hover:border-[#FFD600]/70 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#FFD600] text-[10px] font-black text-[#111]">
            S
          </span>
          <span className="text-xs text-(--muted)">
            이건 샘플 페이지예요 —
            <span className="font-semibold text-foreground ml-1">
              나도 만들어보기
            </span>
          </span>
        </div>
        <span className="text-xs text-(--muted)">→</span>
      </Link>
    </div>
  );
}
