import { defaultLocale, toLocalePath, type Locale } from "../i18n/config.ts";

export type LocalizedSiteCommand = {
    command: string;
    name: string;
    href: string;
};

const sharedSiteTargets = {
    email: {
        command: "./mail@hobr.site",
        href: "mailto:mail@hobr.site",
    },
    telegram: {
        command: "./Telegram",
        href: "https://t.me/Hobrd",
    },
    qq: {
        command: "./QQ",
        href: "https://qm.qq.com/q/VJ01PuCduS",
    },
    matrix: {
        command: "./Matrix",
        href: "https://matrix.to/#/@hobrd:matrix.org",
    },
    discord: {
        command: "./Discord",
        href: "https://discord.gg/rgAZKrmC",
    },
    github: {
        command: "./GitHub",
        href: "https://github.com/Hobr",
    },
    x: {
        command: "./X",
        href: "https://x.com/Hobrimttxx",
    },
    bilibili: {
        command: "./Bilibili",
        href: "https://space.bilibili.com/35583361",
    },
    rednote: {
        command: "./RedNote",
        href: "https://xhslink.cn/o/5w0Gq6fbyel",
    },
    zhihu: {
        command: "./Zhihu",
        href: "https://www.zhihu.com/people/hobr",
    },
    linuxdo: {
        command: "./Linuxdo",
        href: "https://linux.do/u/hobr",
    },
    weibo: {
        command: "./Weibo",
        href: "https://weibo.com/u/2235490514",
    },
} as const;

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
