// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { markdownThemes } from "./src/data/themes.ts";
import { shouldIncludeSitemapPage } from "./src/i18n/sitemap.ts";
import imgAttr from "satteri-imgattr";
import { satteri } from "@astrojs/markdown-satteri";
import { mermaidMdast, mermaidHast } from "@xingwangzhe/satteri-mermaid";
import { satteriKatex } from "satteri-katex";

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
        {
            name: "Noto Sans SC",
            cssVariable: "--font-body",
            provider: fontProviders.fontsource(),
            weights: [400, 500, 600, 700],
            styles: ["normal"],
            subsets: ["chinese-simplified", "latin"],
            fallbacks: ["sans-serif"],
        },
    ],
    vite: {
        cacheDir: ".astro/vite-cache",
        plugins: [
            {
                name: "astro-virtual-modules-before-filesystem",
                configResolved(config) {
                    // NTFS with ADS treats `astro:*` paths as the `astro` directory.
                    // Let Astro resolve its virtual modules before Vite checks disk.
                    for (const plugin of config.plugins) {
                        if (
                            !plugin.name.startsWith("astro:") ||
                            !plugin.resolveId
                        ) {
                            continue;
                        }
                        const hook = plugin.resolveId;
                        plugin.resolveId =
                            typeof hook === "function"
                                ? { order: "pre", handler: hook }
                                : { ...hook, order: "pre" };
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
