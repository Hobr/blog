import { defaultLocale, toLocalePath, type Locale } from "../i18n/config.ts";

export type LocalizedSiteCommand = {
    command: string;
    name: string;
    href: string;
};

const siteSets: Record<Locale, LocalizedSiteCommand[]> = {
    "zh-CN": [
        {
            command: "./contact",
            name: "联系",
            href: toLocalePath("zh-CN", "/contact"),
        },
        {
            command: "./blog",
            name: "博客",
            href: toLocalePath("zh-CN", "/blog"),
        },
        {
            command: "./archive",
            name: "归档",
            href: toLocalePath("zh-CN", "/archive"),
        },
        {
            command: "./tags",
            name: "标签",
            href: toLocalePath("zh-CN", "/tags"),
        },
    ],
    en: [
        {
            command: "./contact",
            name: "Contact",
            href: toLocalePath("en", "/contact"),
        },
        {
            command: "./blog",
            name: "Blog",
            href: toLocalePath("en", "/blog"),
        },
        {
            command: "./archive",
            name: "Archive",
            href: toLocalePath("en", "/archive"),
        },
        {
            command: "./tags",
            name: "Tag View",
            href: toLocalePath("en", "/tags"),
        },
    ],
};

export function getSites(locale: Locale): LocalizedSiteCommand[] {
    return siteSets[locale];
}

export const sites = getSites(defaultLocale);
