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
        role: "全栈 / 计算机民科 / 二次元",
        bio: `
        计算机狂热爱好者, 关注开源社区与技术发展, 喜欢尝试各种新技术, 自认为有一定的技术品味, 追求自己所热爱且有价值的工作与技术。
        日语专业出身, 具有一定的人文思维与日语能力, 上学期间有参与较多的社会实践、志愿者服务和社团, 有较强的沟通能力和团队带领能力。
        贰刺猿, 是萌二纸片痴, 也是甩手偶像厨, 主推: 京都动画 / Key社 / 邦多利。
        目前关注: 神经-符号人工智能 / Agentic OS / AI Agent / RISC-V。
        `,
    },
    en: {
        name: profileName,
        email: avatarEmail,
        role: "Full-Stack / Computer Science Crank / Otaku",
        bio: `
        A total computer geek. Following the Open-Source community and tech developments, love trying out all kinds of new tech, and like to think I have a good tech taste. Seeking for work and technology that I truly love.
        Japanese major by background, with a bit of a humanities mindset and Japanese language skills. During school I got involved in a lot of social practice, volunteer work, and school clubs, so I have strong communication and team-leadership skills.
        ACGN Otaku nerd, and also a radical idol otaku. Mainly favor in: Kyoto Animation / Key / BanG Dream.
        Now following: World Model / Neuro-Symbolic AI / Agentic OS / AI Agent / RISC-V.
        `,
    },
};

export function getProfile(locale: Locale): ProfileData {
    return profiles[locale];
}

export const profile = getProfile(defaultLocale);
