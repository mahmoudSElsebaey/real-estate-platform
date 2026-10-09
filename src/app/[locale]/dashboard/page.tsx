"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2, CalendarDays, Heart, Inbox, LayoutDashboard, MessageSquare,
  Shield, TrendingUp, Users, Wallet, FileText, Clock, CheckCircle2,
  AlertCircle, ArrowUpRight, UserCircle, Home, Sparkles,
} from "lucide-react";

type StatsPayload = {
  role: string;
  stats: Record<string, number>;
  charts?: { usersByRole?: Record<string, number>; propertiesByStatus?: Record<string, number> };
  recent?: { inquiries?: any[]; bookings?: any[]; favorites?: any[] };
};

function StatCard({ label, value, icon: Icon, tone = "primary", href, hint }:
  { label: string; value: number | string; icon: React.ComponentType<{ className?: string }>; tone?: "primary" | "accent" | "success" | "warning" | "muted"; href?: string; hint?: string }) {
  const tones: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-[hsl(var(--accent-500))]/15 text-[hsl(var(--accent-600))]",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    muted: "bg-muted text-muted-foreground",
  };
  const inner = (
    <div className="group relative overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-card p-5 shadow-sm transition hover:shadow-md hover:border-[hsl(var(--primary-300))]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
          {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {href ? <ArrowUpRight className="absolute end-3 top-3 h-4 w-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" /> : null}
    </div>
  );
  return href ? <Link href={href} className="block">{inner}</Link> : inner;
}

