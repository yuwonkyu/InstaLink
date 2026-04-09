import type { MenuLink } from "@/data/mockData";

type MenuProps = {
  links: MenuLink[];
};

export default function Menu({ links }: MenuProps) {
  return (
    <section className="mt-4">
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="font-display text-lg font-bold text-[var(--foreground)]">빠른 링크</h2>
        <span className="text-xs font-medium text-[var(--muted)]">모바일 우선</span>
      </div>

      <div className="space-y-3">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-between rounded-[1.5rem] border border-[var(--line)] bg-white/80 px-4 py-4 shadow-[0_12px_30px_rgba(44,24,13,0.06)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            <div>
              <p className="text-base font-semibold text-[var(--foreground)]">{link.label}</p>
              <p className="mt-1 text-sm leading-5 text-[var(--muted)]">{link.description}</p>
            </div>
            <span className="font-display ml-4 text-lg font-bold text-[var(--accent-strong)]">
              +
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}