import { secondaryLocales } from "./config.ts";

const localizedArticlePattern = new RegExp(
  `^/(?:${secondaryLocales.join("|")})/blog/[^/]+/?$`,
);

function getPathname(page: string): string {
  if (page.startsWith("/")) {
    return page;
  }
  try {
    return new URL(page).pathname;
  } catch {
    return page;
  }
}

export function shouldIncludeSitemapPage(page: string): boolean {
  return !localizedArticlePattern.test(getPathname(page));
}
