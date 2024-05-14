import { Hono } from 'hono';
import { VideoMocks } from '../types/video';
import { zValidator } from '@hono/zod-validator';

import { z } from 'zod';
import { auth } from '../middleware/auth';

const addVideoDTO = z.object({
  title: z.string().min(1).max(50),
  video: z.string().min(5).max(75),
  authorID: z.string(),
});

export const videosRoute = new Hono()
  .get('/', async (c) => {
    return c.json({ data: VideoMocks });
  })

  .get('/:id{[0-9]+}', async (c) => {
    const id = c.req.param('id');
    const foundVid = VideoMocks.find((v) => v.id === parseInt(id));
    if (!foundVid) return c.json({ message: 'not found' }, 404);
    return c.json({ data: foundVid });
  })

  .post('/', auth, zValidator('json', addVideoDTO), async (c) => {
    const newVid = c.req.valid('json');
    const user = c.var.user
    const doc = {
      ...newVid,
      id: VideoMocks.length + 1,
      authorID: user.id,
      views: 0,
    };
    VideoMocks.push({ ...doc });
    return c.json({ data: VideoMocks }, 201);
  })

  .delete('/:id{[0-9]+}', auth, zValidator('json', addVideoDTO), async (c) => {
    const id = c.req.param('id');
    const foundVid = VideoMocks.find((v) => v.id === parseInt(id));
    if (!foundVid) return c.json({ message: 'not found' }, 404);
    VideoMocks.filter((i) => i.id != parseInt(id));
    return c.json({ data: foundVid });
  });
