"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { ArrowLeft, ArrowRight, Building2 } from "lucide-react";

const developers = [
  { name: "Emaar Misr", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=90" },
  { name: "Talaat Moustafa Group", image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1000&q=90" },
  { name: "Palm Hills Developments", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=90" },
  { name: "SODIC", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=90" },
  { name: "Mountain View", image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1000&q=90" },
  { name: "ORA Developers", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=90" },
  { name: "Hassan Allam Properties", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=90" },
  { name: "Misr Italia Properties", image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1000&q=90" },
  { name: "Hyde Park Developments", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=90" },
  { name: "Madinet Masr", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=90" },
];

export function DevelopersSwiper() {
  const locale = useLocale();
  const ar = locale === "ar";
  const viewportRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const visible = 3;
  const maxIndex = Math.max(0, developers.length - visible);

  const move = (direction: number) => {
    const next = Math.min(maxIndex, Math.max(0, index + direction));
    setIndex(next);
    viewportRef.current?.children[next]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => {
        const next = current >= maxIndex ? 0 : current + 1;
        viewportRef.current?.children[next]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
        return next;
      });
    }, 4000);
    return () => window.clearInterval(timer);
  }, [maxIndex]);

  return (
    <section className="overflow-hidden bg-[hsl(var(--primary-50))] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-5">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[hsl(var(--primary-500))]">
              <Building2 className="h-4 w-4" />
              {ar ? "أبرز المطورين" : "Leading developers"}
            </div>
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">{ar ? "وجهات من أكبر الشركات العقارية" : "Explore leading real estate developers"}</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">{ar ? "تصفح مجموعة مختارة من أبرز المطورين العقاريين في السوق." : "Discover destinations from some of the most recognized real estate developers."}</p>
          </div>
          <div className="hidden gap-2 sm:flex" dir="ltr">
            <button onClick={() => move(-1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md" aria-label="Previous"><ArrowLeft className="h-4 w-4" /></button>
            <button onClick={() => move(1)} className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md" aria-label="Next"><ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>

        <div ref={viewportRef} className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {developers.map((developer) => (
            <article key={developer.name} className="group relative min-w-[82%] snap-start overflow-hidden rounded-[1.75rem] bg-black shadow-lg sm:min-w-[48%] lg:min-w-[calc((100%-2.5rem)/3)]">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={developer.image} alt={developer.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                <p className="text-xl font-semibold text-white">{developer.name}</p>
                <p className="mt-1 text-sm text-white/70">{ar ? "استكشف الوجهات والمشروعات" : "Explore destinations & projects"}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}