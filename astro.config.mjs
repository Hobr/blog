// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { markdownThemes } from "./src/data/themes.ts";
import { shouldIncludeSitemapPage } from "./src/i18n/sitemap.ts";
import imgAttr from "satteri-imgattr";
import { satteri } from "@astrojs/markdown-satteri";
import { mermaidMdast, mermaidHast } from "@xingwangzhe/satteri-mermaid";
import { satteriKatex } from "satteri-katex";

/** @param {unknown} idFilter */
function matchesAstroVirtualModuleFilter(idFilter) {
    if (idFilter instanceof RegExp) {
        return /(?:^\^|\(\?:|\(|\|)astro:/.test(idFilter.source);
    }
    if (typeof idFilter === "string") {
        return idFilter.startsWith("astro:");
    }
    if (Array.isArray(idFilter)) {
        return idFilter.some(matchesAstroVirtualModuleFilter);
    }
    if (idFilter && typeof idFilter === "object" && "include" in idFilter) {
        return matchesAstroVirtualModuleFilter(idFilter.include);
    }
    return false;
}

// https://astro.build/config
export default defineConfig({
    site: "https://hobr.site",
    prefetch: true,
    compressHTML: true,
    fonts: [
        {
            name: "JetBrains Mono",
            cssVariable: "--font-terminal",
            provider: fontProviders.fontsource(),
            weights: ["400 700"],
            styles: ["normal"],
            subsets: ["latin", "latin-ext"],
            fallbacks: ["monospace"],
        },
    ],
    vite: {
        cacheDir: ".astro/vite-cache",
        plugins: [
            {
                name: "astro-virtual-modules-before-filesystem",
                configEnvironment(_name, options) {
                    if (options.resolve?.noExternal === true) {
                        return;
                    }
                    return {
                        resolve: {
                            noExternal: [/^astro:/],
                        },
                    };
                },
                configResolved(config) {
                    for (const plugin of config.plugins) {
                        if (plugin.enforce != null || !plugin.resolveId) {
                            continue;
                        }
                        const hook = plugin.resolveId;
                        if (
                            typeof hook !== "object" ||
                            !hook.filter ||
                            typeof hook.filter !== "object" ||
                            !("id" in hook.filter) ||
                            !matchesAstroVirtualModuleFilter(hook.filter.id)
                        ) {
                            continue;
                        }
                        plugin.resolveId = { ...hook, order: "pre" };
                    }
                },
            },
        ],
        optimizeDeps: {
            // The dependency optimizer resolves imports separately from Astro's hooks.
            exclude: ["astro:toolbar:internal"],
        },
        server: {
            watch: {
                ignored: ["**/.direnv/**"],
            },
        },
    },
    integrations: [
        sitemap({
            filter: shouldIncludeSitemapPage,
        }),
    ],
    markdown: {
        shikiConfig: {
            themes: markdownThemes,
            defaultColor: false,
        },
        processor: satteri({
            features: { math: true },
            mdastPlugins: [
                mermaidMdast({
                    langs: ["mermaid", "mmd"],
                }),
                satteriKatex(),
            ],

            hastPlugins: [
                imgAttr({
                    defaults: { loading: "lazy", decoding: "async" },
                }),

                mermaidHast({
                    theme: "modern",
                    font: "JetBrains Mono, monospace",
                    responsive: false,
                    fontSize: 12,
                    nodeSpacing: 16,
                    rankSpacing: 24,
                }),
            ],
        }),
    },
});
