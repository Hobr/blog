// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { shouldIncludeSitemapPage } from "./src/i18n/sitemap.ts";
import imgAttr from "satteri-imgattr";
import { satteri } from "@astrojs/markdown-satteri";
import { mermaidMdast, mermaidHast } from "@xingwangzhe/satteri-mermaid";

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
        processor: satteri({
            mdastPlugins: [
                mermaidMdast({
                    langs: ["mermaid", "mmd"],
                }),
            ],

            hastPlugins: [
                imgAttr({
                    defaults: { loading: "lazy", decoding: "async" },
                }),

                mermaidHast({
                    theme: "modern",
                    font: "JetBrains Mono, monospace",
                }),
            ],
        }),
    },
});
