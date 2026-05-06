import Link from "next/link";
import Section from "@/components/edit/Section";
import ServiceManager from "@/components/dashboard/ServiceManager";
import LinkManager from "@/components/dashboard/LinkManager";
import BusinessHoursEditor from "@/components/dashboard/BusinessHoursEditor";
import { TEMPLATES } from "@/data/templates";
import type { Service, CustomLink, BusinessHours } from "@/lib/types";

export type ServiceTabProps = {
  services: Service[];          setServices: (v: Service[]) => void;
  servicesLimit?: number;
  invalidServiceIndex?: number | null;
  customLinks: CustomLink[];    setCustomLinks: (v: CustomLink[]) => void;
  businessHours: BusinessHours; setBusinessHours: (v: BusinessHours) => void;
  isPaidPlan: boolean;
  isProPlan: boolean;
  category: string;             setCategory: (v: string) => void;
  aiLoading: string | null;
  onAISuggest: (type: "tagline" | "description" | "services") => void;
};

export default function ServiceTab({
  services, setServices, servicesLimit,
  invalidServiceIndex,
  customLinks, setCustomLinks,
  businessHours, setBusinessHours,
  isPaidPlan, isProPlan,
  category, setCategory,
  aiLoading, onAISuggest,
}: ServiceTabProps) {
  return (
    <>
      {/* ── 서비스 & 가격 ── */}
      <Section title="서비스 &amp; 가격">
        <div className="mb-3 rounded-xl bg-blue-50 border border-blue-100 px-3.5 py-3">
          <p className="text-xs font-semibold text-blue-800">💡 TIP</p>
          <p className="mt-0.5 text-xs text-blue-700 leading-relaxed">
            가격을 미리 보여주면 고객이 문의 전에 스스로 결정해요. 서비스 이름·가격·한 줄 설명만 채워도 충분해요!
          </p>
        </div>
        <ServiceManager
          services={services}
          invalidServiceIndex={invalidServiceIndex}
          isPaidPlan={isPaidPlan}
          isProPlan={isProPlan}
          limit={servicesLimit}
          aiLoading={aiLoading}
          onAISuggest={() => onAISuggest("services")}
          onChange={setServices}
          category={category}
          onCategoryChange={setCategory}
          templateServices={TEMPLATES[category]?.services ?? []}
        />
      </Section>

      {/* ── 추가 링크 ── */}
      <Section title="추가 링크 (선택)">
        <div className="mb-3 rounded-xl bg-blue-50 border border-blue-100 px-3.5 py-3">
          <p className="text-xs font-semibold text-blue-800">💡 TIP</p>
          <p className="mt-0.5 text-xs text-blue-700 leading-relaxed">
            네이버 스마트스토어, 유튜브, 블로그 등 고객에게 추가로 보여주고 싶은 링크를 자유롭게 넣을 수 있어요.
          </p>
        </div>
        <LinkManager links={customLinks} onChange={setCustomLinks} />
      </Section>

      {/* ── 영업일 & 운영시간 ── */}
      {isPaidPlan ? (
        <Section title="영업일 & 운영시간 (Basic+)">
          <div className="mb-3 rounded-xl bg-blue-50 border border-blue-100 px-3.5 py-3">
            <p className="text-xs font-semibold text-blue-800">💡 TIP</p>
            <p className="mt-0.5 text-xs text-blue-700 leading-relaxed">
              요일 버튼을 눌러 영업일을 설정하면 고객 페이지에 시각적으로 표시됩니다.<br />
              기존 &apos;운영시간&apos; 텍스트 입력과 함께 사용할 수 있습니다.
            </p>
          </div>
          <BusinessHoursEditor value={businessHours} onChange={setBusinessHours} />
        </Section>
      ) : (
        <Section title="영업일 & 운영시간">
          <div className="rounded-xl border border-dashed border-gray-200 px-4 py-3 text-center text-xs text-(--muted)">
            🔒 요일별 영업시간 설정은 Basic 이상 플랜에서 사용 가능합니다.{" "}
            <Link href="/billing" className="font-medium underline underline-offset-2 hover:text-foreground">
              업그레이드
            </Link>
          </div>
        </Section>
      )}
    </>
  );
}
