"use client";

import { useLocale } from "next-intl";
import { ArrowUpRight, Building2, Compass, Handshake, ShieldCheck, Sparkles, Target } from "lucide-react";
import brandConfig from "@/config/brand.config";

export default function AboutPage() {
  const locale = useLocale();
  const ar = locale === "ar";

  const values = [
    { icon: ShieldCheck, title: ar ? "الثقة أولاً" : "Trust first", text: ar ? "معلومات واضحة، قوائم موثوقة وتجربة مصممة للقرار بثقة." : "Clear information, trusted listings, and an experience built for confident decisions." },
    { icon: Compass, title: ar ? "اكتشاف أفضل" : "Better discovery", text: ar ? "نساعدك على الوصول للمكان المناسب بدل إغراقك بخيارات بلا نهاية." : "We help you find the right place without overwhelming you with endless options." },
    { icon: Handshake, title: ar ? "علاقات طويلة" : "Long-term relationships", text: ar ? "نبني تجربة تخدم المشترين والمستأجرين والملاك والمستثمرين." : "We build an experience that serves buyers, renters, owners, and investors." },
  ];

  return (
    <main className="bg-background">
      <section className="relative isolate min-h-[540px] overflow-hidden bg-[hsl(var(--primary-950))]">
        <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=85" alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/55 to-black/15" />
        <div className="mx-auto flex min-h-[540px] max-w-7xl items-end px-4 pb-16 pt-32 sm:px-6 lg:px-8 lg:pb-20">
          <div className="max-w-3xl text-white">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-white/70">{brandConfig.shortName}</p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">{ar ? "نحن عقاركو" : "We are Aqarco"}</h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">{ar ? "منصة حديثة تجمع بين العقارات المميزة، الضيافة، وفرص الاستثمار في تجربة واحدة واضحة." : "A modern platform connecting exceptional real estate, hospitality, and investment opportunities in one clear experience."}</p>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-12 max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-0 overflow-hidden rounded-3xl border border-border bg-card shadow-2xl md:grid-cols-3">
          {[{ icon: Building2, n: "01", t: ar ? "العقار" : "Real estate" }, { icon: Sparkles, n: "02", t: ar ? "الضيافة" : "Hospitality" }, { icon: Target, n: "03", t: ar ? "الاستثمار" : "Investment" }].map(({ icon: Icon, n, t }, i) => (
            <div key={n} className={`p-8 sm:p-10 ${i ? "border-t md:border-l md:border-t-0" : ""}`}>
              <span className="text-xs font-semibold tracking-[0.2em] text-[hsl(var(--primary-600))]">{n}</span>
              <Icon className="mt-10 h-7 w-7 text-foreground" />
              <h2 className="mt-5 text-xl font-semibold">{t}</h2>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-14 px-4 pb-24 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8 lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[hsl(var(--primary-600))]">{ar ? "قصتنا" : "OUR STORY"}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{ar ? "نُبسط رحلة البحث عن المكان المناسب." : "We make finding the right place feel simple."}</h2>
          <p className="mt-6 leading-8 text-muted-foreground">{ar ? "صُممت عقاركو لتجمع البحث، المقارنة، التواصل، الحجز والاستثمار في تجربة عصرية واحدة. هدفنا أن تكون كل خطوة مفهومة وأن تصل إلى قرارك بشكل أسرع." : "Aqarco brings discovery, comparison, communication, booking, and investment into one modern experience. Our goal is to make every step understandable and help you reach your decision faster."}</p>
        </div>
        <div className="relative overflow-hidden rounded-3xl">
          <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85" alt="" className="aspect-[4/3] w-full object-cover transition duration-700 hover:scale-105" />
          <div className="absolute bottom-5 start-5 rounded-2xl border border-white/20 bg-black/50 px-5 py-4 text-white backdrop-blur-md">
            <p className="text-xs uppercase tracking-wider text-white/60">{ar ? "رؤيتنا" : "OUR VISION"}</p>
            <p className="mt-1 font-medium">{ar ? "عيش أفضل. استثمار أذكى." : "Live better. Invest smarter."}</p>
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[hsl(var(--primary-600))]">{ar ? "ما يميزنا" : "WHAT WE STAND FOR"}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{ar ? "تجربة مبنية على مبادئ واضحة." : "An experience built on clear principles."}</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {values.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-3xl border border-border bg-card p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[hsl(var(--primary-100))] text-[hsl(var(--primary-600))]"><Icon className="h-5 w-5" /></div>
                <h3 className="mt-6 text-xl font-semibold">{title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-[hsl(var(--primary-900))] p-8 text-white sm:p-12 lg:p-14">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">{ar ? "ابدأ رحلتك" : "START YOUR JOURNEY"}</p><h2 className="mt-3 text-3xl font-semibold sm:text-4xl">{ar ? "مكانك يبدأ من هنا." : "Find your place with Aqarco."}</h2></div>
            <a href={`/${locale}/discover`} className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[hsl(var(--primary-900))] transition hover:-translate-y-0.5">{ar ? "اكتشف العقارات" : "Explore properties"}<ArrowUpRight className="h-4 w-4" /></a>
          </div>
        </div>
      </section>
    </main>
  );
}
