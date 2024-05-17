import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import { z } from 'zod';
import { auth } from '../middleware/auth';
import { AppDataSource } from '../db/db';
import { Video } from '../db/entities/video.entity';

const addVideoDTO = z.object({
  title: z.string().min(1).max(50),
  video: z.string(),
  desc: z.optional(z.string())
});

interface RecievedVideoObject {
  title: string
  desc?: string
  video: string
  authorID: string
}

export const videosRoute = new Hono()
  .get('/', async (c) => {

    const vids = await AppDataSource.manager.find(Video)

    return c.json({ data: vids });
  })

  .get('/:id{[0-9]+}', async (c) => {
    const id = c.req.param('id');
    const foundVid = await AppDataSource.manager.findOne(Video, { where: { id: parseInt(id) } })
    return c.json({ data: foundVid });
  })

  .get('/:userID', async c => {
    const userID = c.req.param('userID')
    const videos = await AppDataSource.manager.find(Video, { where: { authorID: userID } })

    return c.json({ videos: videos })
  })

  .post('/', auth, zValidator('json', addVideoDTO), async (c) => {
    const user = c.var.user
    const data = addVideoDTO.parse(await c.req.json())

    const doc = new Video()
    doc.video = data.video
    doc.title = data.title
    doc.authorID = user.id
    doc.desc = data.desc || ""
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
