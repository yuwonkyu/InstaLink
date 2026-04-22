"use client";

import { useState } from "react";
import type { Review } from "@/lib/types";

type Props = {
  reviews: Review[];
  onChange: (reviews: Review[]) => void;
};

// "2025-03" → "2025년 3월"
function formatDate(d: string) {
  const [y, m] = d.split("-");
  if (!y || !m) return d;
  return `${y}년 ${parseInt(m)}월`;
}

export default function ReviewManager({ reviews, onChange }: Props) {
  const [text,   setText]   = useState("");
  const [author, setAuthor] = useState("");
  const [date,   setDate]   = useState("");

  const [editIdx,    setEditIdx]    = useState<number | null>(null);
  const [editText,   setEditText]   = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editDate,   setEditDate]   = useState("");

  function add() {
    if (!text.trim() || !author.trim()) return;
    onChange([
      ...reviews,
      { text: text.trim(), author: author.trim(), date: date || undefined },
    ]);
    setText(""); setAuthor(""); setDate("");
  }

  function remove(idx: number) {
    onChange(reviews.filter((_, i) => i !== idx));
  }

  function startEdit(idx: number) {
    const r = reviews[idx];
    setEditIdx(idx);
    setEditText(r.text);
    setEditAuthor(r.author);
    setEditDate(r.date ?? "");
  }

  function saveEdit() {
    if (editIdx === null || !editText.trim() || !editAuthor.trim()) return;
    onChange(
      reviews.map((r, i) =>
        i === editIdx
          ? { text: editText.trim(), author: editAuthor.trim(), date: editDate || undefined }
          : r
      )
    );
    setEditIdx(null);
  }

  return (
    <div>
      {/* 기존 목록 */}
      {reviews.length > 0 && (
        <ul className="mb-4 flex flex-col gap-2">
          {reviews.map((rev, idx) => (
            <li key={idx} className="rounded-xl bg-(--secondary) px-3.5 py-2.5">
              {editIdx === idx ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    rows={2}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    placeholder="후기 내용"
                    className="resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
                  />
                  <input
                    value={editAuthor}
                    onChange={(e) => setEditAuthor(e.target.value)}
                    placeholder="작성자 (예: 30대 여성 회원)"
                    className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-gray-400"
                  />
                  <input
                    type="month"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-gray-400"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={saveEdit}
                      disabled={!editText.trim() || !editAuthor.trim()}
                      className="rounded-lg bg-foreground px-3 py-1 text-xs font-medium text-white disabled:opacity-40"
                    >
                      저장
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditIdx(null)}
                      className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-(--muted)"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm text-foreground">"{rev.text}"</span>
                    <span className="text-xs font-semibold text-(--muted)">
                      — {rev.author}
                      {rev.date && (
                        <span className="ml-1.5 font-normal opacity-70">
                          {formatDate(rev.date)}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(idx)}
                      className="text-xs text-blue-400 hover:text-blue-600"
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(idx)}
                      className="text-xs text-red-400 hover:text-red-600"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* 추가 폼 */}
      <div className="flex flex-col gap-2 rounded-xl border border-dashed border-gray-200 p-3">
        <p className="text-xs font-medium text-(--muted)">후기 추가</p>
        <textarea
          rows={2}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="후기 내용"
          className="resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
        />
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="작성자 (예: 30대 여성 회원)"
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
        />
        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-(--muted)">후기 날짜 (선택)</label>
          <input
            type="month"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-400"
          />
        </div>
        <button
          type="button"
          onClick={add}
          disabled={!text.trim() || !author.trim()}
          className="self-start rounded-lg bg-foreground px-4 py-1.5 text-sm font-medium text-white disabled:opacity-40"
        >
          + 추가
        </button>
      </div>
    </div>
  );
}
