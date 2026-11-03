import FlipukasLogo from '@/components/FlipukasLogo';

const FOOTER_LINKS = [
  { label: 'Process', href: '#process' },
  { label: 'Creators', href: '#creators' },
  { label: 'Start Your Brand', href: '#start' },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 pt-16 pb-10 text-black">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <FlipukasLogo />
            <p className="mt-5 text-base leading-[1.5] text-neutral-600">
              Flipukas Atelier is the Brand-as-a-Service platform that helps creators launch their own clothing
              brands from A to Z.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-4">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">Explore</p>
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-base text-neutral-800 transition-colors hover:text-black hover:underline underline-offset-4"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-neutral-200 pt-8 text-sm text-neutral-600 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Flipukas Atelier. All rights reserved.</p>
          <p>Build your brand. Own your story.</p>
        </div>
      </div>
    </footer>
  );
}
