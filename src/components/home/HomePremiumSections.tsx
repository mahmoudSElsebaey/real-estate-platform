"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Building2, CheckCircle2, MapPin, Sparkles, TrendingUp } from "lucide-react";

const locations = [
  { name: { en: "New Cairo", ar: "القاهرة الجديدة" }, count: "240+", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=88" },
  { name: { en: "Sheikh Zayed", ar: "الشيخ زايد" }, count: "180+", image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=88" },
  { name: { en: "North Coast", ar: "الساحل الشمالي" }, count: "120+", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=88" },
];

const features = [
  { en: "Verified properties", ar: "عقارات موثوقة", icon: CheckCircle2 },
  { en: "Smart discovery", ar: "اكتشاف ذكي", icon: Sparkles },
  { en: "Trusted professionals", ar: "خبراء موثوقون", icon: Building2 },
  { en: "Secure conversations", ar: "تواصل آمن", icon: MapPin },
];

export function HomePremiumSections({ locale }: { locale: string }) {
  const ar = locale === "ar";
  const reduce = useReducedMotion();
  const href = (path: string) => "/" + locale + "/" + path;

  return (
    <>
      <section className="relative overflow-hidden bg-[#f4f1eb] py-24 md:py-32">
        <div className="absolute -start-32 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: .7 }} className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[.25em] text-primary">{ar ? "وجهات مختارة" : "Curated destinations"}</p>
              <h2 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">{ar ? "المكان المناسب يغيّر كل شيء" : "The right location changes everything."}</h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">{ar ? "اكتشف مناطق مختارة بعناية، من الحياة الراقية في المدينة إلى الشواطئ الهادئة." : "Explore high-demand neighborhoods, from refined city living to effortless coastal escapes."}</p>
            </div>
            <Link href={href("discover")} className="inline-flex items-center gap-2 text-sm font-bold text-primary">{ar ? "كل المناطق" : "View all areas"}<ArrowUpRight className={ar ? "h-4 w-4 -rotate-90" : "h-4 w-4"} /></Link>
          </motion.div>
          <div className="grid gap-5 md:grid-cols-3">
            {locations.map((location, i) => (
              <motion.div key={location.name.en} initial={{ opacity: 0, y: 45 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: .65, delay: i * .1 }} whileHover={reduce ? undefined : { y: -10 }}>
                <Link href={href("discover?city=" + encodeURIComponent(location.name[ar ? "ar" : "en"]))} className="group relative block aspect-[4/5] overflow-hidden rounded-[2rem] shadow-xl">
                  <motion.img src={location.image} alt={location.name.en} className="absolute inset-0 h-full w-full object-cover" whileHover={reduce ? undefined : { scale: 1.08 }} transition={{ duration: .8 }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-white">
                    <div><div className="mb-2 flex items-center gap-1.5 text-xs text-white/70"><MapPin className="h-3.5 w-3.5" />{ar ? "مصر" : "Egypt"}</div><h3 className="text-2xl font-semibold">{location.name[ar ? "ar" : "en"]}</h3><p className="mt-1 text-sm text-white/70">{location.count} {ar ? "عقار متاح" : "properties available"}</p></div>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-md transition group-hover:bg-white group-hover:text-slate-950"><ArrowUpRight className="h-5 w-5" /></span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-950 py-24 text-white md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(180,150,80,.18),transparent_30%),radial-gradient(circle_at_85%_80%,rgba(255,255,255,.07),transparent_25%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:px-8">
          <motion.div initial={{ opacity: 0, x: ar ? 35 : -35 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: .8 }}>
            <p className="mb-3 text-xs font-bold uppercase tracking-[.25em] text-amber-300">{ar ? "تجربة عقارية مختلفة" : "A better property experience"}</p>
            <h2 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl">{ar ? "أقل ضوضاء. أكثر ثقة. قرارات أفضل." : "Less noise. More confidence. Better decisions."}</h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/65 md:text-lg">{ar ? "صممنا التجربة لتصل للمعلومة المهمة بسرعة، وتنتقل من الاكتشاف إلى التواصل بدون تعقيد." : "Every interaction is designed to move you from discovery to a confident decision without the usual friction."}</p>
            <div className="mt-9 grid grid-cols-2 gap-3">
              {features.map(({ en, ar: arText, icon: Icon }) => <div key={en} className="rounded-2xl border border-white/10 bg-white/[.045] p-4 backdrop-blur-sm"><Icon className="mb-7 h-5 w-5 text-amber-300" /><p className="text-sm font-semibold">{ar ? arText : en}</p></div>)}
            </div>
          </motion.div>
          <div className="relative min-h-[480px] [perspective:1400px]">
            <motion.div initial={{ opacity: 0, rotateY: ar ? -18 : 18, y: 50 }} whileInView={{ opacity: 1, rotateY: 0, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 1 }} whileHover={reduce ? undefined : { rotateY: ar ? 5 : -5, rotateX: 3 }} className="absolute end-4 top-4 w-[82%] overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-2 shadow-2xl shadow-black/50 backdrop-blur-md" style={{ transformStyle: "preserve-3d" }}>
              <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=90" alt="Premium property" className="aspect-[4/3] w-full rounded-[1.5rem] object-cover" />
              <div className="flex items-center justify-between p-5"><div><p className="text-xs text-white/50">{ar ? "عقار مختار" : "Curated property"}</p><p className="mt-1 font-semibold">{ar ? "إطلالة النيل" : "Nile View Residence"}</p></div><span className="rounded-full bg-amber-300 px-3 py-1 text-xs font-bold text-slate-950">{ar ? "موثوق" : "Verified"}</span></div>
            </motion.div>
            <motion.div animate={reduce ? undefined : { y: [0, -12, 0], rotate: [0, 1.5, 0] }} transition={reduce ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-12 start-2 rounded-2xl border border-white/15 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-xl" style={{ transform: "translateZ(80px)" }}><p className="text-xs text-white/50">{ar ? "بحث ذكي" : "Smart discovery"}</p><p className="mt-2 text-2xl font-semibold">24/7</p><p className="mt-1 text-xs text-white/60">{ar ? "اكتشف في أي وقت" : "Find what fits you"}</p></motion.div>
            <div className="absolute -bottom-6 end-8 h-28 w-28 rounded-full bg-amber-300/20 blur-2xl" />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#111a16] py-24 text-white md:py-32">
        <div className="absolute -end-32 -top-32 h-96 w-96 rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: .8 }} className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-3 shadow-2xl">
              <motion.img src="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1500&q=90" alt="Investment property" className="aspect-[4/3] w-full rounded-[2rem] object-cover" whileHover={reduce ? undefined : { scale: 1.04 }} transition={{ duration: .8 }} />
              <div className="absolute bottom-7 start-7 rounded-2xl border border-white/15 bg-black/45 px-5 py-4 backdrop-blur-xl"><p className="text-xs text-white/60">{ar ? "فرص مختارة" : "Curated opportunities"}</p><p className="mt-1 font-semibold">{ar ? "سكني · تجاري · ضيافة" : "Residential · Commercial · Hospitality"}</p></div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: ar ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: .8 }}>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200/15 bg-emerald-200/5 px-4 py-2 text-xs font-bold uppercase tracking-[.2em] text-emerald-200"><TrendingUp className="h-4 w-4" />{ar ? "استثمر بذكاء" : "Invest with intent"}</div>
              <h2 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl">{ar ? "ابنِ مستقبلك من أصل عقاري حقيقي." : "Build your future around real property."}</h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/65 md:text-lg">{ar ? "استكشف فرصاً منتقاة بعناية، وعبّر عن اهتمامك مباشرة، وتواصل مع المالك لاتخاذ الخطوة التالية." : "Explore curated opportunities, express interest directly, and start a conversation with the owner when the right opportunity appears."}</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {(ar ? ["سكني", "تجاري", "ضيافة"] : ["Residential", "Commercial", "Hospitality"]).map((item, i) => <div key={item} className="rounded-2xl border border-white/10 bg-white/[.045] p-4"><span className="text-xs text-emerald-200">0{i + 1}</span><p className="mt-6 text-sm font-semibold">{item}</p></div>)}
              </div>
              <Link href={href("investments")} className="mt-9 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:-translate-y-1 hover:bg-emerald-100">{ar ? "استكشف فرص الاستثمار" : "Explore investment opportunities"}<ArrowUpRight className={ar ? "h-4 w-4 -rotate-90" : "h-4 w-4"} /></Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
