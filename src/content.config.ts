import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

const isoDate = z
	.string()
	.regex(isoDatePattern, 'Date must use YYYY-MM-DD format')
	.refine((value) => {
		const date = new Date(`${value}T00:00:00.000Z`);
		return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
	}, 'Date must be a valid calendar date')
	.transform((value) => new Date(`${value}T00:00:00.000Z`));

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: isoDate,
			updatedDate: isoDate.optional(),
			heroImage: z.optional(image()),
			category: z.string().optional(),
		}).superRefine(({ pubDate, updatedDate }, context) => {
			if (updatedDate && updatedDate < pubDate) {
				context.addIssue({
					code: 'custom',
					message: 'updatedDate must not be earlier than pubDate',
					path: ['updatedDate'],
				});
			}
		}),
});

export const collections = { blog };
