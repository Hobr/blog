import type { Locale } from "./config.ts";
import { en } from "./locales/en.ts";
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
    serverError: {
        metaTitle: string;
        title: string;
        message: string;
    };
    home: {
        metaTitle: string;
        profileSubtitle: string;
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
        tableOfContents: string;
        previous: string;
        next: string;
        startOfLog: string;
        latestEntry: string;
    };
};

const dictionaries = {
    "zh-CN": zhCN,
    en,
} satisfies Record<Locale, SiteDictionary>;

export function getDictionary(locale: Locale): SiteDictionary {
    return dictionaries[locale];
}
