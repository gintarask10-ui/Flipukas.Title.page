interface FlipukasLogoProps {
  className?: string;
  showWordmark?: boolean;
}

export default function FlipukasLogo({ className = '', showWordmark = true }: FlipukasLogoProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        viewBox="190 350 400 370"
        aria-hidden="true"
        className={showWordmark ? 'h-10 w-auto' : 'h-8 w-auto'}
        fill="currentColor"
      >
        <path d="M236 357H584L529 428H369V472L306 486C306 440 285 395 236 357Z" />
        <path d="M195 617L262 530C320 500 390 497 508 497L452 566H368C300 566 250 585 195 617Z" />
        <path d="M270 617C320 600 340 590 368 590C370 640 380 680 400 715L270 617Z" />
      </svg>
      {showWordmark && (
        <span className="text-lg font-bold tracking-[0.28em]">FLIPUKS</span>
      )}
    </span>
  );
}
