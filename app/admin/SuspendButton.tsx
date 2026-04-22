"use client";

import { useState } from "react";

type Props = {
  profileId: string;
  initialActive: boolean;
};

export default function SuspendButton({ profileId, initialActive }: Props) {
  const [isActive, setIsActive] = useState(initialActive);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    const next = !isActive;
    if (next === true) {
      if (!confirm("이 계정을 다시 공개하시겠습니까?")) return;
    } else {
      if (!confirm("이 계정을 임시 중지하시겠습니까?\n고객 페이지가 즉시 비공개 처리됩니다.")) return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/suspend", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId, is_active: next }),
      });
      if (res.ok) setIsActive(next);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
        isActive
          ? "bg-red-50 text-red-600 hover:bg-red-100"
          : "bg-green-50 text-green-700 hover:bg-green-100"
      }`}
    >
      {loading ? "…" : isActive ? "중지" : "복구"}
    </button>
  );
}
