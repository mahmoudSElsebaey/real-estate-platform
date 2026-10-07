"use client";

import { useLocale } from "next-intl";
import { ArrowUpRight, BriefcaseBusiness, HeartHandshake, Lightbulb, Users, Zap } from "lucide-react";

export default function CareersPage() {
  const locale = useLocale();
  const ar = locale === "ar";
  const jobs = [
    { icon: BriefcaseBusiness, title: ar ? "تطوير الأعمال" : "Business Development", type: ar ? "دوام كامل" : "Full-time" },
    { icon: Zap, title: ar ? "مهندس برمجيات" : "Software Engineer", type: ar ? "دوام كامل" : "Full-time" },
    { icon: Lightbulb, title: ar ? "مصمم منتجات" : "Product Designer", type: ar ? "دوام كامل" : "Full-time" },
  ];

  return (
    <main className="bg-background">
      <section className="relative isolate min-h-[500px] overflow-hidden bg-[hsl(var(--primary-950))]">
        <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2200&q=85" alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
        <div className="mx-auto flex min-h-[500px] max-w-7xl items-end px-4 pb-16 pt-32 sm:px-6 lg:px-8 lg:pb-20">
          <div className="max-w-3xl text-white">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-white/70">{ar ? "انضم إلى عقاركو" : "JOIN AQARCO"}</p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">{ar ? "ابنِ معنا مستقبل العقار." : "Build the future of real estate with us."}</h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">{ar ? "نبحث عن أشخاص لديهم فضول وطموح ويريدون بناء تجربة حقيقية تؤثر في طريقة اكتشاف العقارات." : "We are looking for curious, ambitious people who want to shape how people discover and experience real estate."}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[hsl(var(--primary-600))]">{ar ? "ثقافتنا" : "OUR CULTURE"}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{ar ? "فريق صغير. طموح كبير." : "Small team. Big ambition."}</h2>
            <p className="mt-5 leading-8 text-muted-foreground">{ar ? "نؤمن بالمسؤولية، التعلم المستمر، والعمل الجماعي. كل شخص لديه مساحة ليؤثر ويقترح ويطوّر." : "We value ownership, continuous learning, and collaboration. Everyone gets room to contribute, challenge ideas, and grow."}</p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {[{ icon: Users, t: ar ? "تعاون" : "Collaboration" }, { icon: HeartHandshake, t: ar ? "ثقة" : "Trust" }].map(({icon:Icon,t}) => <div key={t} className="rounded-2xl border border-border bg-card p-5"><Icon className="h-5 w-5 text-[hsl(var(--primary-600))]" /><p className="mt-3 font-medium">{t}</p></div>)}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8">
            <div className="mb-7"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{ar ? "الفرص الحالية" : "OPEN ROLES"}</p><h2 className="mt-2 text-2xl font-semibold">{ar ? "ابحث عن دورك القادم." : "Find your next role."}</h2></div>
            <div className="space-y-3">
              {jobs.map(({icon:Icon,title,type}) => (
                <div key={title} className="group flex items-center gap-4 rounded-2xl border border-border p-5 transition hover:-translate-y-0.5 hover:border-[hsl(var(--primary-300))] hover:shadow-md">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--primary-100))] text-[hsl(var(--primary-600))]"><Icon className="h-5 w-5" /></div>
                  <div className="min-w-0 flex-1"><p className="font-semibold">{title}</p><p className="mt-1 text-sm text-muted-foreground">{type}</p></div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              ))}
            </div>
            <p className="mt-7 rounded-2xl bg-muted/60 p-5 text-sm leading-6 text-muted-foreground">{ar ? "لا ترى الدور المناسب؟ أرسل نبذة عنك عبر صفحة تواصل معنا وسنتواصل عند وجود فرصة مناسبة." : "Don't see the right role? Send us an introduction through the Contact page and we'll reach out when a suitable opportunity opens."}</p>
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              [ar ? "01" : "01", ar ? "امتلك المسؤولية" : "Own your work", ar ? "نثق بك لاتخاذ القرار وتحمل النتيجة." : "Take ownership and make decisions with confidence."],
              [ar ? "02" : "02", ar ? "تعلم باستمرار" : "Keep learning", ar ? "نجرب، نقيس، ونحسن ما نبنيه كل يوم." : "Experiment, measure, and improve what we build."],
              [ar ? "03" : "03", ar ? "اصنع أثرًا" : "Make an impact", ar ? "ركز على ما يضيف قيمة حقيقية للمستخدم." : "Focus on work that creates real user value."],
            ].map(([n,t,d]) => <div key={n} className="rounded-3xl border border-border bg-card p-7"><span className="text-xs font-bold tracking-[0.2em] text-[hsl(var(--primary-600))]">{n}</span><h3 className="mt-8 text-xl font-semibold">{t}</h3><p className="mt-3 leading-7 text-muted-foreground">{d}</p></div>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[hsl(var(--primary-900))] p-8 text-white sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">{ar ? "هل أنت مستعد؟" : "READY TO JOIN?"}</p>
          <div className="mt-3 flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-3xl font-semibold sm:text-4xl">{ar ? "لنصنع شيئًا يستحق أن يُستخدم." : "Let's build something worth using."}</h2>
            <a href={`/${locale}/contact`} className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[hsl(var(--primary-900))] transition hover:-translate-y-0.5">{ar ? "تواصل معنا" : "Get in touch"}<ArrowUpRight className="h-4 w-4" /></a>
          </div>
        </div>
      </section>
    </main>
  );
}
