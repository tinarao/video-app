import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import { z } from 'zod';
import { auth } from '../middleware/auth';

const addVideoDTO = z.object({
    title: z.string().min(1).max(50),
    desc: z.optional(z.string()),
    url: z.string(),
    video: z.string(),
    tags: z.array(z.string()),
    category: z.string().min(1).max(30)
});

export const videosRoute = new Hono()
    .get("/", async c => {
        const videos = await prisma.video.findMany({
            take: 10,
            where: { isHidden: false }
        });
        return c.json({ videos })
    })
    .get("/all", async c => {
        // Debug-only route. delete
        const videos = await prisma.video.findMany();
        return c.json(videos)
    })
    .get('/:url', async (c) => {
        const url = c.req.param('url');

        const foundVid = await prisma.video.findFirst({
            where: { url: url },
            include: { author: { select: { id: true, username: true, picture: true } } }
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

    .patch("/access/:videoID{[0-9]+}/:action", auth, async c => {
        const user = c.var.user;
        const action = c.req.param('action');
        const actionsArr = ["hide", "show"]
        const videoID = parseInt(c.req.param('videoID'));

        if (!actionsArr.includes(action)) {
            return c.json({ "message": "Invalid action" }, 400);
        }

        const videoDoc = await prisma.video.findFirst({
            where: { id: videoID }
        })
        if (!videoDoc) return c.json({ "message": "Видео не найдено" }, 404)

        if (videoDoc.authorID !== user.id) {
            return c.json({ "message": "Forbidden" }, 403);
        }

        const isH = action === "show" ? false : true;

        const updatedVideoDoc = await prisma.video.update({
            where: { id: videoDoc.id },
            data: { isHidden: isH }
        })

        return c.json({ updatedVideoDoc }, 201);

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

        const savedVideo = await prisma.video.create({
            data: {
                video: data.video,
                title: data.title,
                url: data.url,
                views: 0,
                authorID: author.id,
                category: data.category,
                tags: data.tags,
            },
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
        let action = c.req.param('isLiking')
        const LikeActions = ["like", "dislike"]
        if (!LikeActions.includes(action)) {
            return c.json({ "message": "Invalid action" }, 400)
        }

        const [userDoc, videoDoc] = await prisma.$transaction([
            prisma.user.findFirst({
                where: { id: user.id },
                include: { likedVideos: true }
            }),
            prisma.video.findFirst({
                where: { id: parseInt(id) },
            }),
        ])
        if (!userDoc || !videoDoc) {
            return c.text("Пользователь и/или видео не найдены.", 404);
        }


        if (action === "like") {
            userDoc.likedVideos.forEach(v => {
                if (v.id === videoDoc.id) {
                    action === "dislike"
                }
            })

            const [updatedUser, updatedVideo] = await prisma.$transaction([
                prisma.user.update({
                    where: { id: user.id },
                    data: { likedVideos: { connect: { id: videoDoc.id } } }
                }),
                prisma.video.update({
                    where: { id: parseInt(id) },
                    data: { likes: { increment: 1 }, likedBy: { connect: { id: userDoc.id } } }
                })
            ])

            return c.json({ updatedVideo }, 201)
        } else {
            const [updatedUser, updatedVideo] = await prisma.$transaction([
                prisma.user.update({
                    where: { id: user.id },
                    data: { likedVideos: { disconnect: { id: videoDoc.id } } }
                }),
                prisma.video.update({
                    where: { id: parseInt(id) },
                    data: { likedBy: { disconnect: { id: userDoc.id } }, likes: { decrement: 1 } }
                })
            ])

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
            include: { likedVideos: { where: { isHidden: true } } }
        })
        if (!userDoc) {
            return c.json({}, 404)
        }

        return c.json({ videos: userDoc?.likedVideos })
    })
