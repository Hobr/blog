import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
    loader: glob({
        pattern: "**/*.typ",
        base: "./src/content/posts",
    }),
    schema: z.object({
        title: z.string().trim().min(1),
        slug: z.string().trim().min(1),
        date: z.string().trim().min(1),
        tags: z.array(z.string().trim().min(1)).min(1),
    }),
});

export const collections = { posts };
