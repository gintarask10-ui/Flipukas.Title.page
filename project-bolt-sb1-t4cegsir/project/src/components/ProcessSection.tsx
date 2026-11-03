interface ProcessStep {
  number: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

const STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Create Your Brand',
    description: 'Visual identity and concepts, from name and logo to the core collection direction.',
    image: 'https://images.pexels.com/photos/7147720/pexels-photo-7147720.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageAlt: 'Designer sketching clothing concepts on a tablet',
  },
  {
    number: '02',
    title: 'Build Your Online Store',
    description: 'A professional e-commerce setup with product pages, checkout and payments ready to sell.',
    image: 'https://images.pexels.com/photos/7667442/pexels-photo-7667442.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageAlt: 'Person choosing t-shirts in an online store on a laptop',
  },
  {
    number: '03',
    title: 'Promote Your Brand',
    description: 'Marketing and creative campaigns that put your drops in front of your audience.',
    image: 'https://images.pexels.com/photos/6953836/pexels-photo-6953836.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageAlt: 'Smartphone on a tripod recording content for social media',
  },
  {
    number: '04',
    title: 'Manufacturing & Order Coordination',
    description: 'Sourcing and production partners, with quality checks and order tracking along the way.',
    image: 'https://images.pexels.com/photos/31090812/pexels-photo-31090812.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageAlt: 'Workers operating sewing machines in a textile factory',
  },
  {
    number: '05',
    title: 'Fulfillment & Logistics',
    description: 'Global shipping and tracking, so every order reaches your customers on time.',
    image: 'https://images.pexels.com/photos/6169055/pexels-photo-6169055.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    imageAlt: 'Cardboard shipping boxes stacked on a dolly outside a warehouse',
  },
];

export default function ProcessSection() {
  return (
    <section id="process" className="relative border-t border-neutral-200 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">The process</p>
          <h2 className="mt-4 text-4xl font-bold leading-[1.2] tracking-tight text-black sm:text-5xl">
            From first idea to doorstep in five steps
          </h2>
          <p className="mt-5 text-lg leading-[1.5] text-neutral-600">
            One partner for everything between your concept and your customer&apos;s parcel.
          </p>
        </div>

        <ol className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-5 lg:gap-4">
          {STEPS.map((step) => (
            <li
              key={step.number}
              className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-black hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                <img
                  src={step.image}
                  alt={step.imageAlt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-black px-3 py-1 font-mono text-xs font-medium text-white">
                  Step {step.number}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-bold leading-[1.2] text-black">{step.title}</h3>
                <p className="mt-3 text-base leading-[1.5] text-neutral-600">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
