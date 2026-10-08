"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Search,
  Shield,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
} from "lucide-react";

const USER_ROLES = [
  "buyer",
  "renter",
  "investor",
  "owner",
  "agent",
  "hotel_operator",
  "admin",
] as const;

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  preferredLocale?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const t = useTranslations("AdminUsers");
  const tAuth = useTranslations("Auth");
  const locale = useLocale();
  const router = useRouter();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [active, setActive] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (role) params.set("role", role);
      if (active) params.set("active", active);
      params.set("page", String(page));
      params.set("limit", "20");

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      if (res.status === 401) {
        router.push(`/${locale}/login`);
        return;
      }
      if (res.status === 403) {
        setError(t("forbidden"));
        setUsers([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setUsers(data.users || []);
      setPages(data.pagination?.pages || 1);
      setTotal(data.pagination?.total || 0);
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  }, [q, role, active, page, locale, router, t]);

  useEffect(() => {
    load();
  }, [load]);

  async function patchUser(
    id: string,
    body: Record<string, unknown>
  ): Promise<boolean> {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("updateError"));
        return false;
      }
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, ...data.user } : u))
      );
      return true;
    } catch {
      setError(t("updateError"));
      return false;
    } finally {
      setUpdating(null);
    }
  }

  async function deactivate(id: string) {
    if (!confirm(t("confirmDeactivate"))) return;
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("updateError"));
        return;
      }
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isActive: false } : u))
      );
    } catch {
      setError(t("updateError"));
    } finally {
      setUpdating(null);
    }
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setQ(searchInput.trim());
  }

  return (
    <div className="min-h-[70vh] py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Link href={`/${locale}/dashboard`} className="hover:text-primary">
                {t("backDashboard")}
              </Link>
              <span>/</span>
              <span>{t("title")}</span>
            </div>
            <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tight">
              <Users className="h-7 w-7 text-primary" />
              {t("title")}
            </h1>
            <p className="mt-1 text-muted-foreground">{t("subtitle", { count: total })}</p>
          </div>
          <Link
            href={`/${locale}/admin/properties`}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-card px-4 text-sm font-medium shadow-sm transition hover:bg-muted"
          >
            <Shield className="h-4 w-4" />
            {t("moderationLink")}
          </Link>
        </div>

        <form
          onSubmit={submitSearch}
          className="mb-6 flex flex-col gap-3 rounded-2xl border border-[hsl(var(--border))] bg-card p-4 shadow-sm md:flex-row md:items-center"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="h-11 w-full rounded-xl border border-[hsl(var(--input))] bg-background ps-10 pe-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={role}
            onChange={(e) => {
              setPage(1);
              setRole(e.target.value);
            }}
            className="h-11 rounded-xl border border-[hsl(var(--input))] bg-background px-3 text-sm"
          >
            <option value="">{t("allRoles")}</option>
            {USER_ROLES.map((r) => (
              <option key={r} value={r}>{tAuth(`roles.${r}`)}</option>
            ))}
          </select>
          <select
            value={active}
            onChange={(e) => {
              setPage(1);
              setActive(e.target.value);
            }}
            className="h-11 rounded-xl border border-[hsl(var(--input))] bg-background px-3 text-sm"
          >
            <option value="">{t("allStatus")}</option>
            <option value="true">{t("active")}</option>
            <option value="false">{t("inactive")}</option>
          </select>
          <button
            type="submit"
            className="h-11 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow transition hover:bg-[hsl(var(--primary-600))]"
          >
            {t("search")}
          </button>
        </form>

        {error ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}

        <div className="overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead className="border-b border-[hsl(var(--border))] bg-muted/40">
                <tr className="text-start">
                  <th className="px-4 py-3 font-semibold">{t("colName")}</th>
                  <th className="px-4 py-3 font-semibold">{t("colEmail")}</th>
                  <th className="px-4 py-3 font-semibold">{t("colRole")}</th>
                  <th className="px-4 py-3 font-semibold">{t("colStatus")}</th>
                  <th className="px-4 py-3 font-semibold">{t("colJoined")}</th>
                  <th className="px-4 py-3 font-semibold">{t("colActions")}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">{t("loading")}</td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">{t("empty")}</td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u._id} className="border-t border-[hsl(var(--border))] hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="font-medium">{u.name}</div>
                        {u.phone ? <div className="text-xs text-muted-foreground">{u.phone}</div> : null}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                      <td className="px-4 py-3">
                        <select
                          value={u.role}
                          disabled={updating === u._id}
                          onChange={(e) => patchUser(u._id, { role: e.target.value })}
                          className="h-9 rounded-lg border border-[hsl(var(--input))] bg-background px-2 text-xs"
                        >
                          {USER_ROLES.map((r) => (
                            <option key={r} value={r}>{tAuth(`roles.${r}`)}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          u.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                        }`}>
                          {u.isActive ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
                          {u.isActive ? t("active") : t("inactive")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(u.createdAt).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          {u.isActive ? (
                            <button type="button" disabled={updating === u._id} onClick={() => deactivate(u._id)}
                              className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50">
                              {t("deactivate")}
                            </button>
                          ) : (
                            <button type="button" disabled={updating === u._id} onClick={() => patchUser(u._id, { isActive: true })}
                              className="rounded-lg border border-emerald-200 px-2.5 py-1 text-xs font-medium text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50">
                              {t("activate")}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-[hsl(var(--border))] px-4 py-3">
            <p className="text-xs text-muted-foreground">{t("pageOf", { page, pages, total })}</p>
            <div className="flex gap-2">
              <button type="button" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-[hsl(var(--border))] px-3 text-xs font-medium disabled:opacity-40">
                <ChevronLeft className="h-3.5 w-3.5" />{t("prev")}
              </button>
              <button type="button" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-[hsl(var(--border))] px-3 text-xs font-medium disabled:opacity-40">
                {t("next")}<ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
