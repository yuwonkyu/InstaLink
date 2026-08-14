"use client";

import { useState } from "react";

type Status = "pending" | "completed";

export default function RefundStatusButton({
  requestId,
  initialStatus,
}: {
  requestId: string;
  initialStatus: Status;
}) {
  const [status, setStatus] = useState<Status>(initialStatus);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    const next: Status = status === "pending" ? "completed" : "pending";
    setLoading(true);
    try {
      const res = await fetch("/api/admin/refund-request", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, status: next }),
      });
      if (res.ok) setStatus(next);
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
        status === "pending"
          ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
          : "bg-green-50 text-green-700 hover:bg-green-100"
      }`}
    >
      {loading ? "…" : status === "pending" ? "처리 대기" : "처리 완료"}
    </button>
  );
}
