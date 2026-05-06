"use client";

import { useState } from "react";
import Link from "next/link";
import type { Service } from "@/lib/types";
import {
  SERVICE_LIMITS,
  serviceFormSchema,
  sanitizeServices,
} from "@/lib/service-validation";

type ServiceDraft = { name: string; price: string; note: string };
type FieldErrors = Partial<Record<keyof ServiceDraft, string>>;

const EMPTY: ServiceDraft = { name: "", price: "", note: "" };

function validate(draft: ServiceDraft): FieldErrors {
  const result = serviceFormSchema.safeParse(draft);
  if (result.success) return {};
  const errors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof ServiceDraft;
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

function cntColor(len: number, max: number) {
  const r = len / max;
  if (r >= 1) return "text-red-500";
  if (r >= 0.8) return "text-orange-400";
  return "text-(--muted)";
}

type Props = {
  services: Service[];
  invalidServiceIndex?: number | null;
  isPaidPlan: boolean;
  isProPlan?: boolean;
  limit?: number;
  aiLoading: string | null;
  onAISuggest: () => void;
  onChange: (services: Service[]) => void;
  category: string;
  onCategoryChange: (c: string) => void;
  templateServices: Service[];
};

const CATEGORIES = ["PT/헬스", "필라테스/요가", "미용실/네일", "카페", "프리랜서/크리에이터"];

export default function ServiceManager({
  services,
  invalidServiceIndex,
  isProPlan = false,
  limit,
  aiLoading,
  onAISuggest,
  onChange,
  category,
  onCategoryChange,
  templateServices,
}: Props) {
  const atLimit = limit !== undefined && services.length >= limit;

  const [addDraft,   setAddDraft]   = useState<ServiceDraft>(EMPTY);
  const [addErrors,  setAddErrors]  = useState<FieldErrors>({});
  const [editIdx,    setEditIdx]    = useState<number | null>(null);
  const [editDraft,  setEditDraft]  = useState<ServiceDraft>(EMPTY);
  const [editErrors, setEditErrors] = useState<FieldErrors>({});
  const [showTemplates, setShowTemplates] = useState(true);

  function updateAdd(field: keyof ServiceDraft, value: string) {
    const next = { ...addDraft, [field]: value };
    setAddDraft(next);
    setAddErrors(validate(next));
  }

  function updateEdit(field: keyof ServiceDraft, value: string) {
    const next = { ...editDraft, [field]: value };
    setEditDraft(next);
    setEditErrors(validate(next));
  }

  function add() {
    const errors = validate(addDraft);
    if (Object.keys(errors).length) { setAddErrors(errors); return; }
    const parsed = serviceFormSchema.parse(addDraft);
    onChange([...services, parsed]);
    setAddDraft(EMPTY);
    setAddErrors({});
  }

  function remove(idx: number) {
    onChange(services.filter((_, i) => i !== idx));
  }

  function startEdit(idx: number) {
    const s = services[idx];
    setEditIdx(idx);
    setEditDraft({ name: s.name, price: s.price, note: s.note ?? "" });
    setEditErrors({});
  }

  function saveEdit() {
    if (editIdx === null) return;
    const errors = validate(editDraft);
    if (Object.keys(errors).length) { setEditErrors(errors); return; }
    const parsed = serviceFormSchema.parse(editDraft);
    onChange(services.map((s, i) => (i === editIdx ? parsed : s)));
    setEditIdx(null);
    setEditDraft(EMPTY);
    setEditErrors({});
  }

  function cancelEdit() {
    setEditIdx(null);
    setEditDraft(EMPTY);
    setEditErrors({});
  }

  function applyTemplates() {
    onChange(sanitizeServices(templateServices));
    setShowTemplates(false);
  }

  const addValid  = Object.keys(validate(addDraft)).length === 0 && addDraft.name.trim() && addDraft.price.trim();
  const editValid = Object.keys(validate(editDraft)).length === 0 && editDraft.name.trim() && editDraft.price.trim();

  const inputCls = "rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15";

  return (
    <div>
      {/* 예시 템플릿 패널 */}
      {showTemplates && (
        <div className="mb-4 rounded-xl border border-gray-100 bg-(--secondary) p-3">
          <div className="mb-2.5 flex items-center gap-2">
            <span className="text-xs font-medium text-(--muted)">업종</span>
            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="flex-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs text-foreground outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <button
              type="button"
              onClick={() => setShowTemplates(false)}
              className="text-xs text-(--muted) hover:text-foreground transition-colors"
            >
              닫기
            </button>
          </div>
          <ul className="mb-3 flex flex-col gap-1.5">
            {templateServices.map((svc) => (
              <li key={svc.name} className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-xs">
                <span className="font-medium text-foreground">{svc.name}</span>
                <span className="text-(--muted)">{svc.price}</span>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={applyTemplates}
              className="flex-1 rounded-lg bg-foreground py-2 text-xs font-semibold text-white hover:opacity-80 transition-opacity"
            >
              📋 예시로 채우기
            </button>
            {isProPlan && (
              <button
                type="button"
                onClick={onAISuggest}
                disabled={aiLoading === "services"}
                className="flex-1 rounded-lg border border-blue-200 bg-white py-2 text-xs font-semibold text-blue-500 hover:bg-blue-50 disabled:opacity-50 transition-colors"
              >
                {aiLoading === "services" ? "생성 중…" : "✨ AI로 채우기"}
              </button>
            )}
          </div>
        </div>
      )}

      {!showTemplates && (
        <button
          type="button"
          onClick={() => setShowTemplates(true)}
          className="mb-3 text-xs font-medium text-(--muted) hover:text-foreground transition-colors"
        >
          📋 업종별 예시 보기
        </button>
      )}

      {/* 기존 서비스 목록 */}
      {services.length > 0 && (
        <ul className="mb-4 flex flex-col gap-2">
          {services.map((svc, idx) => (
            <li
              key={idx}
              className={`rounded-xl bg-(--secondary) px-3.5 py-2.5 ${
                invalidServiceIndex === idx + 1 ? "border border-red-300 ring-1 ring-red-200" : ""
              }`}
            >
              {invalidServiceIndex === idx + 1 && (
                <p className="mb-2 text-[11px] font-semibold text-red-500">
                  저장 불가 항목: 이 카드 내용을 먼저 수정해주세요.
                </p>
              )}
              {editIdx === idx ? (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <input
                        value={editDraft.name}
                        onChange={(e) => updateEdit("name", e.target.value)}
                        maxLength={SERVICE_LIMITS.name}
                        placeholder="서비스명"
                        className={`w-full ${inputCls}`}
                      />
                      <span className={`self-end whitespace-nowrap text-[10px] ${cntColor(editDraft.name.length, SERVICE_LIMITS.name)}`}>
                        {editDraft.name.length}/{SERVICE_LIMITS.name}
                      </span>
                    </div>
                    <div className="flex w-28 shrink-0 flex-col gap-0.5">
                      <input
                        value={editDraft.price}
                        onChange={(e) => updateEdit("price", e.target.value)}
                        maxLength={SERVICE_LIMITS.price}
                        placeholder="가격"
                        className={`w-full ${inputCls}`}
                      />
                      <span className={`self-end whitespace-nowrap text-[10px] ${cntColor(editDraft.price.length, SERVICE_LIMITS.price)}`}>
                        {editDraft.price.length}/{SERVICE_LIMITS.price}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <input
                      value={editDraft.note}
                      onChange={(e) => updateEdit("note", e.target.value)}
                      maxLength={SERVICE_LIMITS.note}
                      placeholder="메모 (선택)"
                      className={`w-full ${inputCls}`}
                    />
                    <span className={`self-end whitespace-nowrap text-[10px] ${cntColor(editDraft.note.length, SERVICE_LIMITS.note)}`}>
                      {editDraft.note.length}/{SERVICE_LIMITS.note}
                    </span>
                  </div>
                  {Object.values(editErrors)[0] && (
                    <p className="text-xs text-red-500">{Object.values(editErrors)[0]}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={saveEdit}
                      disabled={!editValid}
                      className="rounded-lg bg-foreground px-3 py-1 text-xs font-medium text-white disabled:opacity-40"
                    >
                      저장
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-(--muted)"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">{svc.name}</span>
                    {svc.note && <span className="text-xs text-(--muted)">{svc.note}</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-foreground">{svc.price}</span>
                    <button type="button" onClick={() => startEdit(idx)} className="text-xs text-blue-400 hover:text-blue-600">수정</button>
                    <button type="button" onClick={() => remove(idx)}    className="text-xs text-red-400 hover:text-red-600">삭제</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* 직접 추가 폼 */}
      {atLimit ? (
        <p className="rounded-xl border border-dashed border-gray-200 px-4 py-3 text-center text-xs text-(--muted)">
          🔒 서비스 {limit}개 한도에 도달했습니다.{" "}
          <Link href="/billing" className="font-medium underline underline-offset-2 hover:text-foreground">
            업그레이드
          </Link>
          하면 더 추가할 수 있습니다.
        </p>
      ) : (
        <div className="flex flex-col gap-2 rounded-xl border border-dashed border-gray-200 p-3">
          <p className="text-xs font-medium text-(--muted)">
            직접 추가
            {limit !== undefined && (
              <span className="ml-1 text-gray-400">({services.length}/{limit})</span>
            )}
          </p>
          <div className="flex min-w-0 gap-2">
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <input
                type="text"
                value={addDraft.name}
                onChange={(e) => updateAdd("name", e.target.value)}
                maxLength={SERVICE_LIMITS.name}
                placeholder="서비스명 (예: PT 1회)"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                onKeyDown={(e) => e.key === "Enter" && add()}
              />
              <span className={`self-end whitespace-nowrap text-[10px] ${cntColor(addDraft.name.length, SERVICE_LIMITS.name)}`}>
                {addDraft.name.length}/{SERVICE_LIMITS.name}
              </span>
            </div>
            <div className="flex w-24 shrink-0 flex-col gap-0.5">
              <input
                type="text"
                value={addDraft.price}
                onChange={(e) => updateAdd("price", e.target.value)}
                maxLength={SERVICE_LIMITS.price}
                placeholder="50,000원"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                onKeyDown={(e) => e.key === "Enter" && add()}
              />
              <span className={`self-end whitespace-nowrap text-[10px] ${cntColor(addDraft.price.length, SERVICE_LIMITS.price)}`}>
                {addDraft.price.length}/{SERVICE_LIMITS.price}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <input
              type="text"
              value={addDraft.note}
              onChange={(e) => updateAdd("note", e.target.value)}
              maxLength={SERVICE_LIMITS.note}
              placeholder="메모 (선택)"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
              onKeyDown={(e) => e.key === "Enter" && add()}
            />
            <span className={`self-end whitespace-nowrap text-[10px] ${cntColor(addDraft.note.length, SERVICE_LIMITS.note)}`}>
              {addDraft.note.length}/{SERVICE_LIMITS.note}
            </span>
          </div>
          {Object.values(addErrors)[0] && (
            <p className="text-xs text-red-500">{Object.values(addErrors)[0]}</p>
          )}
          <button
            type="button"
            onClick={add}
            disabled={!addValid}
            className="self-start rounded-lg bg-foreground px-4 py-1.5 text-sm font-medium text-white disabled:opacity-40"
          >
            + 추가
          </button>
        </div>
      )}
    </div>
  );
}
