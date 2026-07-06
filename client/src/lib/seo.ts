import { useEffect } from "react";

export const SITE_URL = "https://www.midcenturyadu.com";
export const SITE_NAME = "Midcentury ADU";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/opengraph.jpg`;

export interface SeoOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noindex?: boolean;
}

function upsertMeta(
  attr: "name" | "property",
  key: string,
  content: string,
): HTMLMetaElement {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
  return el;
}

function upsertCanonical(href: string): HTMLLinkElement {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
  return el;
}

export function useSeo(opts: SeoOptions): void {
  const { title, description, path, image, noindex } = opts;
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    const url = path ? `${SITE_URL}${path}` : SITE_URL;
    const og = image ?? DEFAULT_OG_IMAGE;

    const prevTitle = document.title;
    document.title = fullTitle;

    const metas: HTMLElement[] = [];
    metas.push(upsertMeta("name", "description", description));
    metas.push(upsertCanonical(url));
    metas.push(upsertMeta("property", "og:title", fullTitle));
    metas.push(upsertMeta("property", "og:description", description));
    metas.push(upsertMeta("property", "og:url", url));
    metas.push(upsertMeta("property", "og:image", og));
    metas.push(upsertMeta("property", "og:type", "website"));
    metas.push(upsertMeta("property", "og:site_name", SITE_NAME));
    metas.push(upsertMeta("name", "twitter:card", "summary_large_image"));
    metas.push(upsertMeta("name", "twitter:title", fullTitle));
    metas.push(upsertMeta("name", "twitter:description", description));
    metas.push(upsertMeta("name", "twitter:image", og));

    let robotsEl: HTMLMetaElement | null = null;
    if (noindex) {
      robotsEl = upsertMeta("name", "robots", "noindex, nofollow");
    }

    return () => {
      document.title = prevTitle;
      if (robotsEl && robotsEl.parentNode) {
        robotsEl.parentNode.removeChild(robotsEl);
      }
    };
  }, [title, description, path, image, noindex]);
}
