import { Hono } from "hono";
import { auth } from "../middleware/auth";
import { zValidator } from "@hono/zod-validator";
import { nanoid } from 'nanoid';
import { addVideoDTO, createPlaylistDTO } from "../dto/playlists.dto";

export const playlistsRoute = new Hono()
    .get("/:userID{[0-9]+}", async c => {
        const userID = c.req.param('userID');

        const playlists = await prisma.playlist.findMany({
            where: { authorID: parseInt(userID) },
            include: { videos: true }
        })
        if (playlists.length === 0) {
            return c.json({ playlists }, 404);
        }

        const filteredPlaylists = playlists.filter(i => i.isPublic !== true);

        return c.json({ playlists: filteredPlaylists })
    })

    .get("/playlist-id/:playlistUrl", async c => {
        const playlistId = c.req.param('playlistUrl');
        const playlist = await prisma.playlist.findFirst({
            where: { url: playlistId },
            include: {
                videos: {
                    include: {
                        author: {
                            select: { username: true, id: true, picture: true }
                        }
                    }
                },
                author: {
                    select: { username: true, id: true, picture: true }
                }
            }
        })

        if (!playlist) return c.text('Плейлист не найден', 404)
        return c.json(playlist)
    })

    .get("/my-playlists/:playlistURL", auth, async c => {
        const playlistURL = c.req.param('playlistURL');
        const user = c.var.user;
        const foundPlaylist = await prisma.playlist.findFirst({
            where: { url: playlistURL },
            include: {
                author: { select: { id: true, username: true, picture: true } },
                videos: { include: { author: { select: { username: true, picture: true, id: true } } } }
            }
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

        return c.json({ url: created.url })
    })

    .post("/add-to-playlist", auth, zValidator('json', addVideoDTO), async c => {
        const user = c.var.user;
        const body = await c.req.json();
        const data = addVideoDTO.parse(body);

        const thisPlaylist = await prisma.playlist.findFirst({
            where: { id: data.playlistID },
            include: { videos: true, author: true }
        })
        if (!thisPlaylist) {
            return c.text("Плейлист не найден!", 404);
        }
        if (user.id !== thisPlaylist.author.id) {
            return c.text("Доступ запрещён!", 403);
        }
        for (let i = 0; i < thisPlaylist.videos.length; i++) {
            if (thisPlaylist.videos[i].id === data.videoID) {
                return c.text("Видео уже добавлено в этот плейлист!", 400);
            }
        }

        const updatedPlaylist = await prisma.playlist.update({
            where: { id: data.playlistID },
            data: { videos: { connect: { id: data.videoID } } }
        });

        return c.json({ updated: updatedPlaylist });
    })

    .delete("/:playlistID{[0-9]+}", auth, async c => {
        const user = c.var.user;
        const playlistID = c.req.param('playlistID');

        const playlist = await prisma.playlist.findFirst({
            where: { id: parseInt(playlistID) },
            select: { author: true }
        })
        if (!playlist) {
            return c.text("Видео не найдено", 404);
        }

        if (user.id !== playlist.author.id) {
            return c.text("Доступ запрещён", 403);
        }

        const deleted = await prisma.playlist.delete({
            where: { id: parseInt(playlistID) }
        })

        return c.json({ deleted }, 200);

    })