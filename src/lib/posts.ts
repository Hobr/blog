import { getCollection, type CollectionEntry } from "astro:content";

import {
  assertUniqueSlugs,
  extractPostSlug,
  extractPostTitle,
  groupPostsByMonth,
  groupPostsByTag,
  normalizePostRecord,
  sortPostsByDateDesc,
  type NormalizedPost,
  type RenderedPostHeading,
} from "./post-data";

export type BlogPost = NormalizedPost & {
  entry: CollectionEntry<"posts">;
};

async function loadPosts(): Promise<BlogPost[]> {
  const entries = await getCollection("posts");
  const posts = sortPostsByDateDesc(
    entries.map((entry) => {
      const headings = entry.rendered?.metadata?.headings as
        RenderedPostHeading[] | undefined;

      return {
        ...normalizePostRecord({
          ...entry,
          data: {
            ...entry.data,
            title: extractPostTitle(entry.id, headings),
            slug: extractPostSlug(entry.id),
          },
        }),
        entry,
      };
    }),
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
