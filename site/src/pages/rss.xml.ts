import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  const posts = await getCollection('writing', ({ data }) => !data.draft && Boolean(data.published));

  return rss({
    title: 'ex1te — Writing',
    description: 'Эссе, заметки и практические руководства Бакытжана.',
    site: context.site ?? 'https://ex1te.local',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.published!,
      link: `/writing/${post.id}/`,
    })),
  });
};
