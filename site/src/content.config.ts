import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const language = z.enum(['ru', 'en', 'kk']);
const common = z.object({
  title: z.string(),
  description: z.string(),
  lang: language,
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  updated: z.coerce.date().optional(),
});

const writing = defineCollection({
  loader: glob({ base: './src/content/writing', pattern: '**/*.{md,mdx}' }),
  schema: common.extend({
    kind: z.enum(['essay', 'note', 'guide']),
    published: z.coerce.date().optional(),
    startHere: z.boolean().default(false),
  }).refine((entry) => entry.draft || entry.published, {
    message: 'Published writing requires a published date.',
    path: ['published'],
  }),
});

const lab = defineCollection({
  loader: glob({ base: './src/content/lab', pattern: '**/*.{md,mdx}' }),
  schema: common.extend({
    status: z.enum(['active', 'paused', 'complete']),
    started: z.coerce.date().optional(),
    repo: z.url().nullable().optional(),
    demo: z.url().nullable().optional(),
  }).refine((entry) => entry.draft || entry.started, {
    message: 'Published lab entries require a started date.',
    path: ['started'],
  }),
});

const projectMetric = z.object({
  value: z.string(),
  label: z.string(),
});

const projectFlowStep = z.object({
  label: z.string(),
  detail: z.string(),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: common.extend({
    status: z.enum(['active', 'maintenance', 'archived']),
    started: z.coerce.date().optional(),
    repo: z.url().nullable().optional(),
    demo: z.url().nullable().optional(),
    visibility: z.enum(['local', 'private', 'public']).default('local'),
    stack: z.array(z.string()).default([]),
    metrics: z.array(projectMetric).default([]),
    flow: z.array(projectFlowStep).default([]),
    cover: z.string().startsWith('/').optional(),
    coverAlt: z.string().optional(),
    coverCaption: z.string().optional(),
    note: z.string().optional(),
  }).refine((entry) => entry.draft || entry.started, {
    message: 'Published projects require a started date.',
    path: ['started'],
  }),
});

export const collections = { writing, lab, projects };
