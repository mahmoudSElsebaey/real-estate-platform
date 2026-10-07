"use client";

import { FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import brandConfig from "@/config/brand.config";
import { ArrowUpRight, Clock3, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";

export default function ContactPage() {
  const t = useTranslations("Pages.contact");
  const locale = useLocale();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const address = locale === "ar" ? brandConfig.contact.address.ar : brandConfig.contact.address.en;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  const contactItems = [
    { icon: Mail, label: t("emailLabel"), value: brandConfig.contact.email, href: `mailto:${brandConfig.contact.email}` },
    { icon: Phone, label: t("phoneLabel"), value: brandConfig.contact.phone, href: `tel:${brandConfig.contact.phone.replace(/\\s/g, "")}` },
    { icon: MapPin, label: t("addressLabel"), value: address, href: "https://maps.google.com/?q=Cairo,Egypt" },
  ];

  return (
    <main className="bg-background">
      <section className="relative isolate min-h-[520px] overflow-hidden bg-[hsl(var(--primary-950))]">
        <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2200&q=85" alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
        <div className="absolute inset-0 -z-10 bg-[hsl(var(--primary-950)/.25)]" />
        <div className="mx-auto flex min-h-[520px] max-w-7xl items-end px-4 pb-16 pt-32 sm:px-6 lg:px-8 lg:pb-20">
          <div className="max-w-3xl text-white">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-white/70">{t("eyebrow")}</p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">{t("title")}</h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">{t("subtitle")}</p>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-12 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-3xl border border-border bg-card shadow-2xl md:grid-cols-3">
          {contactItems.map(({ icon: Icon, label, value, href }, index) => (
            <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}
              className={`group flex min-h-36 items-center gap-5 p-7 transition-colors hover:bg-[hsl(var(--primary-50))] ${index > 0 ? "border-t md:border-l md:border-t-0" : ""}`}>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[hsl(var(--primary-100))] text-[hsl(var(--primary-600))] transition-transform group-hover:scale-105"><Icon className="h-5 w-5" /></span>
              <span className="min-w-0"><span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span><span className="mt-1 block truncate text-sm font-medium text-foreground">{value}</span></span>
              <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[hsl(var(--primary-600))]">{t("formEyebrow")}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{t("formTitle")}</h2>
            <p className="mt-5 max-w-lg leading-7 text-muted-foreground">{t("formDescription")}</p>
            <div className="mt-8 space-y-4">
              <div className="flex gap-4 rounded-2xl border border-border bg-card p-5"><MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(var(--primary-600))]" /><div><p className="font-medium">{t("responseTitle")}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{t("responseText")}</p></div></div>
              <div className="flex gap-4 rounded-2xl border border-border bg-card p-5"><Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(var(--primary-600))]" /><div><p className="font-medium">{t("hoursTitle")}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{t("hoursText")}</p></div></div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-8 lg:p-10">
            {sent ? (
              <div className="flex min-h-[440px] flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--primary-100))] text-[hsl(var(--primary-600))]"><Send className="h-7 w-7" /></div>
                <h2 className="mt-6 text-2xl font-semibold">{t("successTitle")}</h2>
                <p className="mt-3 max-w-md leading-7 text-muted-foreground">{t("successMessage")}</p>
                <button type="button" onClick={() => setSent(false)} className="mt-8 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition hover:bg-muted">{t("sendAnother")}</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="space-y-2"><span className="text-sm font-medium">{t("name")}</span><input required value={name} onChange={(e) => setName(e.target.value)} placeholder={t("namePlaceholder")} className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none transition focus:border-[hsl(var(--primary-500))] focus:ring-4 focus:ring-[hsl(var(--primary-100))]" /></label>
                  <label className="space-y-2"><span className="text-sm font-medium">{t("email")}</span><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("emailPlaceholder")} className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none transition focus:border-[hsl(var(--primary-500))] focus:ring-4 focus:ring-[hsl(var(--primary-100))]" /></label>
                </div>
                <label className="space-y-2"><span className="text-sm font-medium">{t("subject")}</span><input required placeholder={t("subjectPlaceholder")} className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none transition focus:border-[hsl(var(--primary-500))] focus:ring-4 focus:ring-[hsl(var(--primary-100))]" /></label>
                <label className="space-y-2"><span className="text-sm font-medium">{t("message")}</span><textarea required rows={7} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t("messagePlaceholder")} className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm leading-6 outline-none transition focus:border-[hsl(var(--primary-500))] focus:ring-4 focus:ring-[hsl(var(--primary-100))]" /></label>
                <button type="submit" className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[hsl(var(--primary-600))] px-6 text-sm font-semibold text-white shadow-lg shadow-[hsl(var(--primary-900)/.18)] transition hover:-translate-y-0.5 hover:bg-[hsl(var(--primary-700))]">{t("submit")}<Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
          <div><p className="text-sm font-semibold uppercase tracking-[0.22em] text-[hsl(var(--primary-600))]">{t("locationEyebrow")}</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">{t("locationTitle")}</h2><p className="mt-3 text-muted-foreground">{address}</p></div>
          <a href="https://maps.google.com/?q=Cairo,Egypt" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">{t("openMap")}<ArrowUpRight className="h-4 w-4" /></a>
        </div>
      </section>
    </main>
  );
}
