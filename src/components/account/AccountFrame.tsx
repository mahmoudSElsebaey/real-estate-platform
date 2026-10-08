"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { LayoutDashboard, UserRound, CalendarDays, Heart, MessageSquare, TrendingUp, Building2, ArrowUpRight } from "lucide-react";

const items = [
  { key: "dashboard", href: "dashboard", icon: LayoutDashboard },
  { key: "profile", href: "profile", icon: UserRound },
  { key: "bookings", href: "bookings", icon: CalendarDays },
  { key: "favorites", href: "favorites", icon: Heart },
  { key: "inquiries", href: "inquiries", icon: MessageSquare },
  { key: "investments", href: "investments/my", icon: TrendingUp },
  { key: "listings", href: "listings", icon: Building2 },
];

const labels = {
  ar: { dashboard: "لوحة التحكم", profile: "ملفي", bookings: "حجوزاتي", favorites: "المفضلة", inquiries: "طلباتي", investments: "اهتماماتي", listings: "قوائمي" },
  en: { dashboard: "Dashboard", profile: "Profile", bookings: "Bookings", favorites: "Favorites", inquiries: "My Requests", investments: "My Interests", listings: "My Listings" },
};

export function AccountFrame({ children, title, subtitle, eyebrow = "AQARCO ACCOUNT" }: { children: React.ReactNode; title: string; subtitle?: string; eyebrow?: string }) {
  const locale = useLocale() as "ar" | "en";
  const pathname = usePathname();
  const t = useTranslations("Dashboard");
  const current = pathname.split("/").filter(Boolean).slice(1).join("/");
  const text = labels[locale];
  const [user, setUser] = useState<{ name: string; avatar?: string; role?: string } | null>(null);

  useEffect(() => {
    fetch("/api/user/me").then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        if (data.user) setUser(data.user);
      }
    }).catch(() => {});
  }, [pathname]);

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#f5f7f4]">
      <section className="relative isolate overflow-hidden border-b border-black/5 bg-[#102019] text-white">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(8,18,14,.94),rgba(16,32,25,.68)),url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=85')] bg-cover bg-center" />
        <div className="absolute -end-20 -top-32 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute -start-20 bottom-[-140px] h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-[0.28em] text-white/45">{eyebrow}</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
              {subtitle && <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">{subtitle}</p>}
            </div>
            {user && (
              <Link href={`/${locale}/profile`} className="group flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 backdrop-blur-md transition hover:bg-white/15">
                <div className="h-11 w-11 overflow-hidden rounded-xl border border-white/15 bg-white/10">
                  {user.avatar ? <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" /> : <div className="grid h-full w-full place-items-center text-sm font-semibold">{user.name?.charAt(0).toUpperCase()}</div>}
                </div>
                <div className="pe-2">
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-[11px] text-white/55">{user.role ? t(`roleLabels.${user.role}` as any) || user.role : (locale === "ar" ? "حسابك" : "Your account")}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-white/45 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-7 sm:px-6 lg:grid-cols-[230px_1fr] lg:px-8 lg:py-10">
        <aside className="h-fit rounded-3xl border border-black/5 bg-white/95 p-2 shadow-[0_12px_40px_rgba(16,32,25,.07)] lg:sticky lg:top-28">
          <p className="px-3 pb-2 pt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{locale === "ar" ? "مساحة حسابك" : "YOUR SPACE"}</p>
          <nav className="grid grid-cols-2 gap-1 lg:grid-cols-1">
            {items.map(({ key, href, icon: Icon }) => {
              const active = current === href || (key === "investments" && current.startsWith("investments/my"));
              return <Link key={key} href={`/${locale}/${href}`} className={cn("flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition", active ? "bg-[#102019] text-white shadow-md" : "text-foreground/70 hover:bg-muted hover:text-foreground")}>
                <Icon className="h-4 w-4 shrink-0" />{text[key as keyof typeof text]}
              </Link>;
            })}
          </nav>
        </aside>
        <section className="min-w-0 rounded-[30px] border border-black/5 bg-white p-5 shadow-[0_18px_60px_rgba(16,32,25,.055)] sm:p-7 lg:p-8">{children}</section>
      </div>
    </main>
  );
}
