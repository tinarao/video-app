import { z } from 'zod';

export type Video = z.infer<typeof videoSchema>;

export const videoSchema = z.object({
  id: z.number().positive(),
  title: z.string().min(1).max(50),
  video: z.string().min(5).max(75),
  views: z.number().positive(),
  authorID: z.string(),
  desc: z.optional(z.string()),
});

export const videoArrSchema = z.array(videoSchema);

export const VideoMocks: Video[] = [
  {
    id: 0,
    title: 'me at the zoo',
    video: 'https://www.youtube.com/watch?v=uEr3cyimPFw',
    views: 0,
    authorID: "1",
  },
  {
    id: 1,
    title: 'another video',
    video: 'https://www.youtube.com/watch?v=uEr3cyimPFw',
    views: 0,
    authorID: "1",
  },
  {
    id: 2,
    title: 'very nice vid',
    video: 'https://www.youtube.com/watch?v=uEr3cyimPFw',
    views: 0,
    authorID: "1",
  },
  {
    id: 3,
    title: 'pipe festival',
    video: 'https://www.youtube.com/watch?v=uEr3cyimPFw',
    views: 0,
    authorID: "1",
  },
];