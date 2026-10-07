import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { AccountCTA } from "@/components/home/AccountCTA";
import { DevelopersSwiper } from "@/components/home/DevelopersSwiper";
import Link from "next/link";
import { ArrowRight, Building2, KeyRound, TrendingUp, ShieldCheck, MapPin, Images } from "lucide-react";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ar = locale === "ar";

  const categories = [
    { href: `/${locale}/discover?purpose=sale`, icon: Building2, title: ar ? "شراء عقار" : "Buy a Property", text: ar ? "اكتشف منازل وشقق وفيلات مختارة بعناية." : "Explore curated homes, apartments and villas." },
    { href: `/${locale}/discover?purpose=rent`, icon: KeyRound, title: ar ? "الإيجار" : "Rent a Home", text: ar ? "أماكن مريحة للسكن طويل أو قصير المدى." : "Comfortable spaces for long or short-term living." },
    { href: `/${locale}/discover?purpose=invest`, icon: TrendingUp, title: ar ? "الاستثمار" : "Invest", text: ar ? "فرص عقارية مختارة للنمو وبناء الأصول." : "Selected opportunities built for long-term growth." },
  ];

  const cities = [
    { name: ar ? "القاهرة الجديدة" : "New Cairo", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1000&q=85" },
    { name: ar ? "الشيخ زايد" : "Sheikh Zayed", image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1000&q=85" },
    { name: ar ? "الساحل الشمالي" : "North Coast", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85" },
  ];

  const gallery = [
    { title: "Nile View Residence", location: ar ? "الزمالك، القاهرة" : "Zamalek, Cairo", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=92", size: "lg" },
    { title: "Garden Villa", location: ar ? "القاهرة الجديدة" : "New Cairo", image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=92", size: "sm" },
    { title: "Seafront Chalet", location: ar ? "الساحل الشمالي" : "North Coast", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=92", size: "sm" },
    { title: "Modern Living", location: ar ? "الشيخ زايد" : "Sheikh Zayed", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=92", size: "sm" },
  ];

  const steps = [
    { n: "01", title: ar ? "ابحث بسهولة" : "Search with ease", text: ar ? "حدد المدينة والسعر ونوع العقار." : "Choose location, budget and property type." },
    { n: "02", title: ar ? "قارن واكتشف" : "Compare & discover", text: ar ? "راجع التفاصيل والصور واحفظ المفضلة." : "Review details, photos and save your favorites." },
    { n: "03", title: ar ? "اتخذ قرارك" : "Make your move", text: ar ? "تواصل أو احجز موعدًا مباشرة." : "Contact the owner or request a viewing." },
  ];

  return (
    <>
      <Hero />
      <section className="relative z-10 -mt-10 pb-20 md:-mt-16 md:pb-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><div className="grid gap-4 md:grid-cols-3">
          {categories.map(({ href, icon: Icon, title, text }) => <Link key={href} href={href} className="group rounded-2xl border border-border bg-background/95 p-6 shadow-xl backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-primary/30"><div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div><h2 className="text-xl font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">{ar ? "استكشف" : "Explore"} <ArrowRight className={ar ? "h-4 w-4 rotate-180" : "h-4 w-4"} /></span></Link>)}
        </div></div>
      </section>

      <section className="bg-muted/40 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between gap-6"><div><p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">{ar ? "اختيارات مميزة" : "Curated collection"}</p><h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{ar ? "عقارات تستحق أن تراها" : "Properties worth seeing"}</h2><p className="mt-3 max-w-2xl text-muted-foreground">{ar ? "صور ومساحات ومواقع تساعدك على اتخاذ قرار أفضل." : "Beautiful spaces, useful details and locations that make your next decision easier."}</p></div><Link href={`/${locale}/discover`} className="hidden items-center gap-2 text-sm font-semibold text-primary sm:inline-flex">{ar ? "عرض كل العقارات" : "View all properties"} <ArrowRight className={ar ? "h-4 w-4 rotate-180" : "h-4 w-4"} /></Link></div>
          <div className="grid gap-6 md:grid-cols-3">{[["Nile View Residence","Zamalek, Cairo","$245,000","https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85"],["Garden Villa","New Cairo","$410,000","https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=85"],["Seafront Chalet","North Coast","$185,000","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85"]].map(([title,location,price,image]) => <Link key={title} href={`/${locale}/discover`} className="group overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><div className="relative aspect-[4/3] overflow-hidden"><img src={image} alt={title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /><div className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">{ar ? "مميز" : "Featured"}</div></div><div className="p-5"><p className="text-xl font-semibold">{title}</p><p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{location}</p><div className="mt-5 flex items-center justify-between"><span className="font-semibold text-primary">{price}</span><span className="text-xs text-muted-foreground">{ar ? "3 غرف · 2 حمام" : "3 beds · 2 baths"}</span></div></div></Link>)}</div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-background py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary"><Images className="h-3.5 w-3.5" />{ar ? "معرض مختارات عقارية" : "Property visual gallery"}</div><h2 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">{ar ? "شاهد التفاصيل قبل أن تزور المكان" : "See the spaces before you step inside"}</h2><p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">{ar ? "جولة بصرية مختارة لعقارات مميزة، بصور كبيرة وتفاصيل تجعل كل مساحة أقرب للحقيقة." : "A visual collection of standout properties, presented through immersive photography and carefully framed details."}</p></div><Link href={`/${locale}/discover`} className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary">{ar ? "استكشف المزيد" : "Explore more"} <ArrowRight className={ar ? "h-4 w-4 rotate-180" : "h-4 w-4"} /></Link></div>
          <div className="grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[260px] lg:grid-cols-4">{gallery.map((item,index)=><Link key={`${item.title}-${index}`} href={`/${locale}/discover`} className={`group relative overflow-hidden rounded-[1.75rem] bg-muted shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-2xl ${item.size==="lg"?"sm:col-span-2 sm:row-span-2":""}`}><img src={item.image} alt={item.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent opacity-90" /><div className="absolute inset-x-0 bottom-0 p-5 md:p-6"><p className="text-lg font-semibold text-white md:text-xl">{item.title}</p><div className="mt-1 flex items-center gap-1.5 text-sm text-white/75"><MapPin className="h-3.5 w-3.5" />{item.location}</div></div><span className="absolute end-5 top-5 rounded-full border border-white/20 bg-black/20 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md">{ar ? "عرض العقار" : "View property"}</span></Link>)}</div>
        </div>
      </section>

      <section className="py-20 md:py-28"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]"><div><p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">{ar ? "وجهات مختارة" : "Explore locations"}</p><h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{ar ? "اعثر على المكان المناسب لك" : "Find the right place for your lifestyle"}</h2><p className="mt-4 max-w-xl leading-7 text-muted-foreground">{ar ? "من الحياة الهادئة إلى قلب المدينة والساحل، استكشف مناطق تناسب أهدافك." : "From quiet neighborhoods to city life and the coast, discover locations that match the way you want to live."}</p><Link href={`/${locale}/discover`} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5">{ar ? "استكشف العقارات" : "Explore properties"} <ArrowRight className={ar ? "h-4 w-4 rotate-180" : "h-4 w-4"} /></Link></div><div className="grid grid-cols-2 gap-4 sm:grid-cols-3">{cities.map((city,i)=><Link key={city.name} href={`/${locale}/discover?city=${encodeURIComponent(city.name)}`} className={`group relative overflow-hidden rounded-2xl ${i===1?"sm:mt-10":""}`}><div className="aspect-[3/4]"><img src={city.image} alt={city.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /></div><div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" /><p className="absolute bottom-4 start-4 end-4 text-lg font-semibold text-white">{city.name}</p></Link>)}</div></div></div></section>

      <DevelopersSwiper />

      <section className="bg-[hsl(var(--primary-900))] py-20 text-white md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="mb-12 max-w-2xl"><p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[hsl(var(--accent-400))]">{ar ? "كيف نساعدك" : "How it works"}</p><h2 className="text-3xl font-semibold md:text-4xl">{ar ? "رحلتك العقارية تبدأ بثلاث خطوات" : "Your property journey, simplified"}</h2></div><div className="grid gap-8 md:grid-cols-3">{steps.map((step)=><div key={step.n} className="border-t border-white/15 pt-6"><span className="text-sm font-semibold text-[hsl(var(--accent-400))]">{step.n}</span><h3 className="mt-4 text-xl font-semibold">{step.title}</h3><p className="mt-2 text-sm leading-6 text-white/65">{step.text}</p></div>)}</div><AccountCTA /></div>
      </section>
    </>
  );
}