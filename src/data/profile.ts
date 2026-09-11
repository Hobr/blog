import { defaultLocale, type Locale } from "../i18n/config.ts";

export type ProfileData = {
    name: string;
    email: string;
    role: string;
    bio: string;
};

const profileEmail = "mail@hobr.site";

const profiles: Record<Locale, ProfileData> = {
    "zh-CN": {
        name: "Hobr",
        email: profileEmail,
        role: "计算机民科 / 全栈 / 二次元",
        bio: ``,
    },
    en: {
        name: "Hobr",
        email: profileEmail,
        role: "Computer Science Crank / Full-Stack Developer / Anime Fan",
        bio: ``,
    },
    ja: {
        name: "Hobr",
        email: profileEmail,
        role: "コンピュータ科学のトンデモ研究者 / フルスタック開発者 / 二次元",
        bio: ``,
    },
};

export function getProfile(locale: Locale): ProfileData {
    return profiles[locale];
}

export const profile = getProfile(defaultLocale);
