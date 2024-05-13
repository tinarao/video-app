import { Hono } from 'hono';
import { VideoMocks } from '../types/video';
import { zValidator } from '@hono/zod-validator'

import { ZodError, z } from 'zod';

const addVideoDTO = z.object({
    title: z.string().min(1).max(50),
    video: z.string().min(5).max(75),
    authorID: z.number().positive(),
});

export const videosRoute = new Hono()
    .get('/', async c => {
        return c.json({ data: VideoMocks });
    })

    .get("/:id{[0-9]+}", async c => {
        const id = c.req.param("id")
        const foundVid = VideoMocks.find(v => v.id === parseInt(id))
        if (!foundVid) return c.json({ "message": "not found" }, 404)
        return c.json({ data: foundVid })
    })

    .post('/', zValidator("json", addVideoDTO), async c => {
        const newVid = c.req.valid("json");
        const doc = { ...newVid, id: VideoMocks.length + 1, authorID: VideoMocks.length + 1, views: 0 }
        VideoMocks.push({ ...doc })
        return c.json({ data: VideoMocks }, 201);
    })

    .delete("/:id{[0-9]+}", zValidator("json", addVideoDTO), async c => {
        const id = c.req.param("id")
        const foundVid = VideoMocks.find(v => v.id === parseInt(id))
        if (!foundVid) return c.json({ "message": "not found" }, 404)
        VideoMocks.filter(i => i.id != parseInt(id))
        return c.json({ data: foundVid })
    })
