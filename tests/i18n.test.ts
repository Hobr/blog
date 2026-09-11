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
import {
    getContactSiteGroups,
    getContactSites,
    sharedSiteTargets,
} from "../src/data/contact.ts";
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

test("buildAlternateLinks returns zh-CN and en siblings for the same page", () => {
    assert.deepEqual(buildAlternateLinks("/en/blog/hello-terminal"), [
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
    ]);
});

test("secondaryLocales and localeDisplayNames expose the supported non-default locales", () => {
    assert.deepEqual(secondaryLocales, ["en"]);
    assert.equal(localeDisplayNames["zh-CN"], "中文");
    assert.equal(localeDisplayNames.en, "English");
});

test("locale guard helpers describe supported locales and nothing else", () => {
    assert.ok(isLocale("zh-CN"));
    assert.ok(isLocale("en"));
    assert.equal(isLocale("fr"), false);
    assert.ok(isSecondaryLocale("en"));
    assert.equal(isSecondaryLocale("zh-CN"), false);
});

test("secondary roots and exact-match stripping behave as expected", () => {
    assert.equal(toLocalePath("en", "/"), "/en/");
    assert.deepEqual(stripLocaleFromPathname("/en"), {
        locale: "en",
        pathnameWithoutLocale: "/",
    });
    assert.deepEqual(stripLocaleFromPathname("/en/"), {
        locale: "en",
        pathnameWithoutLocale: "/",
    });
});

test("buildAlternateLinks normalizes locale root trailing slashes", () => {
    assert.deepEqual(buildAlternateLinks("/en/"), [
        { locale: "zh-CN", href: "/", label: "中文", lang: "zh-CN" },
        { locale: "en", href: "/en/", label: "English", lang: "en" },
    ]);
});

test("sitemap keeps localized shells but excludes non-canonical localized article pages", () => {
    assert.equal(
        shouldIncludeSitemapPage("https://hobr.site/en/blog/hello-terminal/"),
        false,
    );
    assert.equal(shouldIncludeSitemapPage("https://hobr.site/en/blog/"), true);
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
});

test("dictionaries resolve translated shell copy", () => {
    assert.equal(getDictionary("zh-CN").nav.blog, "博客");
    assert.equal(getDictionary("en").nav.blog, "Blog");
});

test("site data localizes labels and builds locale links", () => {
    assert.equal(getSites("zh-CN")[0].name, "联系");
    assert.equal(getSites("zh-CN")[3].command, "./tags");
    assert.equal(getSites("en")[3].name, "Tag View");
    assert.equal(getSites("en")[2].href, "/en/archive");

    assert.deepEqual(
        getSites("zh-CN")
            .slice(0, 3)
            .map((site) => site.href),
        ["/contact", "/blog", "/archive"],
    );
    assert.deepEqual(
        getSites("en")
            .slice(0, 3)
            .map((site) => site.href),
        ["/en/contact", "/en/blog", "/en/archive"],
    );
});

test("contact sites expose every shared target", () => {
    const contactSites = getContactSites("zh-CN");
    const contactGroups = getContactSiteGroups("zh-CN");

    assert.equal(contactSites.length, Object.keys(sharedSiteTargets).length);
    assert.equal(contactSites[0].href, sharedSiteTargets.email.href);
    assert.equal(contactSites.at(-1)?.href, sharedSiteTargets.weibo.href);
    assert.equal(contactGroups.im.length, 5);
    assert.equal(contactGroups.social.length, 7);
    assert.equal(contactGroups.im[0].href, sharedSiteTargets.email.href);
    assert.equal(contactGroups.social[0].href, sharedSiteTargets.github.href);
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

test("secondary locale route helpers only expose en", () => {
    assert.deepEqual(getSecondaryLocaleStaticPaths(), [
        { params: { locale: "en" }, props: { locale: "en" } },
    ]);
    assert.equal(assertSecondaryLocale("en"), "en");
    assert.throws(
        () => assertSecondaryLocale("zh-CN"),
        /Unsupported secondary locale/,
    );
});
