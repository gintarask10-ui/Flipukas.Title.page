import { ArrowRight } from 'lucide-react';
import BrandSignupForm from '@/components/BrandSignupForm';

const SERVICES = [
  'Visual identity',
  'Online store',
  'Creative campaigns',
  'Manufacturing',
  'Global fulfillment',
];

function ServicesTicker() {
  const items = [...SERVICES, ...SERVICES];
  return (
    <div className="overflow-hidden border-y border-neutral-200 bg-neutral-50 py-5">
      <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap">
        {items.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center gap-10 text-lg font-medium text-neutral-600">
            {item}
            <span className="h-1.5 w-1.5 rounded-full bg-black" aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section id="top" className="relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-neutral-100 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <p className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-sm text-neutral-800">
            <span className="h-1.5 w-1.5 rounded-full bg-black" aria-hidden="true" />
            Brand-as-a-Service for creators
          </p>

          <h1 className="animate-fade-up mt-6 text-5xl font-bold leading-[1.1] tracking-tight text-black [animation-delay:100ms] sm:text-6xl lg:text-7xl">
            Build Your Clothing Brand <span className="underline decoration-black decoration-4 underline-offset-8">From A to Z</span>
          </h1>

          <p className="animate-fade-up mt-6 max-w-xl text-lg leading-[1.5] text-neutral-600 [animation-delay:200ms]">
            Full-stack infrastructure for creators and influencers: design, online store, marketing,
            manufacturing and fulfillment, all in one place so you can focus on your audience.
          </p>

          <a
            href="#process"
            className="animate-fade-up group mt-10 inline-flex items-center gap-2 text-base font-medium text-black transition-colors hover:text-neutral-600 [animation-delay:300ms]"
          >
            See how the five steps work
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        <div className="animate-fade-up relative lg:col-span-5 [animation-delay:250ms]">
          <BrandSignupForm />
        </div>
      </div>

      <div className="mt-24 md:mt-32">
        <ServicesTicker />
      </div>
    </section>
  );
}
