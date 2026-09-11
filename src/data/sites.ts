import { defaultLocale, toLocalePath, type Locale } from "../i18n/config.ts";
import { sharedSiteTargets } from "./contact.ts";

export type LocalizedSiteCommand = {
    command: string;
    name: string;
    href: string;
};

const siteSets: Record<Locale, LocalizedSiteCommand[]> = {
    "zh-CN": [
        {
            ...sharedSiteTargets.email,
            name: "邮箱",
        },
        {
            ...sharedSiteTargets.telegram,
            name: "电报",
        },
        {
            ...sharedSiteTargets.github,
            name: "GitHub",
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
            command: "./tags/site",
            name: "标签",
            href: toLocalePath("zh-CN", "/tags/site"),
        },
    ],
    en: [
        {
            ...sharedSiteTargets.email,
            name: "Email",
        },
        {
            ...sharedSiteTargets.telegram,
            name: "Telegram",
        },
        {
            ...sharedSiteTargets.github,
            name: "GitHub",
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
            command: "./tags/site",
            name: "Tag View",
            href: toLocalePath("en", "/tags/site"),
        },
    ],
    ja: [
        {
            ...sharedSiteTargets.email,
            name: "メール",
        },
        {
            ...sharedSiteTargets.telegram,
            name: "Telegram",
        },
        {
            ...sharedSiteTargets.github,
            name: "GitHub",
        },
        {
            command: "./blog",
            name: "ブログ",
            href: toLocalePath("ja", "/blog"),
        },
        {
            command: "./archive",
            name: "アーカイブ",
            href: toLocalePath("ja", "/archive"),
        },
        {
            command: "./tags/site",
            name: "タグ",
            href: toLocalePath("ja", "/tags/site"),
        },
    ],
};

export function getSites(locale: Locale): LocalizedSiteCommand[] {
    return siteSets[locale];
}

export const sites = getSites(defaultLocale);
