import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { siteConfig } from '../config';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');
  return rss({
    title: siteConfig.site.title,
    description: siteConfig.site.description,
    site: context.site!,
    items: posts.map((post) => ({
      ...post.data,
      link: `/blog/${post.id}/`,
    })),
  });
}
