"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Sparkles } from "lucide-react";

export function AccountCTA() {
  const locale = useLocale();
  const ar = locale === "ar";
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/user/me").then((r) => setIsLoggedIn(r.ok)).catch(() => setIsLoggedIn(false));
  }, []);

  if (isLoggedIn) return null;

  return (
    <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur sm:flex-row sm:items-center">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10"><Sparkles className="h-5 w-5 text-[hsl(var(--accent-400))]" /></div>
        <div>
          <h3 className="font-semibold">{ar ? "تجربة موثوقة وواضحة" : "A clearer, more confident experience"}</h3>
          <p className="mt-1 text-sm text-white/60">{ar ? "احفظ العقارات، قارن بينها وتواصل مع أصحابها من مكان واحد." : "Save properties, compare options and connect with owners from one place."}</p>
        </div>
      </div>
      <Link href={`/${locale}/register`} className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[hsl(var(--primary-900))] transition hover:bg-white/90">
        {ar ? "أنشئ حسابك" : "Create your account"} <Sparkles className="h-4 w-4" />
      </Link>
    </div>
  );
}