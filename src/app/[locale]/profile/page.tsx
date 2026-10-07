"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  preferredLocale: string;
  isVerified: boolean;
  createdAt?: string;
}

export default function ProfilePage() {
  const t = useTranslations("Profile");
  const tAuth = useTranslations("Auth");
  const locale = useLocale();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredLocale, setPreferredLocale] = useState("en");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/user/me");
        if (res.status === 401) { router.push(`/${locale}/login`); return; }
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          setName(data.user.name);
          setPhone(data.user.phone || "");
          setPreferredLocale(data.user.preferredLocale || "en");
        }
      } catch { setError("Failed to load profile"); }
      finally { setLoading(false); }
    }
    load();
  }, [locale, router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setMessage(""); setError("");
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone: phone || null, preferredLocale }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Update failed"); setSaving(false); return; }
      setUser(data.user);
      setEditing(false);
      setMessage(t("updated"));
    } catch { setError("Update failed"); }
    finally { setSaving(false); }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push(`/${locale}`);
    router.refresh();
  }

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-muted-foreground">...</p></div>;
  if (!user) return null;

  return (
    <div className="min-h-[70vh] py-12 md:py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{t("title")}</h1>
          <Button variant="outline" size="sm" onClick={handleLogout}>{tAuth("logout")}</Button>
        </div>
        {message && <div className="mb-6 rounded-md bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">{message}</div>}
        {error && <div className="mb-6 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
        <div className="bg-card border border-[hsl(var(--border))] rounded-xl p-6 md:p-8 shadow-sm">
          {!editing ? (
            <div className="space-y-5">
              <div><p className="text-xs text-muted-foreground mb-1">{t("name")}</p><p className="font-medium">{user.name}</p></div>
              <div><p className="text-xs text-muted-foreground mb-1">{t("email")}</p><p className="font-medium">{user.email}</p></div>
              <div><p className="text-xs text-muted-foreground mb-1">{t("phone")}</p><p className="font-medium">{user.phone || "—"}</p></div>
              <div><p className="text-xs text-muted-foreground mb-1">{t("role")}</p><p className="font-medium">{tAuth(`roles.${user.role}` as any) || user.role}</p></div>
              <div><p className="text-xs text-muted-foreground mb-1">{t("locale")}</p><p className="font-medium">{user.preferredLocale === "ar" ? "العربية" : "English"}</p></div>
              {user.createdAt && (
                <div><p className="text-xs text-muted-foreground mb-1">{t("memberSince")}</p>
                <p className="font-medium">{new Date(user.createdAt).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB")}</p></div>
              )}
              <Button onClick={() => setEditing(true)} className="mt-4">{t("edit")}</Button>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-5">
              <div className="space-y-2"><label className="text-sm font-medium">{t("name")}</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} className="w-full h-11 px-3 rounded-md border border-[hsl(var(--input))] bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
              <div className="space-y-2"><label className="text-sm font-medium">{t("phone")}</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full h-11 px-3 rounded-md border border-[hsl(var(--input))] bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
              <div className="space-y-2"><label className="text-sm font-medium">{t("locale")}</label>
                <select value={preferredLocale} onChange={(e) => setPreferredLocale(e.target.value)} className="w-full h-11 px-3 rounded-md border border-[hsl(var(--input))] bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="en">English</option><option value="ar">العربية</option>
                </select></div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={saving}>{saving ? "..." : t("save")}</Button>
                <Button type="button" variant="outline" onClick={() => setEditing(false)}>{t("cancel")}</Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
