"use client";

import { useState } from "react";
import Link from "next/link";

export default function RefundRequestForm() {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/billing/refund-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "신청 처리 중 오류가 발생했습니다.");
        return;
      }
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <h2 className="mb-1 text-sm font-semibold text-foreground">환불 신청 접수 완료</h2>
        <p className="text-xs text-(--muted)">
          신청이 접수되었습니다. 영업일 기준 최대 3일 내 확인 후 처리해 드릴게요.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5">
      <h2 className="mb-1 text-sm font-semibold text-foreground">환불 신청</h2>
      <p className="mb-3 text-xs text-(--muted)">
        결제일로부터 7일 이내 미사용 시 전액 환불 가능합니다.{" "}
        <Link href="/refund" className="underline hover:text-foreground">환불 정책 보기</Link>
      </p>

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-block rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-foreground hover:bg-(--secondary) transition-colors"
        >
          환불 신청하기
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="환불 사유를 알려주시면 처리에 도움이 돼요 (선택)"
            rows={3}
            className="w-full rounded-xl border border-gray-200 bg-(--secondary) px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-colors resize-none"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-white hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              {submitting ? "신청 중…" : "신청 제출"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={submitting}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-(--muted) hover:bg-(--secondary) transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
