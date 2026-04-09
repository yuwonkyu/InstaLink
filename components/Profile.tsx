type ProfileProps = {
  initials: string;
  name: string;
  role: string;
  intro: string;
  location: string;
  availability: string;
  responseTime: string;
  highlightTags: string[];
};

export default function Profile({
  initials,
  name,
  role,
  intro,
  location,
  availability,
  responseTime,
  highlightTags,
}: ProfileProps) {
  return (
    <section className="rounded-[2rem] border border-[var(--line)] bg-[var(--card)] p-5 shadow-[0_20px_60px_rgba(72,44,18,0.12)] backdrop-blur">
      <div className="flex items-start gap-4">
        <div className="font-display flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#ffb36a,#ff7c38)] text-xl font-bold text-white shadow-[0_12px_30px_rgba(220,91,19,0.28)]">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="mb-2 inline-flex rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold tracking-[0.18em] text-[var(--accent-strong)] uppercase">
            SaveMe PT
          </p>
          <h1 className="font-display text-[1.75rem] font-bold leading-none text-[var(--foreground)]">
            {name}
          </h1>
          <p className="mt-2 text-sm font-medium text-[var(--muted)]">{role}</p>
        </div>
      </div>

      <p className="mt-5 text-sm leading-6 text-[var(--muted)]">{intro}</p>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl border border-[var(--line)] bg-white/70 p-3">
          <p className="text-xs text-[var(--muted)]">위치</p>
          <p className="mt-1 font-semibold text-[var(--foreground)]">{location}</p>
        </div>
        <div className="rounded-2xl border border-[var(--line)] bg-white/70 p-3">
          <p className="text-xs text-[var(--muted)]">운영 시간</p>
          <p className="mt-1 font-semibold text-[var(--foreground)]">{availability}</p>
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-[var(--line)] bg-white/70 p-3 text-sm">
        <p className="text-xs text-[var(--muted)]">응답 속도</p>
        <p className="mt-1 font-semibold text-[var(--foreground)]">{responseTime}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {highlightTags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--foreground)]"
          >
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
}