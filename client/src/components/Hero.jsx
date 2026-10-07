export default function Hero() {
  return (
    <section className="relative bg-ink text-bone overflow-hidden">
      <div className="grid md:grid-cols-2 min-h-[70vh]">
        {/* Text side */}
        <div className="flex flex-col justify-center px-6 md:px-16 py-16 z-10">
          <span className="text-rust font-semibold uppercase tracking-widest text-sm mb-4">
            Heavyweights — Fall / Winter Drop
          </span>
          <h1 className="font-display text-5xl md:text-7xl leading-[0.95] mb-6">
            MADE TO
            <br />
            CARRY WEIGHT
          </h1>
          <p className="text-stone max-w-md mb-8">
            Heavyweight fabrics, considered fits, made to be worn in. The new
            collection is live.
          </p>
          <a
            href="#shop"
            className="inline-block bg-rust text-bone px-8 py-4 font-semibold uppercase tracking-wide text-sm w-fit hover:bg-bone hover:text-ink transition-colors"
          >
            Shop Now
          </a>
        </div>

        {/* Image side, diagonal cut is the signature element */}
        <div
  className="relative bg-ink"
  style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)' }}
>
  <img
    src="/images/campaign-hero.jpg"
    alt="Heavyweights Fall/Winter campaign"
    className="w-full h-full object-contain"
  />
</div>
        </div>
    </section>
  );
}
