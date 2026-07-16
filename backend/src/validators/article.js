const { z } = require('zod');

module.exports = z.object({
  title: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Slug invalide'),
  content: z.string().optional(),
  featuredImageUrl: z.string().optional(), // sera ignoré si upload fichier
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});