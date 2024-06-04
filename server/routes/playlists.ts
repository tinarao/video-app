import { Hono } from "hono";
import { auth } from "../middleware/auth";
import { zValidator } from "@hono/zod-validator";
import { nanoid } from 'nanoid';
import { createPlaylistDTO } from "../dto/playlists.dto";

export const playlistsRoute = new Hono()
    .get("/:userID{[0-9]+}", auth, async c => {
        const user = c.var.user;
        const userID = c.req.param('userID');

        const playlists = await prisma.playlist.findMany({
            where: { authorID: user.id },
            include: { videos: true }
        })
        if (playlists.length === 0) {
            return c.json({ playlists }, 404);
        }

        if (user.id !== parseInt(userID)) {
            const filteredPlaylists = playlists.filter(i => i.isPublic !== true);
            return c.json({ playlists: filteredPlaylists })
        }

        return c.json({ playlists })
    })

    .get("/my-playlists/:playlistURL", auth, async c => {
        const playlistURL = c.req.param('playlistURL');
        const user = c.var.user;
        const foundPlaylist = await prisma.playlist.findFirst({
            where: { url: playlistURL },
            include: { author: { select: { id: true, username: true, picture: true } } }
        })
        if (!foundPlaylist) {
            return c.text("Плейлист не найден", 404);
        }

        if (!user && !foundPlaylist.isPublic) {
            return c.text("Доступ запрещён", 403);
        }
        // TODO: Проверка пользователя:
        // если c.var.user.id !== playlist.author.id { return 403 }

        return c.json({ ...foundPlaylist });
    })

    .post("/", auth, zValidator('json', createPlaylistDTO), async c => {
        const user = c.var.user;
        const req = await c.req.json();
        const doc = await createPlaylistDTO.parseAsync(req);

        const userDoc = await prisma.user.findFirst({ where: { id: user.id } });
        if (!userDoc) {
            return c.json({ "message": "Bad request" }, 400);
        }

        const created = await prisma.playlist.create({
            data: {
                title: doc.title,
                isPublic: doc.isPublic,
                url: `pl-${nanoid(10)}`,
                author: {
                    connect: { id: userDoc.id }
                },
            }
        })

        return c.json({ ...doc })
    })