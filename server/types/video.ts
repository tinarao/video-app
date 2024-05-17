import { z } from 'zod';

export type VideoZ = z.infer<typeof videoSchema>;

export const videoSchema = z.object({
  id: z.number().positive(),
  title: z.string().min(1).max(50),
  video: z.string().min(5).max(75),
  views: z.number().positive(),
  authorID: z.string(),
  desc: z.optional(z.string()),
});

export const videoArrSchema = z.array(videoSchema);