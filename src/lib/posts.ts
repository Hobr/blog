import { getCollection, type CollectionEntry } from "astro:content";

import {
    assertUniqueSlugs,
    createAdjacentPostMap,
    groupPostsByMonth,
    groupPostsByTag,
    normalizePostRecord,
    sortPostsByDateDesc,
    type NormalizedPost,
} from "./post-data";

export type BlogPost = NormalizedPost & {
    entry: CollectionEntry<"posts">;
};

function getPostSlug(id: string): string {
    const path = id.replace(/\.md$/, "");
    const slug = path.endsWith("/index")
        ? path.slice(0, -"/index".length)
        : path;

    if (!slug) {
        throw new Error(`Post slug is required: ${id}`);
    }

    return slug;
}

function getPostTitle(entry: CollectionEntry<"posts">): string {
    const headings = entry.rendered?.metadata?.headings as
        Array<{ depth: number; text: string }> | undefined;
    const title = headings?.find((heading) => heading.depth === 1)?.text.trim();

    if (!title) {
        throw new Error(`Post title is required: ${entry.id}`);
    }

    return title;
}

async function collectPosts(): Promise<BlogPost[]> {
    const entries = await getCollection("posts");
    const posts = sortPostsByDateDesc(
        entries.map((entry) => ({
            ...normalizePostRecord({
                ...entry,
                data: {
                    ...entry.data,
                    title: getPostTitle(entry),
                    slug: getPostSlug(entry.id),
                },
            }),
            entry,
        })),
    );

    assertUniqueSlugs(posts);

    return posts;
}

export async function getAllPosts() {
    return collectPosts();
}

export async function getLatestPosts(limit = 5) {
    return (await collectPosts()).slice(0, limit);
}

export async function getPostBySlug(slug: string) {
    return (await collectPosts()).find((post) => post.slug === slug);
}

export async function getAllTags() {
    return [...groupPostsByTag(await collectPosts()).keys()].sort();
}

export async function getPostsByTag(tag: string) {
    return groupPostsByTag(await collectPosts()).get(tag) ?? [];
}

export async function getArchiveGroups() {
    return groupPostsByMonth(await collectPosts());
}

export async function getAdjacentPosts(slug: string) {
    return (
        createAdjacentPostMap(await collectPosts()).get(slug) ?? {
            previous: undefined,
            next: undefined,
        }
    );
}
