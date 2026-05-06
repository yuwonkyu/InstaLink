"use client";

import { useState } from "react";
import type { CustomLink } from "@/lib/types";

const LABEL_MAX = 30;
const URL_MAX   = 500;

type Props = {
  links: CustomLink[];
  onChange: (links: CustomLink[]) => void;
};

export default function LinkManager({ links, onChange }: Props) {
  const [label, setLabel] = useState("");
  const [url, setUrl]     = useState("");

  const [editIdx,   setEditIdx]   = useState<number | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editUrl,   setEditUrl]   = useState("");

  function normalizeUrl(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return trimmed;
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  }

  function add() {
    if (!label.trim() || !url.trim()) return;
    if (label.trim().length > LABEL_MAX || url.trim().length > URL_MAX) return;
    onChange([...links, { label: label.trim(), url: normalizeUrl(url) }]);
    setLabel(""); setUrl("");
  }

  function remove(idx: number) {
    onChange(links.filter((_, i) => i !== idx));
  }

  function startEdit(idx: number) {
    setEditIdx(idx);
    setEditLabel(links[idx].label);
    setEditUrl(links[idx].url);
  }

  function saveEdit() {
    if (editIdx === null || !editLabel.trim() || !editUrl.trim()) return;
    if (editLabel.trim().length > LABEL_MAX || editUrl.trim().length > URL_MAX) return;
    onChange(links.map((l, i) =>
      i === editIdx ? { label: editLabel.trim(), url: normalizeUrl(editUrl) } : l
    ));
    setEditIdx(null);
  }

  const inputCls =
    "rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15";

  return (
    <div>
      <p className="mb-3 text-xs text-(--muted)">
        네이버 스토어, 쿠팡 파트너스, 블로그, 유튜브 등 원하는 링크를 자유롭게 추가하세요.
      </p>

      {/* 기존 링크 목록 */}
      {links.length > 0 && (
        <ul className="mb-4 flex flex-col gap-2">
          {links.map((link, idx) => (
            <li key={idx} className="rounded-xl bg-(--secondary) px-3.5 py-2.5">
              {editIdx === idx ? (
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-0.5">
                    <div className="relative">
                      <input
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                        placeholder="버튼 이름 (예: 네이버 스토어 바로가기)"
                        maxLength={LABEL_MAX}
                        className={`w-full pr-12 ${inputCls}`}
                      />
                      <span className={`pointer-events-none absolute right-2 bottom-1.5 whitespace-nowrap text-[10px] ${
                        editLabel.length >= LABEL_MAX ? "text-red-500" : editLabel.length / LABEL_MAX >= 0.8 ? "text-orange-400" : "text-(--muted)"
                      }`}>{editLabel.length}/{LABEL_MAX}</span>
                    </div>
                  </div>
                  <input
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    placeholder="https://..."
                    maxLength={URL_MAX}
                    className={`w-full ${inputCls}`}
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={saveEdit}
                      disabled={!editLabel.trim() || !editUrl.trim() || editLabel.trim().length > LABEL_MAX || editUrl.trim().length > URL_MAX}
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
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium text-foreground">{link.label}</p>
                    <p className="truncate text-xs text-(--muted)">{link.url}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
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
        <p className="text-xs font-medium text-(--muted)">링크 추가</p>
        <div className="flex flex-col gap-0.5">
          <div className="relative">
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="버튼 이름 (예: 네이버 스토어 바로가기)"
              maxLength={LABEL_MAX}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 pr-12 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
            />
            <span className={`pointer-events-none absolute right-2 bottom-1.5 whitespace-nowrap text-[10px] ${
              label.length >= LABEL_MAX ? "text-red-500" : label.length / LABEL_MAX >= 0.8 ? "text-orange-400" : "text-(--muted)"
            }`}>{label.length}/{LABEL_MAX}</span>
          </div>
        </div>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          maxLength={URL_MAX}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <button
          type="button"
          onClick={add}
          disabled={!label.trim() || !url.trim() || label.trim().length > LABEL_MAX || url.trim().length > URL_MAX}
          className="self-start rounded-lg bg-foreground px-4 py-1.5 text-sm font-medium text-white disabled:opacity-40"
        >
          + 추가
        </button>
      </div>
    </div>
  );
}
