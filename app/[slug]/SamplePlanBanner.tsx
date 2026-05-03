import type { PlanKey } from "@/lib/plan-limits";

const PLAN_CONFIG: Record<
  PlanKey,
  { label: string; emoji: string; bg: string; text: string; border: string; features: string[] }
> = {
  free: {
    label: "Free",
    emoji: "🆓",
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-200",
    features: ["서비스 3개", "후기 3개", "기본 테마"],
  },
  basic: {
    label: "Basic",
    emoji: "⭐",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    features: ["서비스 6개", "후기 6개", "갤러리 6장", "테마 3종"],
  },
  pro: {
    label: "Pro",
    emoji: "🚀",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    features: ["서비스 무제한", "후기 무제한", "갤러리 15장", "테마 전체"],
  },
};

export default function SamplePlanBanner({ plan }: { plan: PlanKey }) {
  const cfg = PLAN_CONFIG[plan];

  return (
    <div
      className={`mb-3 flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 ${cfg.bg} ${cfg.border}`}
    >
      <span className="text-base leading-none">{cfg.emoji}</span>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-0.5">
        <span className={`text-xs font-bold ${cfg.text}`}>
          {cfg.label} 플랜 적용 샘플
        </span>
        <span className="text-[11px] text-gray-400">·</span>
        <span className="text-[11px] text-gray-500">
          {cfg.features.join(" · ")}
        </span>
      </div>
    </div>
  );
}
