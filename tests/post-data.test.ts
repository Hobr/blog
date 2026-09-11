import assert from "node:assert/strict";
import test from "node:test";

import {
    assertUniqueSlugs,
    createAdjacentPostMap,
    groupPostsByMonth,
    groupPostsByTag,
    groupPostsByYear,
    normalizePostRecord,
    parsePostDate,
    sortPostsByDateDesc,
    type RawPostRecord,
} from "../src/lib/post-data.ts";

const rawPosts = [
    {
        id: "a",
        data: {
            title: "Older",
            slug: "older",
            date: "2025-12-30",
            tags: ["astro", "notes"],
        },
    },
    {
        id: "b",
        data: {
            title: "Newest",
            slug: "newest",
            date: "2026-04-06",
            tags: ["markdown"],
        },
    },
] satisfies RawPostRecord[];

function createRawPost(data: Partial<RawPostRecord["data"]>): RawPostRecord {
    return {
        id: "test-post",
        data: {
            ...rawPosts[0].data,
            ...data,
        },
    };
}

test("parsePostDate converts an ISO date into a UTC date", () => {
    const parsed = parsePostDate("2026-04-06");
    assert.equal(parsed.toISOString(), "2026-04-06T00:00:00.000Z");
});

test("parsePostDate rejects missing and impossible calendar dates", () => {
    const invalidDates = ["2026-02", "2026-13-01", "2026-02-29"];

    for (const input of invalidDates) {
        assert.throws(() => parsePostDate(input), /Invalid post date/);
    }
});

test("normalizePostRecord validates and decorates a post record", () => {
    const normalized = normalizePostRecord(rawPosts[0]);

    assert.equal(normalized.slug, "older");
    assert.equal(normalized.dateLabel, "2025-12-30");
});

test("normalizePostRecord trims fields and removes duplicate tags", () => {
    const normalized = normalizePostRecord(
        createRawPost({
            title: "  Title  ",
            slug: "  slug  ",
            tags: ["astro", " astro ", "notes"],
        }),
    );

    assert.equal(normalized.title, "Title");
    assert.equal(normalized.slug, "slug");
    assert.deepEqual(normalized.tags, ["astro", "notes"]);
});

test("normalizePostRecord rejects blank required fields", () => {
    assert.throws(
        () => normalizePostRecord(createRawPost({ title: "   " })),
        /Post title is required/,
    );
    assert.throws(
        () => normalizePostRecord(createRawPost({ slug: "   " })),
        /Post slug is required/,
    );
    assert.throws(
        () => normalizePostRecord(createRawPost({ tags: ["   "] })),
        /Post tags are required/,
    );
});

test("sortPostsByDateDesc orders newest first", () => {
    const sorted = sortPostsByDateDesc(rawPosts.map(normalizePostRecord));

    assert.deepEqual(
        sorted.map((post) => post.slug),
        ["newest", "older"],
    );
});

test("groupPostsByTag and groupPostsByYear derive navigation views", () => {
    const sorted = sortPostsByDateDesc(rawPosts.map(normalizePostRecord));

    assert.deepEqual(
        groupPostsByTag(sorted)
            .get("astro")
            ?.map((post) => post.slug),
        ["older"],
    );
    assert.deepEqual(
        groupPostsByYear(sorted).map(([year]) => year),
        ["2026", "2025"],
    );
    assert.deepEqual(
        groupPostsByMonth(sorted).map(([month]) => month),
        ["2026-04", "2025-12"],
    );
});

test("createAdjacentPostMap wires previous and next slugs", () => {
    const sorted = sortPostsByDateDesc(rawPosts.map(normalizePostRecord));
    const adjacency = createAdjacentPostMap(sorted);

    assert.equal(adjacency.get("newest")?.next?.slug, "older");
    assert.equal(adjacency.get("newest")?.previous, undefined);
    assert.equal(adjacency.get("older")?.previous?.slug, "newest");
    assert.equal(adjacency.get("older")?.next, undefined);
});

test("assertUniqueSlugs rejects duplicate slugs", () => {
    assert.throws(
        () =>
            assertUniqueSlugs([
                normalizePostRecord(rawPosts[0]),
                normalizePostRecord({
                    id: "dup",
                    data: {
                        title: "Duplicate",
                        slug: "older",
                        date: "2026-04-01",
                        tags: ["astro"],
                    },
                }),
            ]),
        /Duplicate post slug: older/,
    );
});
