import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getSession();
  if (!session) redirect(`/${locale}/login`);

  let userName = session.name;
  let userRole = session.role;
  try {
    await connectDB();
    const user = await User.findById(session.userId).select("name role");
    if (user) { userName = user.name; userRole = user.role; }
  } catch {}

  const t = await getTranslations("Dashboard");
  const tAuth = await getTranslations("Auth");
  const roleLabel = tAuth(`roles.${userRole}` as any) || userRole;

  const actions = [
    { href: `/${locale}/profile`, label: t("profile"), show: true },
    { href: `/${locale}/favorites`, label: t("favorites"), show: true },
    { href: `/${locale}/bookings`, label: t("bookings"), show: true },
    { href: `/${locale}/bookings/inbox`, label: t("bookingsInbox"), show: ["owner", "agent", "hotel_operator", "admin"].includes(userRole) },
    { href: `/${locale}/inquiries`, label: t("inquiries"), show: true },
    { href: `/${locale}/inbox`, label: t("inbox"), show: ["owner", "agent", "hotel_operator", "admin"].includes(userRole) },
    { href: `/${locale}/admin/properties`, label: t("moderation"), show: userRole === "admin" },
    { href: `/${locale}/listings`, label: t("listings"), show: ["owner", "agent", "hotel_operator", "admin"].includes(userRole) },
    { href: `/${locale}/investments`, label: t("investments"), show: ["investor", "admin"].includes(userRole) },
  ].filter((a) => a.show);

  return (
    <div className="min-h-[70vh] py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">{t("welcome", { name: userName })}</h1>
          <p className="text-muted-foreground">{t("role")}: <span className="font-medium text-foreground">{roleLabel}</span></p>
        </div>
        <section>
          <h2 className="text-lg font-semibold mb-4">{t("quickActions")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {actions.map((action) => (
              <Link key={action.href} href={action.href} className="group flex items-center gap-3 rounded-xl border border-[hsl(var(--border))] bg-card p-5 transition-all hover:shadow-md hover:border-[hsl(var(--primary-300))]">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </div>
                <span className="font-medium">{action.label}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
