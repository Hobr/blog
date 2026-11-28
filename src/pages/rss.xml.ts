import rss from "@astrojs/rss";
import { defaultLocale } from "../i18n/config";
import { getDictionary } from "../i18n/dictionary";
import { siteDescription } from "../data/profile";
import { getAllPosts } from "../lib/posts";

export async function GET(context: { site: URL }) {
  const posts = await getAllPosts();
  const brandName = getDictionary(defaultLocale).brand.name;

  return rss({
    title: brandName,
    description: siteDescription,
    site: context.site,
    customData: "<language>zh-CN</language>",
    items: posts.map((post) => ({
      title: post.title,
      pubDate: post.publishedAt,
      link: `/blog/${post.slug}/`,
    })),
  });
}
