"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { CalendarDays, CheckCircle2, Clock3, Mail, MapPin, Phone, ShieldCheck, Sparkles, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { InquiryForm } from "@/components/properties/InquiryForm";

interface PropertyInquiryModalProps {
  open: boolean;
  type: "info" | "visit";
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyImage?: string;
  priceLabel: string;
  onClose: () => void;
}

export function PropertyInquiryModal({
  open,
  type,
  propertyId,
  propertyTitle,
  propertyLocation,
  propertyImage,
  priceLabel,
  onClose,
}: PropertyInquiryModalProps) {
  const t = useTranslations("PropertyDetail");
  const locale = useLocale();
  const isVisit = type === "visit";

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-slate-950/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="property-inquiry-title"
            initial={{ opacity: 0, y: 45, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-[2rem] border border-white/10 bg-background shadow-[0_30px_100px_rgba(0,0,0,0.35)] sm:rounded-[2rem] md:flex-row"
            dir={locale === "ar" ? "rtl" : "ltr"}
          >
            <div className="relative hidden min-h-[620px] w-[38%] overflow-hidden md:block">
              {propertyImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={propertyImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary/80 to-slate-950" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-slate-950/10" />

              <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] backdrop-blur-xl">
                  <Sparkles className="h-3.5 w-3.5" />
                  {locale === "ar" ? "تجربة عقارية راقية" : "Premium property experience"}
                </div>
                <h3 className="text-2xl font-semibold leading-tight">{propertyTitle}</h3>
                <div className="mt-3 flex items-start gap-2 text-sm text-white/75">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{propertyLocation}</span>
                </div>
                <p className="mt-5 text-xl font-semibold">{priceLabel}</p>

                <div className="mt-7 grid grid-cols-2 gap-2">
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-xl">
                    <Clock3 className="mb-2 h-4 w-4 text-white/80" />
                    <p className="text-xs text-white/55">{locale === "ar" ? "استجابة سريعة" : "Fast response"}</p>
                    <p className="mt-0.5 text-sm font-medium">{locale === "ar" ? "من الوكيل" : "From the agent"}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-xl">
                    <ShieldCheck className="mb-2 h-4 w-4 text-white/80" />
                    <p className="text-xs text-white/55">{locale === "ar" ? "بياناتك" : "Your details"}</p>
                    <p className="mt-0.5 text-sm font-medium">{locale === "ar" ? "بخصوصية وأمان" : "Private & secure"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
              <div className="sticky top-0 z-10 border-b border-border/70 bg-background/95 px-5 py-4 backdrop-blur-xl sm:px-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-primary">
                      {isVisit ? <CalendarDays className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                        {isVisit ? t("scheduleVisit") : t("contactAgent")}
                      </span>
                    </div>
                    <h2 id="property-inquiry-title" className="text-xl font-semibold tracking-tight sm:text-2xl">
                      {isVisit
                        ? (locale === "ar" ? "احجز معاينة للعقار" : "Book a private viewing")
                        : (locale === "ar" ? "تواصل مع وكيل العقار" : "Connect with the property agent")}
                    </h2>
                    <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted-foreground">
                      {isVisit
                        ? (locale === "ar" ? "أرسل بياناتك والموعد المفضل وسنتواصل معك لتأكيد المعاينة." : "Share your details and preferred time and we’ll contact you to confirm the viewing.")
                        : (locale === "ar" ? "اترك بياناتك وسيتواصل معك الوكيل لمساعدتك في الخطوة التالية." : "Leave your details and the agent will get in touch to help with the next step.")}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition hover:bg-muted hover:text-foreground"
                    aria-label="Close modal"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>

              <div className="px-5 pb-7 pt-5 sm:px-7">
                <div className="mb-5 flex items-center gap-3 rounded-2xl border border-primary/10 bg-primary/[0.045] p-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    {isVisit ? <CalendarDays className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{propertyTitle}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{propertyLocation}</span>
                    </p>
                  </div>
                  <span className="ms-auto shrink-0 text-sm font-semibold text-primary">{priceLabel}</span>
                </div>

                <InquiryForm
                  propertyId={propertyId}
                  initialType={type}
                  onSuccess={() => undefined}
                />

                <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" />{locale === "ar" ? "بياناتك محمية" : "Your data is protected"}</span>
                  <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{locale === "ar" ? "تواصل مباشر مع الوكيل" : "Direct agent contact"}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
