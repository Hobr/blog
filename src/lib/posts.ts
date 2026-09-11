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

async function collectPosts(): Promise<BlogPost[]> {
    const entries = await getCollection("posts");
    const posts = sortPostsByDateDesc(
        entries.map((entry) => ({
            ...normalizePostRecord(entry),
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