function ActionCard({ href, label, description, icon: Icon }: { href: string; label: string; description?: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <Link href={href} className="group flex items-start gap-3 rounded-2xl border border-[hsl(var(--border))] bg-card p-4 transition hover:border-[hsl(var(--primary-300))] hover:shadow-md">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="font-medium leading-tight">{label}</p>
        {description ? <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{description}</p> : null}
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const tAuth = useTranslations("Auth");
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [data, setData] = useState<StatsPayload | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [meRes, statsRes] = await Promise.all([fetch("/api/user/me"), fetch("/api/dashboard/stats")]);
      if (meRes.status === 401 || statsRes.status === 401) { router.push(`/${locale}/login`); return; }
      const me = await meRes.json();
      if (me.user) { setUserName(me.user.name); setUserRole(me.user.role); }
      const stats = await statsRes.json();
      if (!statsRes.ok) throw new Error(stats.error || "Failed");
      setData(stats);
      if (stats.role) setUserRole(stats.role);
    } catch { setError(t("error")); }
    finally { setLoading(false); }
  }, [locale, router, t]);

  useEffect(() => { load(); }, [load]);

  const role = data?.role || userRole;
  const stats = data?.stats || {};
  const roleLabel = tAuth(`roles.${role}` as any) || role;
  const isAdmin = role === "admin";
  const isProvider = ["owner", "agent", "hotel_operator"].includes(role);
  const isInvestor = role === "investor";

  const actions = [
    { href: `/${locale}/profile`, label: t("profile"), description: t("actions.profileDesc"), icon: UserCircle, show: true },
    { href: `/${locale}/favorites`, label: t("favorites"), description: t("actions.favoritesDesc"), icon: Heart, show: true },
    { href: `/${locale}/bookings`, label: t("bookings"), description: t("actions.bookingsDesc"), icon: CalendarDays, show: true },
    { href: `/${locale}/bookings/inbox`, label: t("bookingsInbox"), description: t("actions.bookingsInboxDesc"), icon: Inbox, show: isProvider || isAdmin },
    { href: `/${locale}/inquiries`, label: t("inquiries"), description: t("actions.inquiriesDesc"), icon: MessageSquare, show: true },
    { href: `/${locale}/inbox`, label: t("inbox"), description: t("actions.inboxDesc"), icon: Inbox, show: isProvider || isAdmin },
    { href: `/${locale}/listings`, label: t("listings"), description: t("actions.listingsDesc"), icon: Building2, show: isProvider || isAdmin },
    { href: `/${locale}/listings/new`, label: t("addListing"), description: t("actions.addListingDesc"), icon: Home, show: isProvider || isAdmin },
    { href: `/${locale}/investments`, label: t("investments"), description: t("actions.investmentsDesc"), icon: TrendingUp, show: true },
    { href: `/${locale}/investments/my`, label: t("myInterests"), description: t("actions.myInterestsDesc"), icon: Wallet, show: true },
    { href: `/${locale}/investments/inbox`, label: t("investmentsInbox"), description: t("actions.investmentsInboxDesc"), icon: FileText, show: isProvider || isAdmin },
    { href: `/${locale}/admin/properties`, label: t("moderation"), description: t("actions.moderationDesc"), icon: Shield, show: isAdmin },
    { href: `/${locale}/admin/manage-properties`, label: t("manageProperties"), description: t("actions.managePropertiesDesc"), icon: Building2, show: isAdmin },
    { href: `/${locale}/admin/users`, label: t("users"), description: t("actions.usersDesc"), icon: Users, show: isAdmin },
    { href: `/${locale}/discover`, label: t("browse"), description: t("actions.browseDesc"), icon: Sparkles, show: true },
  ].filter((a) => a.show);

  function titleOf(item: any) {
    const title = item?.property?.title || item?.title;
    if (!title) return "—";
    return locale === "ar" ? title.ar || title.en : title.en || title.ar;
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <LayoutDashboard className="mx-auto h-8 w-8 animate-pulse text-primary" />
          <p className="mt-3 text-sm text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-[hsl(var(--primary-50))]/40 to-background py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
              <LayoutDashboard className="h-3.5 w-3.5 text-primary" />{t("title")}
            </div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{t("welcome", { name: userName || "—" })}</h1>
            <p className="mt-2 text-muted-foreground">{t("role")}:{" "}
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary">{roleLabel}</span>
            </p>
          </div>
          <button type="button" onClick={load} className="inline-flex h-10 items-center justify-center rounded-xl border border-[hsl(var(--border))] bg-card px-4 text-sm font-medium shadow-sm transition hover:bg-muted">{t("refresh")}</button>
        </div>

        {error ? <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold">{t("overview")}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {isAdmin && (<>
              <StatCard label={t("stats.usersTotal")} value={stats.usersTotal ?? 0} icon={Users} tone="primary" href={`/${locale}/admin/users`} />
              <StatCard label={t("stats.propertiesTotal")} value={stats.propertiesTotal ?? 0} icon={Building2} tone="accent" href={`/${locale}/admin/manage-properties`} />
              <StatCard label={t("stats.pendingReview")} value={stats.pendingProperties ?? 0} icon={Clock} tone="warning" href={`/${locale}/admin/properties`} hint={t("stats.needsAttention")} />
              <StatCard label={t("stats.published")} value={stats.publishedProperties ?? 0} icon={CheckCircle2} tone="success" />
              <StatCard label={t("stats.newInquiries")} value={stats.inquiriesNew ?? 0} icon={MessageSquare} tone="primary" href={`/${locale}/inbox`} />
              <StatCard label={t("stats.pendingBookings")} value={stats.bookingsPending ?? 0} icon={CalendarDays} tone="warning" href={`/${locale}/bookings/inbox`} />
              <StatCard label={t("stats.newInterests")} value={stats.interestsNew ?? 0} icon={TrendingUp} tone="accent" href={`/${locale}/investments/inbox`} />
              <StatCard label={t("stats.activeUsers")} value={stats.usersActive ?? 0} icon={Users} tone="success" href={`/${locale}/admin/users`} />
            </>)}
            {isProvider && !isAdmin && (<>
              <StatCard label={t("stats.myListings")} value={stats.listingsTotal ?? 0} icon={Building2} tone="primary" href={`/${locale}/listings`} />
              <StatCard label={t("stats.published")} value={stats.listingsPublished ?? 0} icon={CheckCircle2} tone="success" href={`/${locale}/listings`} />
              <StatCard label={t("stats.pendingReview")} value={stats.listingsPending ?? 0} icon={Clock} tone="warning" />
              <StatCard label={t("stats.drafts")} value={stats.listingsDraft ?? 0} icon={FileText} tone="muted" />
              <StatCard label={t("stats.inboxInquiries")} value={stats.inboxInquiries ?? 0} icon={MessageSquare} tone="primary" href={`/${locale}/inbox`} hint={stats.inboxInquiriesNew ? t("stats.newCount", { count: stats.inboxInquiriesNew }) : undefined} />
              <StatCard label={t("stats.inboxBookings")} value={stats.inboxBookings ?? 0} icon={CalendarDays} tone="accent" href={`/${locale}/bookings/inbox`} hint={stats.inboxBookingsPending ? t("stats.pendingCount", { count: stats.inboxBookingsPending }) : undefined} />
              <StatCard label={t("stats.inboxInterests")} value={stats.inboxInterests ?? 0} icon={TrendingUp} tone="success" href={`/${locale}/investments/inbox`} />
              <StatCard label={t("stats.savedByUsers")} value={stats.favoritesOnMine ?? 0} icon={Heart} tone="warning" />
            </>)}
            {!isAdmin && !isProvider && (<>
              <StatCard label={t("stats.favorites")} value={stats.favorites ?? 0} icon={Heart} tone="primary" href={`/${locale}/favorites`} />
              <StatCard label={t("stats.myBookings")} value={stats.myBookings ?? 0} icon={CalendarDays} tone="accent" href={`/${locale}/bookings`} hint={stats.myBookingsPending ? t("stats.pendingCount", { count: stats.myBookingsPending }) : undefined} />
              <StatCard label={t("stats.myInquiries")} value={stats.myInquiries ?? 0} icon={MessageSquare} tone="success" href={`/${locale}/inquiries`} />
              <StatCard label={t("stats.myInterests")} value={stats.myInterests ?? 0} icon={Wallet} tone="warning" href={`/${locale}/investments/my`} />
            </>)}
          </div>
        </section>

        {isAdmin && data?.charts && (
          <section className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-[hsl(var(--border))] bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t("charts.usersByRole")}</h3>
              <div className="space-y-3">
                {Object.entries(data.charts.usersByRole || {}).map(([r, count]) => (
                  <div key={r} className="flex items-center justify-between gap-3">
                    <span className="text-sm">{tAuth(`roles.${r}` as any) || r}</span>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-semibold tabular-nums text-primary">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-[hsl(var(--border))] bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t("charts.propertiesByStatus")}</h3>
              <div className="space-y-3">
                {Object.entries(data.charts.propertiesByStatus || {}).map(([s, count]) => (
                  <div key={s} className="flex items-center justify-between gap-3">
                    <span className="text-sm capitalize">{s}</span>
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-sm font-semibold tabular-nums">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {isProvider && data?.recent && (
          <section className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-[hsl(var(--border))] bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between"><h3 className="font-semibold">{t("recent.inquiries")}</h3>
                <Link href={`/${locale}/inbox`} className="text-xs font-medium text-primary hover:underline">{t("viewAll")}</Link></div>
              <div className="space-y-3">
                {(data.recent.inquiries || []).length === 0 ? <p className="text-sm text-muted-foreground">{t("empty")}</p> :
                  data.recent.inquiries!.map((item: any) => (
                    <div key={item._id} className="flex items-start justify-between gap-3 rounded-xl border border-[hsl(var(--border))] px-3 py-2.5">
                      <div className="min-w-0"><p className="truncate text-sm font-medium">{titleOf(item)}</p>
                        <p className="truncate text-xs text-muted-foreground">{item.name || item.email}</p></div>
                      <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">{item.status}</span>
                    </div>
                  ))}
              </div>
            </div>
            <div className="rounded-2xl border border-[hsl(var(--border))] bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between"><h3 className="font-semibold">{t("recent.bookings")}</h3>
                <Link href={`/${locale}/bookings/inbox`} className="text-xs font-medium text-primary hover:underline">{t("viewAll")}</Link></div>
              <div className="space-y-3">
                {(data.recent.bookings || []).length === 0 ? <p className="text-sm text-muted-foreground">{t("empty")}</p> :
                  data.recent.bookings!.map((item: any) => (
                    <div key={item._id} className="flex items-start justify-between gap-3 rounded-xl border border-[hsl(var(--border))] px-3 py-2.5">
                      <div className="min-w-0"><p className="truncate text-sm font-medium">{titleOf(item)}</p>
                        <p className="truncate text-xs text-muted-foreground">{item.user?.name || item.user?.email || "—"}</p></div>
                      <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">{item.status}</span>
                    </div>
                  ))}
              </div>
            </div>
          </section>
        )}

        {!isAdmin && !isProvider && data?.recent && (
          <section className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-[hsl(var(--border))] bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between"><h3 className="font-semibold">{t("recent.bookings")}</h3>
                <Link href={`/${locale}/bookings`} className="text-xs font-medium text-primary hover:underline">{t("viewAll")}</Link></div>
              <div className="space-y-3">
                {(data.recent.bookings || []).length === 0 ? <p className="text-sm text-muted-foreground">{t("empty")}</p> :
                  data.recent.bookings!.map((item: any) => (
                    <div key={item._id} className="flex items-start justify-between gap-3 rounded-xl border border-[hsl(var(--border))] px-3 py-2.5">
                      <div className="min-w-0"><p className="truncate text-sm font-medium">{titleOf(item)}</p>
                        <p className="text-xs text-muted-foreground">{item.checkIn ? new Date(item.checkIn).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB") : "—"}</p></div>
                      <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">{item.status}</span>
                    </div>
                  ))}
              </div>
            </div>
            <div className="rounded-2xl border border-[hsl(var(--border))] bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between"><h3 className="font-semibold">{t("recent.favorites")}</h3>
                <Link href={`/${locale}/favorites`} className="text-xs font-medium text-primary hover:underline">{t("viewAll")}</Link></div>
              <div className="space-y-3">
                {(data.recent.favorites || []).length === 0 ? <p className="text-sm text-muted-foreground">{t("empty")}</p> :
                  data.recent.favorites!.map((item: any) => (
                    <div key={item._id} className="flex items-start justify-between gap-3 rounded-xl border border-[hsl(var(--border))] px-3 py-2.5">
                      <div className="min-w-0"><p className="truncate text-sm font-medium">{titleOf(item)}</p>
                        <p className="text-xs text-muted-foreground">{item.property?.location?.city || "—"}</p></div>
                      <Heart className="h-4 w-4 shrink-0 text-primary" />
                    </div>
                  ))}
              </div>
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-4 text-lg font-semibold">{t("quickActions")}</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {actions.map((action) => <ActionCard key={action.href} {...action} />)}
          </div>
        </section>

        {isInvestor && (
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-[hsl(var(--accent-500))]/30 bg-[hsl(var(--accent-500))]/10 p-5">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(var(--accent-600))]" />
            <div>
              <p className="font-medium">{t("investorTipTitle")}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t("investorTipBody")}</p>
              <Link href={`/${locale}/investments`} className="mt-2 inline-flex text-sm font-medium text-primary hover:underline">{t("browseOpportunities")} →</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
