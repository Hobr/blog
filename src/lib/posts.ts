import { getCollection, type CollectionEntry } from "astro:content";

import {
    assertUniqueSlugs,
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

async function loadPosts(): Promise<BlogPost[]> {
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

let cachedPostsPromise: Promise<BlogPost[]> | undefined;
let cachedPostsByTagPromise: Promise<Map<string, BlogPost[]>> | undefined;

async function collectPosts(): Promise<BlogPost[]> {
    if (!import.meta.env.PROD) {
        return loadPosts();
    }

    cachedPostsPromise ??= loadPosts();
    return cachedPostsPromise;
}

async function collectPostsByTag(): Promise<Map<string, BlogPost[]>> {
    if (!import.meta.env.PROD) {
        return groupPostsByTag(await collectPosts());
    }

    cachedPostsByTagPromise ??= collectPosts().then((posts) =>
        groupPostsByTag(posts),
    );
    return cachedPostsByTagPromise;
}

export async function getAllPosts() {
    return collectPosts();
}

export async function getLatestPosts(limit = 5) {
    return (await collectPosts()).slice(0, limit);
}

export async function getAllTags() {
    return [...(await collectPostsByTag()).keys()].sort();
}

export async function getPostsByTag(tag: string) {
    return (await collectPostsByTag()).get(tag) ?? [];
}

export async function getArchiveGroups() {
    return groupPostsByMonth(await collectPosts());
}
