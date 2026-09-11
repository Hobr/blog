import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
    loader: glob({
        pattern: "**/*.md",
        base: "./posts",
    }),
    schema: z.object({
        date: z.string().trim().min(1),
        tags: z.array(z.string().trim().min(1)).min(1),
    }),
});

export const collections = { posts };
