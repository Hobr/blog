import type { Locale } from "../i18n/config.ts";
import type { LocalizedSiteCommand } from "./sites.ts";

export const sharedSiteTargets = {
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

type SharedSiteTargetKey = keyof typeof sharedSiteTargets;

const contactSiteNames: Record<Locale, Record<SharedSiteTargetKey, string>> = {
    "zh-CN": {
        email: "邮箱",
        telegram: "电报",
        qq: "QQ",
        matrix: "Matrix",
        discord: "Discord",
        github: "GitHub",
        x: "X",
        bilibili: "哔哩哔哩",
        rednote: "小红书",
        zhihu: "知乎",
        linuxdo: "Linux.do",
        weibo: "微博",
    },
    en: {
        email: "Email",
        telegram: "Telegram",
        qq: "QQ",
        matrix: "Matrix",
        discord: "Discord",
        github: "GitHub",
        x: "X",
        bilibili: "Bilibili",
        rednote: "RedNote",
        zhihu: "Zhihu",
        linuxdo: "Linux.do",
        weibo: "Weibo",
    },
};

const contactGroupKeys = {
    im: ["email", "telegram", "qq", "matrix", "discord"],
    social: ["github", "x", "bilibili", "rednote", "zhihu", "linuxdo", "weibo"],
} as const satisfies Record<string, readonly SharedSiteTargetKey[]>;

export type ContactSiteGroups = {
    im: LocalizedSiteCommand[];
    social: LocalizedSiteCommand[];
};

function localizeContactSites(
    locale: Locale,
    keys: readonly SharedSiteTargetKey[],
): LocalizedSiteCommand[] {
    return keys.map((key) => ({
        ...sharedSiteTargets[key],
        name: contactSiteNames[locale][key],
    }));
}

export function getContactSites(locale: Locale): LocalizedSiteCommand[] {
    return localizeContactSites(
        locale,
        Object.keys(sharedSiteTargets) as SharedSiteTargetKey[],
    );
}

export function getContactSiteGroups(locale: Locale): ContactSiteGroups {
    return {
        im: localizeContactSites(locale, contactGroupKeys.im),
        social: localizeContactSites(locale, contactGroupKeys.social),
    };
}
