import type { ReservationItem } from "@/data/mockData";

type ReservationProps = {
  items: ReservationItem[];
};

export default function Reservation({ items }: ReservationProps) {
  return (
    <section className="mt-6 rounded-[2rem] border border-[var(--line)] bg-[#1f1712] p-5 text-white shadow-[0_24px_70px_rgba(31,23,18,0.24)]">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ffb98a]">Reservation</p>
          <h2 className="font-display mt-2 text-xl font-bold">예약 가능한 프로그램</h2>
        </div>
        <p className="text-right text-xs leading-5 text-white/60">상담 후 일정 확정</p>
      </div>

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <a
            key={item.title}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className="block rounded-[1.5rem] border border-white/10 bg-white/6 p-4 transition-colors duration-200 hover:bg-white/10"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm leading-5 text-white/70">{item.description}</p>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                {item.duration}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="font-semibold text-[#ffb98a]">{item.price}</span>
              <span className="text-white/60">예약하기</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}