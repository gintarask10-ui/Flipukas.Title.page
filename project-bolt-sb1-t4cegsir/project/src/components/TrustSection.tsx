import { Check, Quote } from 'lucide-react';

const POINTS = [
  'Your brand identity, store and campaigns handled by one team',
  'Transparent production with quality checks before every shipment',
  'Tracked delivery to your customers, wherever they are',
];

const TESTIMONIALS = [
  {
    quote:
      'I had the audience but no idea how to turn it into a product line. Flipukas took my concept from sketch to a live store in weeks.',
    name: 'Lifestyle creator',
    detail: 'Streetwear and everyday essentials',
  },
  {
    quote:
      'Production and shipping used to eat all my time. Now I focus on content and new drops while the orders keep flowing.',
    name: 'Fitness influencer',
    detail: 'Activewear collection',
  },
  {
    quote:
      'The brand looked premium from day one. My community noticed the difference immediately and the first drop sold out.',
    name: 'Music artist',
    detail: 'Merch and limited runs',
  },
];

export default function TrustSection() {
  return (
    <section id="creators" className="border-t border-neutral-200 bg-neutral-50 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="relative lg:col-span-5">
            <div className="aspect-[4/5] overflow-hidden rounded-3xl border border-neutral-200 bg-white">
              <img
                src="https://images.pexels.com/photos/12432852/pexels-photo-12432852.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Creator reviewing a white shirt with a ring light"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">Built for creators</p>
            <h2 className="mt-4 text-4xl font-bold leading-[1.2] tracking-tight text-black sm:text-5xl">
              You bring the audience. We build the brand behind it.
            </h2>

            <ul className="mt-10 space-y-5">
              {POINTS.map((point) => (
                <li key={point} className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-white">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-lg leading-[1.5] text-neutral-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <figure
              key={item.name}
              className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-black hover:shadow-xl"
            >
              <Quote className="h-8 w-8 text-black" aria-hidden="true" />
              <blockquote className="mt-6 flex-1 text-lg leading-[1.5] text-neutral-800">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-8 border-t border-neutral-200 pt-6">
                <p className="font-medium text-black">{item.name}</p>
                <p className="text-sm text-neutral-600">{item.detail}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
