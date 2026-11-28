export type RawPostRecord = {
  id: string;
  data: {
    title: string;
    slug: string;
    date: string;
    tags: string[];
  };
};

export type NormalizedPost = {
  id: string;
  title: string;
  slug: string;
  tags: string[];
  publishedAt: Date;
  dateLabel: string;
};

export type RenderedPostHeading = {
  depth: number;
  text: string;
};

export function extractPostSlug(id: string): string {
  const path = id.replace(/\.md$/, "");
  const slug = path.endsWith("/index") ? path.slice(0, -"/index".length) : path;

  if (!slug) {
    throw new Error(`Post slug is required: ${id}`);
  }

  return slug;
}

export function extractPostTitle(
  id: string,
  headings: readonly RenderedPostHeading[] | undefined,
): string {
  const title = headings?.find((heading) => heading.depth === 1)?.text.trim();

  if (!title) {
    throw new Error(`Post title is required: ${id}`);
  }

  return title;
}

export function parsePostDate(input: string): Date {
  const normalized = input.trim();
  const match = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(normalized);
  const invalidDateMessage = `Invalid post date: ${input}`;
  const year = Number(match?.[1]);
  const month = Number(match?.[2]);
  const day = Number(match?.[3]);

  if (
    !Number.isInteger(year) ||
    year < 1 ||
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12 ||
    !Number.isInteger(day) ||
    day < 1 ||
    day > 31
  ) {
    throw new Error(invalidDateMessage);
  }

  const parsed = new Date(0);
  parsed.setUTCHours(0, 0, 0, 0);
  parsed.setUTCFullYear(year, month - 1, day);

  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    throw new Error(invalidDateMessage);
  }

  return parsed;
}

export function normalizePostRecord(record: RawPostRecord): NormalizedPost {
  const title = record.data.title.trim();
  const slug = record.data.slug.trim();
  const tags = [...new Set(record.data.tags.map((tag) => tag.trim()))];

  if (!title) {
    throw new Error("Post title is required");
  }

  if (!slug) {
    throw new Error("Post slug is required");
  }

  if (tags.length === 0 || tags.some((tag) => !tag)) {
    throw new Error("Post tags are required");
  }

  const publishedAt = parsePostDate(record.data.date);

  return {
    id: record.id,
    title,
    slug,
    tags,
    publishedAt,
    dateLabel: publishedAt.toISOString().slice(0, 10),
  };
}

export function sortPostsByDateDesc<T extends NormalizedPost>(posts: T[]): T[] {
  return [...posts].sort(
    (left, right) => right.publishedAt.getTime() - left.publishedAt.getTime(),
  );
}

function appendGroupItem<T>(grouped: Map<string, T[]>, key: string, item: T) {
  const bucket = grouped.get(key);
  if (bucket) {
    bucket.push(item);
  } else {
    grouped.set(key, [item]);
  }
}

export function groupPostsByTag<T extends NormalizedPost>(
  posts: T[],
): Map<string, T[]> {
  const grouped = new Map<string, T[]>();

  for (const post of posts) {
    for (const tag of post.tags) {
      appendGroupItem(grouped, tag, post);
    }
  }

  return grouped;
}

export function groupPostsByMonth<T extends NormalizedPost>(
  posts: T[],
): Array<[string, T[]]> {
  const grouped = new Map<string, T[]>();

  for (const post of posts) {
    const month = post.publishedAt.toISOString().slice(0, 7);
    appendGroupItem(grouped, month, post);
  }

  return [...grouped.entries()];
}

export function createAdjacentPostMap<T extends NormalizedPost>(
  posts: T[],
): Map<
  string,
  {
    previous: T | undefined;
    next: T | undefined;
  }
> {
  return new Map(
    posts.map((post, index) => [
      post.slug,
      {
        previous: index > 0 ? posts[index - 1] : undefined,
        next: index < posts.length - 1 ? posts[index + 1] : undefined,
      },
    ]),
  );
}

export function assertUniqueSlugs<T extends { slug: string }>(posts: T[]) {
  const seen = new Set<string>();

  for (const post of posts) {
    if (seen.has(post.slug)) {
      throw new Error(`Duplicate post slug: ${post.slug}`);
    }

    seen.add(post.slug);
  }
}
