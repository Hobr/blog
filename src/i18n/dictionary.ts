import type { Locale } from "./config.ts";
import { en } from "./locales/en.ts";
import { ja } from "./locales/ja.ts";
import { zhCN } from "./locales/zh-CN.ts";

type StringFormatter = typeof zhCN.blogIndex.openTag;

export type SiteDictionary = {
    brand: {
        name: string;
        switcherLabel: string;
        themeLabel: string;
    };
    nav: {
        home: string;
        blog: string;
        tags: string;
        archive: string;
        contact: string;
    };
    common: {
        noPosts: string;
        tagsLabel: string;
    };
    error: {
        metaTitle: string;
        command: string;
        title: string;
        message: string;
        homeAction: string;
    };
    home: {
        metaTitle: string;
        profileSubtitle: string;
        sitesSubtitle: string;
        latestSubtitle: string;
        viewAll: string;
    };
    blogIndex: {
        metaTitle: string;
        listSubtitle: string;
        navSubtitle: string;
        openArchive: string;
        openTag: StringFormatter;
    };
    tagsPage: {
        metaTitle: string;
        title: string;
        panelSubtitle: string;
    };
    archive: {
        metaTitle: string;
        panelSubtitle: string;
    };
    contact: {
        metaTitle: string;
        imSubtitle: string;
        socialSubtitle: string;
    };
    tagPage: {
        metaTitle: StringFormatter;
        panelSubtitle: StringFormatter;
        empty: string;
    };
    articlePage: {
        metaTitle: StringFormatter;
        previous: string;
        next: string;
        startOfLog: string;
        latestEntry: string;
    };
};

const dictionaries = {
    "zh-CN": zhCN,
    en,
    ja,
} satisfies Record<Locale, SiteDictionary>;

export function getDictionary(locale: Locale): SiteDictionary {
    return dictionaries[locale];
}
