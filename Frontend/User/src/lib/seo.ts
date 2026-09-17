import { useEffect } from "react";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/constants";

interface SeoOptions {
  title?: string;
  description?: string;
  path?: string;
}

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

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function useSeo({ title, description, path }: SeoOptions = {}) {
  useEffect(() => {
    document.title = title
      ? `${title} — ${SITE_NAME}`
      : SITE_TITLE;

    const url = `${SITE_URL}${path ?? ""}`;
    const desc = description ?? SITE_DESCRIPTION;
    setMeta('meta[name="description"]', "content", desc);
    setMeta('meta[property="og:title"]', "content", title ? `${title} — ${SITE_NAME}` : SITE_TITLE);
    setMeta('meta[property="og:description"]', "content", desc);
    setMeta('meta[property="og:type"]', "content", "website");
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[property="og:image"]', "content", `${SITE_URL}/og-image.png`);
    setMeta('meta[property="og:site_name"]', "content", SITE_NAME);
    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "content", title ? `${title} — ${SITE_NAME}` : SITE_TITLE);
    setMeta('meta[name="twitter:description"]', "content", desc);
    setMeta('meta[name="twitter:image"]', "content", `${SITE_URL}/og-image.png`);
    setCanonical(url);
  }, [title, description, path]);
}
