import assert from "node:assert/strict";
import test from "node:test";

import {
    buildAlternateLinks,
    defaultLocale,
    isLocale,
    isSecondaryLocale,
    localeDisplayNames,
    secondaryLocales,
    stripLocaleFromPathname,
    toLocalePath,
} from "../src/i18n/config.ts";
import {
    assertSecondaryLocale,
    getSecondaryLocaleStaticPaths,
} from "../src/i18n/static-paths.ts";
import { shouldIncludeSitemapPage } from "../src/i18n/sitemap.ts";
import { getProfile, profile } from "../src/data/profile.ts";
import { getSites, sites } from "../src/data/sites.ts";
import { getDictionary } from "../src/i18n/dictionary.ts";
import { getThemeStyles, themes } from "../src/data/themes.ts";

test("default locale stays on the root path", () => {
    assert.equal(defaultLocale, "zh-CN");
    assert.equal(toLocalePath("zh-CN", "/blog"), "/blog");
});

test("secondary locales add the correct prefix", () => {
    assert.equal(
        toLocalePath("en", "/blog/hello-terminal"),
        "/en/blog/hello-terminal",
    );
    assert.equal(toLocalePath("ja", "/tags/site"), "/ja/tags/site");
});

test("stripLocaleFromPathname removes locale prefixes and keeps default locale on root", () => {
    assert.deepEqual(stripLocaleFromPathname("/"), {
        locale: "zh-CN",
        pathnameWithoutLocale: "/",
    });
    assert.deepEqual(stripLocaleFromPathname("/en/blog/hello-terminal"), {
        locale: "en",
        pathnameWithoutLocale: "/blog/hello-terminal",
    });
});

test("buildAlternateLinks returns zh-CN, en, and ja siblings for the same page", () => {
    assert.deepEqual(buildAlternateLinks("/ja/blog/hello-terminal"), [
        {
            locale: "zh-CN",
            href: "/blog/hello-terminal",
            label: "中文",
            lang: "zh-CN",
        },
        {
            locale: "en",
            href: "/en/blog/hello-terminal",
            label: "English",
            lang: "en",
        },
        {
            locale: "ja",
            href: "/ja/blog/hello-terminal",
            label: "日本語",
            lang: "ja",
        },
    ]);
});

test("secondaryLocales and localeDisplayNames expose the supported non-default locales", () => {
    assert.deepEqual(secondaryLocales, ["en", "ja"]);
    assert.equal(localeDisplayNames["zh-CN"], "中文");
    assert.equal(localeDisplayNames.en, "English");
    assert.equal(localeDisplayNames.ja, "日本語");
});

test("locale guard helpers describe supported locales and nothing else", () => {
    assert.ok(isLocale("zh-CN"));
    assert.ok(isLocale("en"));
    assert.ok(isLocale("ja"));
    assert.equal(isLocale("fr"), false);
    assert.ok(isSecondaryLocale("en"));
    assert.ok(isSecondaryLocale("ja"));
    assert.equal(isSecondaryLocale("zh-CN"), false);
});

test("secondary roots and exact-match stripping behave as expected", () => {
    assert.equal(toLocalePath("en", "/"), "/en/");
    assert.equal(toLocalePath("ja", "/"), "/ja/");
    assert.deepEqual(stripLocaleFromPathname("/en"), {
        locale: "en",
        pathnameWithoutLocale: "/",
    });
    assert.deepEqual(stripLocaleFromPathname("/en/"), {
        locale: "en",
        pathnameWithoutLocale: "/",
    });
    assert.deepEqual(stripLocaleFromPathname("/ja"), {
        locale: "ja",
        pathnameWithoutLocale: "/",
    });
    assert.deepEqual(stripLocaleFromPathname("/ja/"), {
        locale: "ja",
        pathnameWithoutLocale: "/",
    });
});

test("buildAlternateLinks normalizes locale root trailing slashes", () => {
    assert.deepEqual(buildAlternateLinks("/en/"), [
        { locale: "zh-CN", href: "/", label: "中文", lang: "zh-CN" },
        { locale: "en", href: "/en/", label: "English", lang: "en" },
        { locale: "ja", href: "/ja/", label: "日本語", lang: "ja" },
    ]);
});

test("sitemap keeps localized shells but excludes non-canonical localized article pages", () => {
    assert.equal(
        shouldIncludeSitemapPage("https://hobr.site/en/blog/hello-terminal/"),
        false,
    );
    assert.equal(
        shouldIncludeSitemapPage("https://hobr.site/ja/blog/hello-terminal/"),
        false,
    );
    assert.equal(shouldIncludeSitemapPage("https://hobr.site/en/blog/"), true);
    assert.equal(shouldIncludeSitemapPage("https://hobr.site/ja/blog/"), true);
    assert.equal(
        shouldIncludeSitemapPage("https://hobr.site/en/archive/"),
        true,
    );
    assert.equal(
        shouldIncludeSitemapPage("https://hobr.site/blog/hello-terminal/"),
        true,
    );
});

test("toLocalePath rejects pathnames without a leading slash", () => {
    assert.throws(
        () => toLocalePath("en", "blog/hello-terminal"),
        /pathname must start with/,
    );
    assert.throws(
        () => toLocalePath("ja", "tags/site"),
        /pathname must start with/,
    );
});

test("dictionaries resolve translated shell copy", () => {
    assert.equal(getDictionary("zh-CN").nav.blog, "博客");
    assert.equal(getDictionary("en").nav.blog, "Blog");
    assert.equal(getDictionary("ja").nav.blog, "ブログ");

    assert.equal(getDictionary("ja").common.tagsLabel, "タグ");
    assert.equal(getDictionary("ja").blogIndex.openArchive, "./archive");
});

test("site data localizes labels and preserves shared external targets", () => {
    assert.equal(getSites("zh-CN")[0].name, "邮箱");
    assert.equal(getSites("zh-CN")[3].command, "./blog");
    assert.equal(getSites("en")[4].name, "Archive");
    assert.equal(getSites("ja")[5].name, "タグ");
    assert.equal(getSites("ja")[5].command, "./tags/site");
    assert.equal(getSites("en")[2].href, "https://github.com/Hobr");
    assert.equal(getSites("ja")[4].href, "/ja/archive");

    for (const locale of ["zh-CN", "en", "ja"] as const) {
        const localizedSites = getSites(locale);
        assert.equal(localizedSites[0].href, "mailto:mail@hobr.site");
        assert.equal(localizedSites[1].href, "https://t.me/Hobrd");
        assert.equal(localizedSites[2].href, "https://github.com/Hobr");
    }
});

test("profile and sites keep default-locale compatibility exports", () => {
    assert.deepEqual(profile, getProfile(defaultLocale));
    assert.equal(sites[0].href, getSites(defaultLocale)[0].href);
});

test("theme styles include every configured theme palette", () => {
    const styles = getThemeStyles();

    for (const theme of themes) {
        assert.ok(styles.includes(`data-theme="${theme.id}"`));
        for (const [key, value] of Object.entries(theme.palette)) {
            assert.ok(styles.includes(`--${key}: ${value};`));
        }
    }
});

test("secondary locale route helpers only expose en and ja", () => {
    assert.deepEqual(getSecondaryLocaleStaticPaths(), [
        { params: { locale: "en" }, props: { locale: "en" } },
        { params: { locale: "ja" }, props: { locale: "ja" } },
    ]);
    assert.equal(assertSecondaryLocale("en"), "en");
    assert.equal(assertSecondaryLocale("ja"), "ja");
    assert.throws(
        () => assertSecondaryLocale("zh-CN"),
        /Unsupported secondary locale/,
    );
});
