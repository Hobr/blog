import type { Locale } from "../i18n/config.ts";
import type { LocalizedSiteCommand } from "./sites.ts";

export type ContactSiteGroups = {
    im: LocalizedSiteCommand[];
    development: LocalizedSiteCommand[];
    social: LocalizedSiteCommand[];
};

type ContactGroup = keyof ContactSiteGroups;

type SharedSiteTarget = {
    command: string;
    href: string;
    i18n: Record<Locale, string>;
    group: ContactGroup;
};

export const sharedSiteTargets = {
    email: {
        command: "./mail@hobr.site",
        href: "mailto:mail@hobr.site",
        i18n: { "zh-CN": "邮箱", en: "Email" },
        group: "im",
    },
    telegram: {
        command: "./Telegram",
        href: "https://t.me/Hobrd",
        i18n: { "zh-CN": "电报", en: "Telegram" },
        group: "im",
    },
    qq: {
        command: "./QQ",
        href: "https://qm.qq.com/q/VJ01PuCduS",
        i18n: { "zh-CN": "QQ", en: "QQ" },
        group: "im",
    },
    matrix: {
        command: "./Matrix",
        href: "https://matrix.to/#/@hobrd:matrix.org",
        i18n: { "zh-CN": "Matrix", en: "Matrix" },
        group: "im",
    },
    discord: {
        command: "./Discord",
        href: "https://discord.gg/rgAZKrmC",
        i18n: { "zh-CN": "Discord", en: "Discord" },
        group: "im",
    },

    bilibili: {
        command: "./Bilibili",
        href: "https://space.bilibili.com/35583361",
        i18n: { "zh-CN": "哔哩哔哩", en: "Bilibili" },
        group: "social",
    },
    rednote: {
        command: "./RedNote",
        href: "https://xhslink.cn/o/5w0Gq6fbyel",
        i18n: { "zh-CN": "小红书", en: "RedNote" },
        group: "social",
    },
    zhihu: {
        command: "./Zhihu",
        href: "https://www.zhihu.com/people/hobr",
        i18n: { "zh-CN": "知乎", en: "Zhihu" },
        group: "social",
    },
    x: {
        command: "./X",
        href: "https://x.com/Hobrimttxx",
        i18n: { "zh-CN": "X", en: "X" },
        group: "social",
    },
    bangumi: {
        command: "./Bangumi",
        href: "https://bangumi.tv/user/hobr",
        i18n: { "zh-CN": "Bangumi", en: "Bangumi" },
        group: "social",
    },

    github: {
        command: "./GitHub",
        href: "https://github.com/Hobr",
        i18n: { "zh-CN": "GitHub", en: "GitHub" },
        group: "development",
    },
    git: {
        command: "./Hobr's Git",
        href: "https://git.hobr.site/",
        i18n: { "zh-CN": "自有Git", en: "Hosted Git" },
        group: "development",
    },
    huggingface: {
        command: "./HuggingFace",
        href: "https://huggingface.co/Hobr",
        i18n: { "zh-CN": "Hugging Face", en: "Hugging Face" },
        group: "development",
    },
    orcid: {
        command: "./ORCID",
        href: "https://orcid.org/0009-0005-6599-5461",
        i18n: { "zh-CN": "ORCID", en: "ORCID" },
        group: "development",
    },
    gitee: {
        command: "./Gitee",
        href: "https://gitee.com/Hobr",
        i18n: { "zh-CN": "Gitee", en: "Gitee" },
        group: "development",
    },
} as const satisfies Record<string, SharedSiteTarget>;

type SharedSiteTargetKey = keyof typeof sharedSiteTargets;

const sharedSiteTargetKeys = Object.keys(
    sharedSiteTargets,
) as SharedSiteTargetKey[];

function localizeContactSites(
    locale: Locale,
    keys: readonly SharedSiteTargetKey[],
): LocalizedSiteCommand[] {
    return keys.map((key) => {
        const { i18n, ...site } = sharedSiteTargets[key];
        return { ...site, name: i18n[locale] };
    });
}

function getContactSitesByGroup(
    locale: Locale,
    group: ContactGroup,
): LocalizedSiteCommand[] {
    return localizeContactSites(
        locale,
        sharedSiteTargetKeys.filter(
            (key) => sharedSiteTargets[key].group === group,
        ),
    );
}

export function getContactSiteGroups(locale: Locale): ContactSiteGroups {
    return {
        im: getContactSitesByGroup(locale, "im"),
        development: getContactSitesByGroup(locale, "development"),
        social: getContactSitesByGroup(locale, "social"),
    };
}
