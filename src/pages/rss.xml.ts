import type { APIContext } from 'astro';
import rss from '@astrojs/rss';
import { siteConfig } from '../config';
import { getSortedBlogPosts } from '../lib/posts';

export async function GET(context: APIContext) {
  const posts = await getSortedBlogPosts();
  return rss({
    title: siteConfig.site.title,
    description: siteConfig.site.description,
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
    })),
  });
}
