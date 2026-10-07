"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  propertyId: string;
  className?: string;
  size?: "sm" | "md";
}

export function FavoriteButton({ propertyId, className, size = "md" }: FavoriteButtonProps) {
  const t = useTranslations("Favorites");
  const locale = useLocale();
  const router = useRouter();
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch(`/api/favorites/${propertyId}`);
        const data = await res.json();
        setFavorited(!!data.favorited);
      } catch {}
      finally { setChecked(true); }
    }
    if (propertyId) check();
  }, [propertyId]);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      if (favorited) {
        const res = await fetch(`/api/favorites/${propertyId}`, { method: "DELETE" });
        if (res.status === 401) { router.push(`/${locale}/login`); return; }
        if (res.ok) setFavorited(false);
      } else {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId }),
        });
        if (res.status === 401) { router.push(`/${locale}/login`); return; }
        if (res.ok) setFavorited(true);
      }
    } catch {}
    finally { setLoading(false); }
  }

  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading || !checked}
      aria-label={favorited ? t("remove") : t("add")}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-all",
        size === "sm" ? "w-8 h-8" : "w-10 h-10",
        favorited
          ? "bg-red-50 text-red-500 hover:bg-red-100"
          : "bg-white/90 text-foreground/70 hover:text-red-500 hover:bg-white shadow-sm",
        className
      )}
    >
      <Heart className={cn(iconSize, favorited && "fill-current")} />
    </button>
  );
}
