export function TrustedBy() {
  const logos = [
    "Delhi Public School",
    "St. Xavier's Academy",
    "Kendriya Vidyalaya",
    "Ryan International",
    "Amity International",
  ];

  return (
    <section className="py-12 border-y border-white/5 bg-slate-950 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-8">
          Trusted by leading educational institutions
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 transition-all duration-500">
          {logos.map((logo, index) => (
            <div key={index} className="text-lg md:text-xl font-bold text-slate-300">
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
