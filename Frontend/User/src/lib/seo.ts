import { useEffect } from "react";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE } from "@/lib/constants";

interface SeoOptions {
  title?: string;
  description?: string;
  path?: string;
}

const BASE_URL = import.meta.env.VITE_SITE_URL ?? "https://portfolio.vercel.app";

function setMeta(selector: string, attribute: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    const attr = attribute === "name" ? "name" : "property";
    el.setAttribute(attr, selector.replace(/^meta\[(?:name|property)="/, "").replace(/"\]$/, ""));
    document.head.appendChild(el);
  }
  el.setAttribute(attribute, value);
}

export function useSeo({ title, description, path }: SeoOptions = {}) {
  useEffect(() => {
    document.title = title
      ? `${title} — ${SITE_NAME}`
      : SITE_TITLE;

    const desc = description ?? SITE_DESCRIPTION;
    setMeta('meta[name="description"]', "content", desc);
    setMeta('meta[property="og:title"]', "content", title ? `${title} — ${SITE_NAME}` : SITE_TITLE);
    setMeta('meta[property="og:description"]', "content", desc);
    setMeta('meta[property="og:type"]', "content", "website");
    setMeta('meta[property="og:url"]', "content", `${BASE_URL}${path ?? ""}`);
    setMeta('meta[property="og:image"]', "content", `${BASE_URL}/og-image.png`);
    setMeta('meta[property="og:site_name"]', "content", SITE_NAME);
    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "content", title ? `${title} — ${SITE_NAME}` : SITE_TITLE);
    setMeta('meta[name="twitter:description"]', "content", desc);
    setMeta('meta[name="twitter:image"]', "content", `${BASE_URL}/og-image.png`);
  }, [title, description, path]);
}
