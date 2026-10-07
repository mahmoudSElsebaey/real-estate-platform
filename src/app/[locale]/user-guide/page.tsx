import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  Bookmark,
  Building2,
  CalendarDays,
  GitCompare,
  Search,
  UserRound,
} from "lucide-react";

export const metadata: Metadata = {
  title: "User Guide | Aqarco",
  description: "A simple guide to discovering, comparing, contacting, and booking properties on Aqarco.",
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function UserGuidePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const ar = locale === "ar";

  const steps = [
    {
      number: "01",
      icon: Search,
      title: ar ? "اكتشف العقارات" : "Discover properties",
      text: ar
        ? "استخدم البحث والفلاتر حسب المدينة والغرض والنوع والسعر."
        : "Use search and filters by city, purpose, property type, and price.",
    },
    {
      number: "02",
      icon: Bookmark,
      title: ar ? "احفظ المفضلة" : "Save favorites",
      text: ar
        ? "احتفظ بالعقارات التي تهمك للرجوع إليها لاحقًا."
        : "Keep properties you like in one place for later.",
    },
    {
      number: "03",
      icon: GitCompare,
      title: ar ? "قارن الخيارات" : "Compare options",
      text: ar
        ? "قارن حتى أربع عقارات على أهم التفاصيل."
        : "Compare up to four properties across key details.",
    },
    {
      number: "04",
      icon: CalendarDays,
      title: ar ? "تواصل أو احجز" : "Contact or book",
      text: ar
        ? "أرسل استفسارًا أو اطلب معاينة أو حجزًا عندما تكون الخدمة متاحة."
        : "Send an inquiry, viewing request, or booking when available.",
    },
  ];

  return (
    <main>
      <section className="relative isolate overflow-hidden bg-[hsl(var(--primary-950))]">
        <img
          src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=2200&q=85"
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />
        <div className="mx-auto flex min-h-[500px] max-w-7xl items-end px-4 pb-20 pt-32 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">
              Aqarco / {ar ? "الدليل" : "USER GUIDE"}
            </p>
            <h1 className="mt-5 text-4xl font-semibold sm:text-5xl lg:text-6xl">
              {ar ? "استخدم عقاركو بطريقتك." : "Make the most of Aqarco."}
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/70">
              {ar
                ? "خطوات بسيطة من البحث إلى المقارنة والتواصل والحجز."
                : "A simple path from discovery to comparison, contact, and booking."}
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-12 max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-3xl border bg-card shadow-2xl md:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ number, icon: Icon, title, text }, index) => (
            <article
              key={number}
              className={`p-7 sm:p-8 ${
                index ? "border-t lg:border-s lg:border-t-0" : ""
              }`}
            >
              <span className="text-xs font-semibold tracking-[0.2em] text-[hsl(var(--primary-600))]">
                {number}
              </span>
              <Icon className="mt-9 h-6 w-6" />
              <h2 className="mt-5 text-lg font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-muted/40 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[hsl(var(--primary-600))]">
                {ar ? "حسابك" : "YOUR ACCOUNT"}
              </p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
                {ar
                  ? "تجربتك تصبح أفضل عند تسجيل الدخول."
                  : "Your experience gets better when you sign in."}
              </h2>
              <p className="mt-5 leading-8 text-muted-foreground">
                {ar
                  ? "الوصول إلى المفضلة والمقارنة والحجوزات والاستفسارات وإدارة القوائم يعتمد على نوع حسابك."
                  : "Access to favorites, comparisons, bookings, inquiries, and listing management depends on your account role."}
              </p>
            </div>

            <div className="rounded-3xl border bg-card p-8 shadow-sm">
              <UserRound className="h-6 w-6 text-[hsl(var(--primary-600))]" />
              <h3 className="mt-5 text-xl font-semibold">
                {ar ? "اختر ما يناسبك" : "Choose what fits you"}
              </h3>
              <p className="mt-3 leading-7 text-muted-foreground">
                {ar
                  ? "أنشئ حسابًا كمشتري أو مستأجر أو مستثمر أو مالك أو وكيل."
                  : "Create an account as a buyer, renter, investor, owner, or agent."}
              </p>
              <a
                href={`/${locale}/register`}
                className="mt-6 inline-flex items-center gap-2 font-semibold text-[hsl(var(--primary-600))]"
              >
                {ar ? "إنشاء حساب" : "Create an account"}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[hsl(var(--primary-900))] p-8 text-white sm:p-12">
          <Building2 className="h-6 w-6 text-white/70" />
          <h2 className="mt-5 text-3xl font-semibold">
            {ar ? "جاهز للبدء؟" : "Ready to start?"}
          </h2>
          <a
            href={`/${locale}/discover`}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[hsl(var(--primary-900))]"
          >
            {ar ? "اكتشف العقارات" : "Discover properties"}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </a>
        </div>
      </section>
    </main>
  );
}
