"use client";

import { useState, useTransition } from "react";
import { adminDeleteProfile, adminRestoreProfile } from "./actions";

type Props = {
  profileId: string;
  slug: string;
  name: string;
  isActive: boolean;
};

export default function AdminDeleteButton({ profileId, slug, name, isActive }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const [isPending, startTransition] = useTransition();

  const confirmed = confirmInput.trim() === slug;

  function openModal() {
    setConfirmInput("");
    setModalOpen(true);
  }

  function handleDelete() {
    if (!confirmed) return;
    startTransition(async () => {
      await adminDeleteProfile(profileId);
      setModalOpen(false);
    });
  }

  function handleRestore() {
    startTransition(async () => {
      await adminRestoreProfile(profileId);
    });
  }

  // 비활성 계정 → 복구 버튼만 표시
  if (!isActive) {
    return (
      <button
        type="button"
        onClick={handleRestore}
        disabled={isPending}
        className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 transition-colors disabled:opacity-50"
      >
        {isPending ? "…" : "복구"}
      </button>
    );
  }

  return (
    <>
      {/* 삭제 버튼 */}
      <button
        type="button"
        onClick={openModal}
        className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
      >
        삭제
      </button>

      {/* 경고 모달 */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => !isPending && setModalOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div className="mb-4 flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-xl">
                🗑️
              </span>
              <div>
                <p className="text-base font-bold text-foreground">계정 강제 삭제</p>
                <p className="mt-0.5 text-xs text-(--muted)">
                  <span className="font-semibold text-foreground">{name}</span>
                  {" "}/ {slug}
                </p>
              </div>
            </div>

            {/* 주의사항 */}
            <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 space-y-1.5">
              <p className="text-xs font-semibold text-red-700">⚠️ 삭제 시 다음이 적용됩니다</p>
              <ul className="space-y-1 text-xs text-red-600">
                <li>• 페이지가 즉시 비공개 처리됩니다</li>
                <li>• 플랜이 Free로 초기화됩니다</li>
                <li>• 진행 중인 구독 결제가 취소됩니다</li>
                <li>• 복구 버튼으로 되돌릴 수 있습니다</li>
                <li className="font-semibold">• 프로필 데이터(후기·서비스 등)는 유지됩니다</li>
              </ul>
            </div>

            {/* 확인 입력 */}
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-medium text-foreground">
                확인을 위해{" "}
                <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] text-red-600">
                  {slug}
                </code>
                을 입력하세요
              </label>
              <input
                type="text"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder={slug}
                autoFocus
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 transition-colors"
              />
            </div>

            {/* 버튼 */}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleDelete}
                disabled={!confirmed || isPending}
                className="w-full rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    삭제 중…
                  </span>
                ) : (
                  "삭제 실행"
                )}
              </button>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                disabled={isPending}
                className="w-full rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-foreground hover:bg-(--secondary) transition-colors disabled:opacity-50"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
