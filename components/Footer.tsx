type FooterProps = {
  instagramHandle: string;
  footerNote: string;
};

export default function Footer({ instagramHandle, footerNote }: FooterProps) {
  return (
    <footer className="mt-5 px-1 pb-4 text-center text-sm text-[var(--muted)]">
      <p className="font-display text-base font-semibold text-[var(--foreground)]">{instagramHandle}</p>
      <p className="mt-2 leading-6">{footerNote}</p>
    </footer>
  );
}