import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import { z } from 'zod';
import { auth } from '../middleware/auth';
import { AppDataSource } from '../db/db';
import { Video } from '../db/entities/video.entity';

const addVideoDTO = z.object({
  title: z.string().min(1).max(50),
  video: z.string(),
  desc: z.optional(z.string()),
  url: z.string()
});

export const videosRoute = new Hono()
  .get('/', async (c) => {

    const vids = await AppDataSource.manager.find(Video)

    return c.json({ data: vids });
  })

  .get('/:url', async (c) => {
    const url = c.req.param('url');
    console.log("hear")
    const foundVid = await AppDataSource.manager.findOne(Video, { where: { url: url } })
    return c.json({ ...foundVid });
  })

  .get('/by-user/:userID{[0-9]+}', async c => {
    const userID = c.req.param('userID')
    const videos = await AppDataSource.manager.find(Video, { where: { author: { id: parseInt(userID) } } })

    return c.json({ videos }, 200)
  })

  .post('/', auth, zValidator('json', addVideoDTO), async (c) => {
    const user = c.var.user
    const data = addVideoDTO.parse(await c.req.json())

    const doc = new Video()
    doc.video = data.video
    doc.title = data.title
    doc.desc = data.desc || ""
    doc.url = data.url
    doc.views = 0
    doc.createdAt = new Date()

    try {
      const saved = await AppDataSource.manager.save(doc)
      return c.json({ saved }, 201);
    } catch (error) {
      return c.json({ "message": "ISE" }, 500)
    }
  })

  .delete('/:id{[0-9]+}', auth, zValidator('json', addVideoDTO), async (c) => {
    return c.json({ 'm': "wip" })
  });
