import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import { z } from 'zod';
import { auth } from '../middleware/auth';
import type { Video } from '@prisma/client';

const addVideoDTO = z.object({
    title: z.string().min(1).max(50),
    video: z.string(),
    desc: z.optional(z.string()),
    url: z.string()
});

export const videosRoute = new Hono()
    .get("/", async c => {
        const videos = await prisma.video.findMany({
            take: 10
        });
        return c.json({ videos })
    })
    .get('/:url', async (c) => {
        const url = c.req.param('url');

        const foundVid = await prisma.video.findFirst({
            where: { url: url },
            include: { author: true }
        })

        if (foundVid === null) return c.json({ foundVid }, 404)
        return c.json({ foundVid }, 200);
    })

    .get('/by-user/:userID{[0-9]+}', async c => {
        const userID = c.req.param('userID')
        const videos = await prisma.video.findMany({
            where: { author: { id: parseInt(userID) } }
        })

        return c.json({ videos }, 200)
    })

    .post('/', auth, zValidator('json', addVideoDTO), async (c) => {
        const user = c.var.user
        const data = addVideoDTO.parse(await c.req.json())
        const author = await prisma.user.findFirst({
            where: { id: user.id },
            include: { videos: true }
        })
        if (!author) {
            return c.json({ "message": "Bad request" }, 401);
        }

        // create video
        // add video to author.videos

        const savedVideo = await prisma.video.create({
            data: {
                video: data.video,
                title: data.title,
                url: data.url,
                views: 0,
                authorID: author.id,
            }
        })

        const savedUser = await prisma.user.findFirst({
            where: { id: user.id },
            include: { videos: true }
        })

        return c.json({ savedVideo, savedUser });
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
            return c.json({ "message": "Invalid action" }, 400)
        }

        if (isLiking === "like") {
            const userDoc = await prisma.user.findFirst({
                where: { id: user.id },
            })
            if (!userDoc) {
                return c.redirect("/logout");
            }

            const videoDoc = await prisma.video.findFirst({
                where: { id: parseInt(id) }
            })
            if (!videoDoc) return c.json({ "message": "Видео не найдено" }, 404)

            await prisma.user.update({
                where: { id: user.id },
                data: { likedVideos: { connect: videoDoc } }
            })

            const updatedVideo = await prisma.video.update({
                where: { id: parseInt(id) },
                data: { likes: { increment: 1 }, likedBy: { connect: userDoc } }
            })

            return c.json({ updatedVideo }, 201)
        } else {
            // if dislike
            // 4 requests to db only to dislike a video
            // shiet

            const userDoc = await prisma.user.findFirst({
                where: { id: user.id },
                // include: { likedVideos: true }
            })
            if (!userDoc) {
                return c.redirect("/logout");
            }

            const videoDoc = await prisma.video.findFirst({
                where: { id: parseInt(id) }
            })
            if (!videoDoc) return c.json({ "message": "Видео не найдено" }, 404)

            await prisma.user.update({
                where: { id: user.id },
                data: { likedVideos: { disconnect: videoDoc } }
            })

            const updatedVideo = await prisma.video.update({
                where: { id: parseInt(id) },
                data: { likedBy: { disconnect: userDoc }, likes: { decrement: 1 } }
            })

            return c.json({ updatedVideo }, 201)
        }
    })

    .patch("/view/:id{[0-9]+}", async c => {
        const videoID = c.req.param('id')

        const videoDoc = await prisma.video.findFirst({
            where: { id: parseInt(videoID) },
            select: { id: true, views: true }
        })
        if (!videoDoc) return c.json({ "message": "Видео не найдено" }, 404)

        const updatedVideo = await prisma.video.update({
            where: { id: videoDoc.id },
            data: { views: { increment: 1 } }
        })

        return c.json({ updatedVideo }, 201)
    })

    .get("/liked/:userID", async c => {
        const userID = c.req.param('userID');

        const userDoc = await prisma.user.findFirst({
            where: { id: parseInt(userID) },
            include: { likedVideos: true }
        })
        if (!userDoc) {
            return c.json({}, 404)
        }

        return c.json({ videos: userDoc?.likedVideos })
    })
