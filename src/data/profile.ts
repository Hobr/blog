import { defaultLocale, type Locale } from "../i18n/config.ts";

export type ProfileData = {
    name: string;
    email: string;
    role: string;
    bio: string;
};

const profileName = "Hobr";
const avatarEmail = "mail@hobr.site";

const profiles: Record<Locale, ProfileData> = {
    "zh-CN": {
        name: profileName,
        email: avatarEmail,
        role: "计算机民科 / 全栈 / 二次元",
        bio: `长期专注于软件开发与开源实践, 涉猎多种编程语言与技术栈, 拥有十余年编程经验, 关注人工智能等前沿技术趋势, 喜欢在实战中学习, 追求有品味的技术, 具备跨学科背景且有较为丰富的社会实践经验, 目前专注于神经-符号人工智能领域`,
    },
    en: {
        name: profileName,
        email: avatarEmail,
        role: "Computer Science Crank / Full-Stack Developer / Anime Fan",
        bio: `I have long focused on software development and open-source practices, with exposure to a wide range of programming languages and technology stacks. I have over ten years of programming experience, keep up with cutting-edge technology trends such as artificial intelligence, and enjoy learning through hands-on practice. I pursue technology with good taste, have an interdisciplinary background and fairly extensive experience in social practice, and am currently focused on the field of Neuro-Symbolic AI.`,
    },
};

export function getProfile(locale: Locale): ProfileData {
    return profiles[locale];
}

export const profile = getProfile(defaultLocale);
