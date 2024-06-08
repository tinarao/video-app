import { Hono } from "hono";

export const usersRoute = new Hono()
    .get("/:username", async c => {
        const usernameParam = c.req.param('username');
        const userDoc = await prisma.user.findFirst({
            where: { username: usernameParam },
            include: {
                playlists: true,
                videos: true,
                likedVideos: true,
                subscribedTo: { select: { id: true, username: true, picture: true } },
                subscribers: { select: { id: true, username: true, picture: true } }
            },
        });
        if (!userDoc) return c.text("Пользователь не найден", 404);

        const { password, ...user } = userDoc;

        return c.json(user, 200);
    })