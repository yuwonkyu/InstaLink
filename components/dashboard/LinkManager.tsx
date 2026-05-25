"use client";

import { useState } from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import type { CustomLink, CustomLinkStyle } from "@/lib/types";
import { getLinkTitle } from "@/lib/types";

const TITLE_MAX = 40;
const URL_MAX   = 500;

const STYLE_OPTIONS: { value: CustomLinkStyle; label: string; desc: string }[] = [
  { value: "text",  label: "텍스트",  desc: "이미지 없이 버튼만" },
  { value: "thumb", label: "썸네일",  desc: "작은 이미지 + 제목" },
  { value: "card",  label: "카드",    desc: "큰 이미지 + 제목" },
];

function normalizeUrl(raw: string) {
  const t = raw.trim();
  if (!t) return t;
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
}

type Props = {
  links: CustomLink[];
  limit?: number;
  onChange: (links: CustomLink[]) => void;
};

type FormState = {
  title: string;
  url: string;
  style: CustomLinkStyle;
  image_url: string;
};

const EMPTY_FORM: FormState = { title: "", url: "", style: "text", image_url: "" };

export default function LinkManager({ links, limit, onChange }: Props) {
  const [form,    setForm]    = useState<FormState>(EMPTY_FORM);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<FormState>(EMPTY_FORM);

  const atLimit = limit !== undefined && limit !== Infinity && links.length >= limit;

  function add() {
    if (!form.title.trim() || !form.url.trim()) return;
    onChange([...links, {
      title: form.title.trim(),
      url: normalizeUrl(form.url),
      style: form.style,
      image_url: form.image_url || undefined,
    }]);
    setForm(EMPTY_FORM);
  }

  function remove(idx: number) {
    onChange(links.filter((_, i) => i !== idx));
  }

  function move(idx: number, dir: -1 | 1) {
    const next = [...links];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  }

  function startEdit(idx: number) {
    const l = links[idx];
    setEditIdx(idx);
    setEditForm({
      title: getLinkTitle(l),
      url: l.url,
      style: l.style ?? "text",
      image_url: l.image_url ?? "",
    });
  }

  function saveEdit() {
    if (editIdx === null || !editForm.title.trim() || !editForm.url.trim()) return;
    onChange(links.map((l, i) =>
      i === editIdx ? {
        title: editForm.title.trim(),
        url: normalizeUrl(editForm.url),
        style: editForm.style,
        image_url: editForm.image_url || undefined,
      } : l
    ));
    setEditIdx(null);
  }

  const inputCls = "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15";

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-(--muted)">
        카카오, 인스타DM, 네이버 예약, 유튜브 등 원하는 링크를 자유롭게 추가하세요.
        {limit && limit !== Infinity ? ` (${links.length}/${limit}개)` : ""}
      </p>

      {/* 기존 링크 목록 */}
      {links.length > 0 && (
        <ul className="flex flex-col gap-2">
          {links.map((link, idx) => (
            <li key={idx} className="rounded-xl bg-(--secondary) px-3.5 py-2.5">
              {editIdx === idx ? (
                <LinkForm
                  form={editForm}
                  onChange={setEditForm}
                  inputCls={inputCls}
                  onSave={saveEdit}
                  onCancel={() => setEditIdx(null)}
                  saveLabel="저장"
                />
              ) : (
                <div className="flex items-center justify-between gap-3">
                  {/* 순서 변경 버튼 */}
                  <div className="flex shrink-0 flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={() => move(idx, -1)}
                      disabled={idx === 0}
                      className="flex h-5 w-5 items-center justify-center rounded text-gray-300 hover:text-gray-500 disabled:opacity-20"
                      aria-label="위로"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => move(idx, 1)}
                      disabled={idx === links.length - 1}
                      className="flex h-5 w-5 items-center justify-center rounded text-gray-300 hover:text-gray-500 disabled:opacity-20"
                      aria-label="아래로"
                    >
                      ▼
                    </button>
                  </div>

                  <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
                    {link.image_url && (
                      <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md">
                        <Image src={link.image_url} alt="" fill sizes="32px" className="object-cover" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{getLinkTitle(link)}</p>
                      <p className="truncate text-xs text-(--muted)">{link.style ?? "text"} · {link.url}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <button type="button" onClick={() => startEdit(idx)} className="text-xs text-blue-400 hover:text-blue-600">수정</button>
                    <button type="button" onClick={() => remove(idx)} className="text-xs text-red-400 hover:text-red-600">삭제</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* 추가 폼 */}
      {atLimit ? (
        <div className="rounded-xl border border-dashed border-gray-200 px-4 py-3 text-center text-xs text-(--muted)">
          🔒 링크 최대 {limit}개 달성 — 업그레이드하면 더 추가할 수 있어요
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-200 p-3">
          <p className="mb-2.5 text-xs font-medium text-(--muted)">링크 추가</p>
          <LinkForm
            form={form}
            onChange={setForm}
            inputCls={inputCls}
            onSave={add}
            saveLabel="+ 추가"
          />
        </div>
      )}
    </div>
  );
}

// ── 공용 폼 ──────────────────────────────────────────────────

type LinkFormProps = {
  form: FormState;
  onChange: (f: FormState) => void;
  inputCls: string;
  onSave: () => void;
  onCancel?: () => void;
  saveLabel: string;
};

function LinkForm({ form, onChange, inputCls, onSave, onCancel, saveLabel }: LinkFormProps) {
  const needsImage = form.style === "card" || form.style === "thumb";

  return (
    <div className="flex flex-col gap-2">
      {/* 스타일 선택 */}
      <div className="flex gap-1.5">
        {STYLE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange({ ...form, style: opt.value })}
            className={`flex-1 rounded-lg border px-2 py-1.5 text-center text-[11px] font-medium transition-colors ${
              form.style === opt.value
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white text-(--muted) hover:border-gray-300"
            }`}
          >
            <div className="font-semibold">{opt.label}</div>
            <div className="mt-0.5 opacity-70">{opt.desc}</div>
          </button>
        ))}
      </div>

      {/* 제목 */}
      <div className="relative">
        <input
          type="text"
          value={form.title}
          onChange={(e) => onChange({ ...form, title: e.target.value })}
          placeholder="버튼 제목 (예: 카카오 오픈채팅)"
          maxLength={TITLE_MAX}
          className={`pr-12 ${inputCls}`}
          onKeyDown={(e) => e.key === "Enter" && !onCancel && onSave()}
        />
        <span className={`pointer-events-none absolute right-2 bottom-2 text-[10px] ${
          form.title.length >= TITLE_MAX ? "text-red-500" : "text-(--muted)"
        }`}>{form.title.length}/{TITLE_MAX}</span>
      </div>

      {/* URL */}
      <input
        type="url"
        value={form.url}
        onChange={(e) => onChange({ ...form, url: e.target.value })}
        placeholder="https://..."
        maxLength={URL_MAX}
        className={inputCls}
        onKeyDown={(e) => e.key === "Enter" && !onCancel && onSave()}
      />

      {/* 이미지 업로드 (카드/썸네일) */}
      {needsImage && (
        <div className="flex items-center gap-2">
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "instalink"}
            options={{ maxFiles: 1, resourceType: "image", clientAllowedFormats: ["jpg", "jpeg", "png", "webp"] }}
            onSuccess={(result) => {
              const info = result.info;
              if (typeof info === "object" && "secure_url" in info) {
                onChange({ ...form, image_url: info.secure_url as string });
              }
            }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-(--muted) hover:border-gray-300"
              >
                {form.image_url ? "이미지 변경" : "이미지 업로드"}
              </button>
            )}
          </CldUploadWidget>
          {form.image_url && (
            <div className="relative h-8 w-8 overflow-hidden rounded-md">
              <Image src={form.image_url} alt="" fill sizes="32px" className="object-cover" />
            </div>
          )}
          {form.image_url && (
            <button
              type="button"
              onClick={() => onChange({ ...form, image_url: "" })}
              className="text-xs text-red-400 hover:text-red-600"
            >
              제거
            </button>
          )}
        </div>
      )}

      {/* 버튼 */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onSave}
          disabled={!form.title.trim() || !form.url.trim()}
          className="rounded-lg bg-foreground px-4 py-1.5 text-sm font-medium text-white disabled:opacity-40"
        >
          {saveLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-(--muted)"
          >
            취소
          </button>
        )}
      </div>
    </div>
  );
}
