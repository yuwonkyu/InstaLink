"use client";

import { useState } from "react";
import type { DragEvent } from "react";

/**
 * 네이티브 HTML5 드래그앤드롭으로 리스트 순서를 바꾸는 공용 훅.
 * (패키지 추가 없이 데스크탑 마우스 드래그 지원 — 모바일은 ↑↓ 버튼 폴백 유지)
 *
 * 사용:
 *   const { dragIdx, overIdx, dragProps } = useDragReorder(list, onChange);
 *   <li {...dragProps(idx)} className={overIdx === idx ? "ring-2" : ""}>
 */
export function useDragReorder<T>(list: T[], onChange: (next: T[]) => void) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  function reset() {
    setDragIdx(null);
    setOverIdx(null);
  }

  function dragProps(idx: number) {
    return {
      draggable: true,
      onDragStart: (e: DragEvent) => {
        setDragIdx(idx);
        e.dataTransfer.effectAllowed = "move";
      },
      onDragOver: (e: DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (overIdx !== idx) setOverIdx(idx);
      },
      onDrop: (e: DragEvent) => {
        e.preventDefault();
        if (dragIdx !== null && dragIdx !== idx) {
          const next = [...list];
          const [moved] = next.splice(dragIdx, 1);
          next.splice(idx, 0, moved);
          onChange(next);
        }
        reset();
      },
      onDragEnd: reset,
    };
  }

  return { dragIdx, overIdx, dragProps };
}
