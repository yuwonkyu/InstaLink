import Section from "@/components/edit/Section";
import ThemeSelector from "@/components/dashboard/ThemeSelector";
import type { Theme } from "@/lib/types";

export type DesignTabProps = {
  theme: Theme;
  setTheme: (v: Theme) => void;
  plan?: string;
};

export default function DesignTab({ theme, setTheme, plan }: DesignTabProps) {
  return (
    <Section title="테마">
      <div className="mb-3 rounded-xl bg-blue-50 border border-blue-100 px-3.5 py-3">
        <p className="text-xs font-semibold text-blue-800">💡 TIP</p>
        <p className="mt-0.5 text-xs text-blue-700 leading-relaxed">
          테마는 내 업종과 분위기에 맞는 걸 골라보세요. 바꾼 뒤 상단 「저장하고 페이지 공개하기」를 누르고, 「내 페이지 보기」로 실제 결과를 확인해보세요.
        </p>
      </div>
      <ThemeSelector selected={theme} onChange={setTheme} plan={plan} />
    </Section>
  );
}
