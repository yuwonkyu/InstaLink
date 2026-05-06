"use client";

import { useState } from "react";
import Link from "next/link";
import type { Service } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SERVICE_LIMITS,
  serviceFormSchema,
  type ServiceFormInput,
  sanitizeServices,
} from "@/lib/service-validation";

type Props = {
  services: Service[];
  isPaidPlan: boolean;   // Basic 이상 — AI 버튼 표시용 (현재 미사용, isProPlan으로 이전 중)
  isProPlan?: boolean;   // Pro 전용 AI 버튼
  limit?: number;        // 추가 가능한 최대 개수 (undefined = 무제한)
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

  const [editIdx,   setEditIdx]   = useState<number | null>(null);

  const [showTemplates, setShowTemplates] = useState(true);

  const addForm = useForm<ServiceFormInput>({
    resolver: zodResolver(serviceFormSchema),
    mode: "onChange",
    defaultValues: { name: "", price: "", note: "" },
  });

  const editForm = useForm<ServiceFormInput>({
    resolver: zodResolver(serviceFormSchema),
    mode: "onChange",
    defaultValues: { name: "", price: "", note: "" },
  });

  const addNameError = addForm.formState.errors.name?.message;
  const addPriceError = addForm.formState.errors.price?.message;
  const addNoteError = addForm.formState.errors.note?.message;
  const editNameError = editForm.formState.errors.name?.message;
  const editPriceError = editForm.formState.errors.price?.message;
  const editNoteError = editForm.formState.errors.note?.message;

  const [addName, addPrice, addNote] = addForm.watch(["name", "price", "note"]);
  const [editName, editPrice, editNote] = editForm.watch(["name", "price", "note"]);
  const safeAddNote = addNote ?? "";
  const safeEditNote = editNote ?? "";

  function cntColor(len: number, max: number) {
    const r = len / max;
    if (r >= 1) return "text-red-500";
    if (r >= 0.8) return "text-orange-400";
    return "text-(--muted)";
  }

  function add(values: ServiceFormInput) {
    const next = serviceFormSchema.parse(values);
    onChange([...services, next]);
    addForm.reset({ name: "", price: "", note: "" });
  }

  function remove(idx: number) {
    onChange(services.filter((_, i) => i !== idx));
  }

  function startEdit(idx: number) {
    const s = services[idx];
    setEditIdx(idx);
    editForm.reset({ name: s.name, price: s.price, note: s.note ?? "" });
  }

  function saveEdit(values: ServiceFormInput) {
    if (editIdx === null) return;
    const next = serviceFormSchema.parse(values);
    if (!next) return;
    onChange(services.map((s, i) => (i === editIdx ? next : s)));
    setEditIdx(null);
    editForm.reset({ name: "", price: "", note: "" });
  }

  function applyTemplates() {
    onChange(sanitizeServices(templateServices));
    setShowTemplates(false);
  }

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

      {/* 패널 닫혀있을 때 열기 버튼 */}
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
            <li key={idx} className="rounded-xl bg-(--secondary) px-3.5 py-2.5">
              {editIdx === idx ? (
                <form
                  className="flex flex-col gap-2"
                  onSubmit={editForm.handleSubmit(saveEdit)}
                >
                  <div className="flex gap-2">
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <input
                        {...editForm.register("name")}
                        maxLength={SERVICE_LIMITS.name}
                        placeholder="서비스명"
                        className={`w-full ${inputCls}`}
                      />
                      <span className={`self-end whitespace-nowrap text-[10px] ${cntColor(editName.length, SERVICE_LIMITS.name)}`}>
                        {editName.length}/{SERVICE_LIMITS.name}
                      </span>
                    </div>
                    <div className="flex w-28 shrink-0 flex-col gap-0.5">
                      <input
                        {...editForm.register("price")}
                        maxLength={SERVICE_LIMITS.price}
                        placeholder="가격"
                        className={`w-full ${inputCls}`}
                      />
                      <span className={`self-end whitespace-nowrap text-[10px] ${cntColor(editPrice.length, SERVICE_LIMITS.price)}`}>
                        {editPrice.length}/{SERVICE_LIMITS.price}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <input
                      {...editForm.register("note")}
                      maxLength={SERVICE_LIMITS.note}
                      placeholder="메모 (선택)"
                      className={`w-full ${inputCls}`}
                    />
                    <span className={`self-end whitespace-nowrap text-[10px] ${cntColor(safeEditNote.length, SERVICE_LIMITS.note)}`}>
                      {safeEditNote.length}/{SERVICE_LIMITS.note}
                    </span>
                  </div>
                  {(editNameError || editPriceError || editNoteError) && (
                    <p className="text-xs text-red-500">
                      {editNameError ?? editPriceError ?? editNoteError}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={!editForm.formState.isValid}
                      className="rounded-lg bg-foreground px-3 py-1 text-xs font-medium text-white disabled:opacity-40"
                    >
                      저장
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditIdx(null);
                        editForm.reset({ name: "", price: "", note: "" });
                      }}
                      className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-(--muted)"
                    >
                      취소
                    </button>
                  </div>
                </form>
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
        <form
          className="flex flex-col gap-2 rounded-xl border border-dashed border-gray-200 p-3"
          onSubmit={addForm.handleSubmit(add)}
        >
          <p className="text-xs font-medium text-(--muted)">
            직접 추가
            {limit !== undefined && (
              <span className="ml-1 text-gray-400">({services.length}/{limit})</span>
            )}
          </p>
          <div className="flex min-w-0 gap-2">
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <input type="text" {...addForm.register("name")} maxLength={SERVICE_LIMITS.name} placeholder="서비스명 (예: PT 1회)"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15" />
              <span className={`self-end whitespace-nowrap text-[10px] ${cntColor(addName.length, SERVICE_LIMITS.name)}`}>
                {addName.length}/{SERVICE_LIMITS.name}
              </span>
            </div>
            <div className="flex w-24 shrink-0 flex-col gap-0.5">
              <input type="text" {...addForm.register("price")} maxLength={SERVICE_LIMITS.price} placeholder="50,000원"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15" />
              <span className={`self-end whitespace-nowrap text-[10px] ${cntColor(addPrice.length, SERVICE_LIMITS.price)}`}>
                {addPrice.length}/{SERVICE_LIMITS.price}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <input type="text" {...addForm.register("note")} maxLength={SERVICE_LIMITS.note} placeholder="메모 (선택)"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15" />
            <span className={`self-end whitespace-nowrap text-[10px] ${cntColor(safeAddNote.length, SERVICE_LIMITS.note)}`}>
              {safeAddNote.length}/{SERVICE_LIMITS.note}
            </span>
          </div>
          {(addNameError || addPriceError || addNoteError) && (
            <p className="text-xs text-red-500">
              {addNameError ?? addPriceError ?? addNoteError}
            </p>
          )}
          <button type="submit" disabled={!addForm.formState.isValid}
            className="self-start rounded-lg bg-foreground px-4 py-1.5 text-sm font-medium text-white disabled:opacity-40">
            + 추가
          </button>
        </form>
      )}
    </div>
  );
}
