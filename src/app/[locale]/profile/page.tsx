"use client";

import { useEffect, useState } from "react";
import { AccountFrame } from "@/components/account/AccountFrame";
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
  avatar?: string;
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
        if (res.status === 401) {
          router.push(`/${locale}/login`);
          return;
        }
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          setName(data.user.name);
          setPhone(data.user.phone || "");
          setPreferredLocale(data.user.preferredLocale || "en");
        }
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [locale, router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone: phone || null, preferredLocale }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Update failed");
        setSaving(false);
        return;
      }

      setUser(data.user);
      setEditing(false);
      setMessage(t("updated"));
    } catch {
      setError("Update failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push(`/${locale}`);
    router.refresh();
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <AccountFrame title={t("title")} eyebrow="AQARCO / PROFILE">
      <div>
        {message && (
          <div className="mb-6 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6 overflow-hidden rounded-[28px] border border-border bg-[#102019] text-white shadow-lg">
          <div className="relative p-6 sm:p-8">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "linear-gradient(90deg,rgba(16,32,25,.95),rgba(16,32,25,.68)),url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85)",
              }}
            />

            <div className="relative flex items-center gap-4">
              <div className="h-20 w-20 overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-xl">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center text-2xl font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-white/50">
                  {locale === "ar" ? "ملفك العقاري" : "YOUR PROPERTY PROFILE"}
                </p>
                <h2 className="mt-1 text-2xl font-semibold">{user.name}</h2>
                <p className="mt-1 text-sm text-white/60">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-border bg-card p-6 shadow-sm md:p-8">
          {!editing ? (
            <div className="space-y-5">
              <div><p className="mb-1 text-xs text-muted-foreground">{t("name")}</p><p className="font-medium">{user.name}</p></div>
              <div><p className="mb-1 text-xs text-muted-foreground">{t("email")}</p><p className="font-medium">{user.email}</p></div>
              <div><p className="mb-1 text-xs text-muted-foreground">{t("phone")}</p><p className="font-medium">{user.phone || "—"}</p></div>
              <div><p className="mb-1 text-xs text-muted-foreground">{t("role")}</p><p className="font-medium">{tAuth(`roles.${user.role}` as any) || user.role}</p></div>
              <div><p className="mb-1 text-xs text-muted-foreground">{t("locale")}</p><p className="font-medium">{user.preferredLocale === "ar" ? "العربية" : "English"}</p></div>
              {user.createdAt && (
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">{t("memberSince")}</p>
                  <p className="font-medium">{new Date(user.createdAt).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB")}</p>
                </div>
              )}

              <Button onClick={() => setEditing(true)} className="mt-4">{t("edit")}</Button>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("name")}</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} className="h-11 w-full rounded-md border border-[hsl(var(--input))] bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t("phone")}</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11 w-full rounded-md border border-[hsl(var(--input))] bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t("locale")}</label>
                <select value={preferredLocale} onChange={(e) => setPreferredLocale(e.target.value)} className="h-11 w-full rounded-md border border-[hsl(var(--input))] bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="en">English</option>
                  <option value="ar">العربية</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={saving}>{saving ? "..." : t("save")}</Button>
                <Button type="button" variant="outline" onClick={() => setEditing(false)}>{t("cancel")}</Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AccountFrame>
  );
}
