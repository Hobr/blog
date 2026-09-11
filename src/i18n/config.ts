export const locales = ["zh-CN", "en"] as const;
export type Locale = (typeof locales)[number];
export type SecondaryLocale = Exclude<Locale, "zh-CN">;

export const defaultLocale: Locale = "zh-CN";
export const secondaryLocales: SecondaryLocale[] = ["en"];

export const localeDisplayNames: Record<Locale, string> = {
    "zh-CN": "中文",
    en: "English",
};

const localePrefixes: Record<Locale, string> = {
    "zh-CN": "",
    en: "/en",
};

export type AlternateLink = {
    locale: Locale;
    href: string;
    label: string;
    lang: string;
};

export function isLocale(value: string): value is Locale {
    return locales.includes(value as Locale);
}

export function isSecondaryLocale(value: string): value is SecondaryLocale {
    return secondaryLocales.includes(value as SecondaryLocale);
}

export function stripLocaleFromPathname(pathname: string): {
    locale: Locale;
    pathnameWithoutLocale: string;
} {
    const normalized = pathname === "" ? "/" : pathname;

    for (const locale of secondaryLocales) {
        const prefix = localePrefixes[locale];
        if (normalized === prefix) {
            return { locale, pathnameWithoutLocale: "/" };
        }
        if (normalized.startsWith(`${prefix}/`)) {
            return {
                locale,
                pathnameWithoutLocale: normalized.slice(prefix.length),
            };
        }
    }

    return {
        locale: defaultLocale,
        pathnameWithoutLocale: normalized,
    };
}

export function toLocalePath(locale: Locale, pathname: string): string {
    const normalized = pathname === "" ? "/" : pathname;
    if (normalized !== "/" && !normalized.startsWith("/")) {
        throw new Error("pathname must start with '/'");
    }
    const prefix = localePrefixes[locale];
    if (locale === defaultLocale) return normalized;
    return normalized === "/" ? `${prefix}/` : `${prefix}${normalized}`;
}

export function buildAlternateLinks(pathname: string): AlternateLink[] {
    const { pathnameWithoutLocale } = stripLocaleFromPathname(pathname);
    return locales.map((locale) => ({
        locale,
        href: toLocalePath(locale, pathnameWithoutLocale),
        label: localeDisplayNames[locale],
        lang: locale,
    }));
}
