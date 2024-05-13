import { z } from 'zod';
export interface Video {
  id?: number;
  title: string;
  video: string;
  authorID: number;
  desc?: string;
  views?: number;
}

export const videoSchema = z.object({
  id: z.number().positive(),
  title: z.string().min(1).max(50),
  video: z.string().min(5).max(75),
  authorID: z.number().positive(),
  desc: z.optional(z.string()),
  views: z.number().positive()
})

export const videoArrSchema = z.array(videoSchema)

export const VideoMocks = [
  {
    id: 0,
    title: 'me at the zoo',
    video: 'https://www.youtube.com/watch?v=uEr3cyimPFw',
    views: 0,
  },
  {
    id: 1,
    title: 'another video',
    video: 'https://www.youtube.com/watch?v=uEr3cyimPFw',
    views: 0,
    authorID: 9,
  },
  {
    id: 2,
    title: 'very nice vid',
    video: 'https://www.youtube.com/watch?v=uEr3cyimPFw',
    views: 0,
    authorID: 10,
  },
  {
    id: 3,
    title: 'pipe festival',
    video: 'https://www.youtube.com/watch?v=uEr3cyimPFw',
    views: 0,
    authorID: 9,
  },
];
