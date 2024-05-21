import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import { z } from 'zod';
import { auth } from '../middleware/auth';
import { AppDataSource } from '../db/db';
import { Video } from '../db/entities/video.entity';
import { User } from '../db/entities/user.entity';

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
    const foundVid = await AppDataSource.manager.findOne(Video, { where: { url: url }, relations: ['author'] })
    if (foundVid === null) return c.json({ foundVid }, 404)
    return c.json({ foundVid }, 200);
  })

  .get('/by-user/:userID{[0-9]+}', async c => {
    const userID = c.req.param('userID')
    const videos = await AppDataSource.manager.find(Video, { where: { author: { id: parseInt(userID) } } })

    return c.json({ videos }, 200)
  })

  .post('/', auth, zValidator('json', addVideoDTO), async (c) => {
    const user = c.var.user
    const data = addVideoDTO.parse(await c.req.json())
    const author = await AppDataSource.manager.findOne(User, { where: { id: user.id } })

    const doc = new Video()
    doc.video = data.video
    doc.title = data.title
    doc.desc = data.desc || ""
    doc.url = data.url
    doc.views = 0
    // @ts-ignore
    doc.author = user
    doc.createdAt = new Date()

    if (!author!.videos) {
      author!.videos = [doc]
    }

    author!.videos.push(doc)

    try {
      const savedVideo = await AppDataSource.manager.save(doc)
      const savedUser = await AppDataSource.manager.save(author)
      return c.json({ savedVideo, savedUser }, 201);
    } catch (error) {
      console.log(error)
      return c.json({ "message": "ISE" }, 500)
    }
  })

  .delete('/:id{[0-9]+}', auth, zValidator('json', addVideoDTO), async (c) => {
    return c.json({ 'm': "wip" })
  })

  .patch("/like/:id{[0-9]+}/:isLiking", auth, async c => {
    const user = c.var.user
    const id = c.req.param('id')
    const isLiking = c.req.param('isLiking')
    const LikeActions = ["like", "dislike"]
    if (!LikeActions.includes(isLiking)) {
      return c.json({ "message": "Invalid action" })
    }

    if (isLiking === "like") {
      const videoDoc = await AppDataSource.manager.findOne(Video, { where: { id: parseInt(id) } })
      if (!videoDoc) return c.json({ "message": "Видео не найдено" }, 404)

      const userDoc = await AppDataSource.manager.findOne(User, { where: { id: user.id } })
      if (!userDoc) return c.redirect("/logout")

      if (!userDoc.likedVideos) {
        userDoc.likedVideos = [videoDoc]
      }

      userDoc.likedVideos.push(videoDoc)
      videoDoc.likes++

      const savedVid = await AppDataSource.manager.save(videoDoc)
      const savedUser = await AppDataSource.manager.save(userDoc)

      return c.json({ savedVid }, 201)
    } else {
      const videoDoc = await AppDataSource.manager.findOne(Video, { where: { id: parseInt(id) } })
      if (!videoDoc) return c.json({ "message": "Видео не найдено" }, 404)

      const userDoc = await AppDataSource.manager.findOne(User, { where: { id: user.id } })
      if (!userDoc) return c.redirect("/logout")

      if (!userDoc.likedVideos) {
        userDoc.likedVideos = [videoDoc]
      }

      userDoc.likedVideos = userDoc.likedVideos.filter(i => i !== videoDoc)
      videoDoc.likes--

      const savedVid = await AppDataSource.manager.save(videoDoc)
      const savedUser = await AppDataSource.manager.save(userDoc)

      return c.json({ savedVid }, 201)
    }
  })

  .patch("/view/:id{[0-9]+}", async c => {
    const videoID = c.req.param('id')
    const videoDoc = await AppDataSource.manager.findOne(Video, { where: { id: parseInt(videoID) } })
    if (!videoDoc) return c.json({ "message": "Видео не найдено" }, 404)
    videoDoc.views++

    const saved = await AppDataSource.manager.save(videoDoc)
    return c.json({ saved }, 201)
  })
