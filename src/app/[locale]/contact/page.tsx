"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import brandConfig from "@/config/brand.config";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  const t = useTranslations("Pages.contact");
  const locale = useLocale();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  const inputClass =
    "w-full h-11 px-3 rounded-md border border-[hsl(var(--input))] bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="min-h-[70vh] py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">{t("title")}</h1>
        <p className="text-muted-foreground mb-10 max-w-2xl">{t("subtitle")}</p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex gap-3">
              <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">{t("emailLabel")}</p>
                <a href={`mailto:${brandConfig.contact.email}`} className="text-sm text-muted-foreground hover:text-primary">{brandConfig.contact.email}</a>
              </div>
            </div>
            <div className="flex gap-3">
              <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">{t("phoneLabel")}</p>
                <a href={`tel:${brandConfig.contact.phone.replace(/\s/g, "")}`} className="text-sm text-muted-foreground hover:text-primary">{brandConfig.contact.phone}</a>
              </div>
            </div>
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">{t("addressLabel")}</p>
                <p className="text-sm text-muted-foreground">{locale === "ar" ? brandConfig.contact.address.ar : brandConfig.contact.address.en}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {sent ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
                <p className="font-medium text-emerald-800 mb-1">{t("successTitle")}</p>
                <p className="text-sm text-emerald-700">{t("successMessage")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-xl border border-[hsl(var(--border))] bg-card p-6 md:p-8 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">{t("name")}</label>
                  <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">{t("email")}</label>
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">{t("message")}</label>
                  <textarea required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full px-3 py-2 rounded-md border border-[hsl(var(--input))] bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y" />
                </div>
                <button type="submit" className="h-11 px-6 rounded-md bg-primary text-primary-foreground text-sm font-medium shadow hover:bg-[hsl(var(--primary-600))] transition-colors">{t("submit")}</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
