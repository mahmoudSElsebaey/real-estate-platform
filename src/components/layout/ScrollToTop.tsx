"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { ArrowUp, Sparkles } from "lucide-react";

export function ScrollToTop() {
  const locale = useLocale();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(scrollTop > 420);
      setProgress(maxScroll > 0 ? Math.min(100, (scrollTop / maxScroll) * 100) : 0);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-5 z-[60] flex px-5 sm:bottom-7 sm:px-7 ${locale === "ar" ? "justify-start" : "justify-end"}`}
    >
      <button
        type="button"
        onClick={scrollToTop}
        aria-label={locale === "ar" ? "العودة إلى أعلى الصفحة" : "Back to top"}
        title={locale === "ar" ? "العودة للأعلى" : "Back to top"}
        className={`group pointer-events-auto relative grid h-14 w-14 place-items-center rounded-full border border-white/20 bg-[#102019]/90 text-white shadow-[0_14px_40px_rgba(16,32,25,.28)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:scale-105 hover:bg-[#163127] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent-400))] focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:h-15 sm:w-15 ${visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-6 scale-75 opacity-0"}`}
      >
        <svg
          className="absolute inset-[-3px] h-[calc(100%+6px)] w-[calc(100%+6px)] -rotate-90"
          viewBox="0 0 64 64"
          aria-hidden="true"
        >
          <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/10" />
          <circle
            cx="32"
            cy="32"
            r="29"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="100"
            strokeDashoffset={100 - progress}
            className="text-[hsl(var(--accent-400))] transition-[stroke-dashoffset] duration-150"
          />
        </svg>

        <span className="absolute -top-1 -end-1 grid h-5 w-5 place-items-center rounded-full border border-[#102019] bg-[hsl(var(--accent-400))] text-[#102019] shadow-sm transition-transform duration-300 group-hover:rotate-12">
          <Sparkles className="h-2.5 w-2.5" strokeWidth={2.5} />
        </span>

        <ArrowUp className="relative h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1" strokeWidth={1.8} />
        <span className="sr-only">{locale === "ar" ? "العودة إلى أعلى الصفحة" : "Back to top"}</span>
      </button>
    </div>
  );
}
