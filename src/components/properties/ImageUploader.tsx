"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ImagePlus, Star, Trash2, Link2 } from "lucide-react";

export interface ImageItem {
  url: string;
  publicId?: string;
  isPrimary: boolean;
  order: number;
  alt?: string;
}

interface ImageUploaderProps {
  images: ImageItem[];
  onChange: (images: ImageItem[]) => void;
  maxImages?: number;
}

export function ImageUploader({
  images,
  onChange,
  maxImages = 12,
}: ImageUploaderProps) {
  const t = useTranslations("Listings.form");
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [showUrl, setShowUrl] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError("");

    const remaining = maxImages - images.length;
    if (remaining <= 0) {
      setError(t("imagesMax"));
      return;
    }

    const selected = Array.from(files).slice(0, remaining);
    setUploading(true);

    try {
      const uploaded: ImageItem[] = [];
      for (const file of selected) {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: form });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || t("uploadError"));
          continue;
        }
        uploaded.push({
          url: data.url,
          publicId: data.publicId || undefined,
          isPrimary: false,
          order: 0,
        });
      }

      if (uploaded.length > 0) {
        const next = [...images, ...uploaded].map((img, i) => ({
          ...img,
          order: i,
          isPrimary: i === 0,
        }));
        onChange(next);
      }
    } catch {
      setError(t("uploadError"));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function addUrl() {
    const url = urlInput.trim();
    if (!url) return;
    if (images.length >= maxImages) {
      setError(t("imagesMax"));
      return;
    }
    try {
      new URL(url.startsWith("/") ? `http://localhost${url}` : url);
    } catch {
      setError(t("invalidUrl"));
      return;
    }
    const next = [
      ...images,
      { url, isPrimary: images.length === 0, order: images.length },
    ].map((img, i) => ({ ...img, order: i, isPrimary: i === 0 }));
    onChange(next);
    setUrlInput("");
    setError("");
  }

  function removeAt(index: number) {
    const next = images
      .filter((_, i) => i !== index)
      .map((img, i) => ({ ...img, order: i, isPrimary: i === 0 }));
    onChange(next);
  }

  function setPrimary(index: number) {
    onChange(
      images.map((img, i) => ({
        ...img,
        isPrimary: i === index,
        order: i,
      }))
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={uploading || images.length >= maxImages}
          onClick={() => inputRef.current?.click()}
          className="inline-flex h-10 items-center gap-2 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium shadow hover:bg-[hsl(var(--primary-600))] transition-colors disabled:opacity-50"
        >
          <ImagePlus className="w-4 h-4" />
          {uploading ? t("uploading") : t("uploadImages")}
        </button>
        <button
          type="button"
          onClick={() => setShowUrl((v) => !v)}
          className="inline-flex h-10 items-center gap-2 px-4 rounded-md border border-[hsl(var(--border))] text-sm font-medium hover:bg-muted transition-colors"
        >
          <Link2 className="w-4 h-4" />
          {t("addUrl")}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {showUrl && (
        <div className="flex gap-2">
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://..."
            className="flex-1 h-10 px-3 rounded-md border border-[hsl(var(--input))] bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="button"
            onClick={addUrl}
            className="h-10 px-4 rounded-md border border-[hsl(var(--border))] text-sm font-medium hover:bg-muted"
          >
            {t("add")}
          </button>
        </div>
      )}

      <p className="text-xs text-muted-foreground">{t("imagesHelp")}</p>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((img, index) => (
            <div
              key={`${img.url}-${index}`}
              className="relative aspect-[4/3] rounded-lg overflow-hidden border border-[hsl(var(--border))] bg-muted group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt || ""} className="w-full h-full object-cover" />
              {img.isPrimary && (
                <span className="absolute top-2 start-2 px-1.5 py-0.5 rounded text-[10px] font-medium bg-[hsl(var(--accent-500))] text-[hsl(var(--primary-900))]">
                  {t("primary")}
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 p-1.5 flex gap-1 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                {!img.isPrimary && (
                  <button
                    type="button"
                    onClick={() => setPrimary(index)}
                    className="flex-1 h-7 rounded bg-white/90 text-xs font-medium flex items-center justify-center gap-1"
                    title={t("setPrimary")}
                  >
                    <Star className="w-3 h-3" />
                    {t("setPrimary")}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  className="h-7 w-7 rounded bg-red-500 text-white flex items-center justify-center"
                  title={t("removeImage")}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
