import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import FlipukasLogo from '@/components/FlipukasLogo';

const NAV_LINKS = [
  { label: 'Process', href: '#process' },
  { label: 'Creators', href: '#creators' },
];

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 text-black transition-all duration-500 ${
        scrolled
          ? 'border-b border-neutral-200 bg-white/90 py-3 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent py-5'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <a href="#top" className="transition-opacity hover:opacity-70" aria-label="Flipukas home">
          <FlipukasLogo />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-neutral-600 transition-colors hover:text-black"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#start"
          className="group inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
        >
          Start Your Brand
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    </header>
  );
}
