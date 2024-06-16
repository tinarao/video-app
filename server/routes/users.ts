import { Hono } from "hono";
import prisma from "../prisma/db"
import { auth } from "../middleware/auth";
import { zValidator } from "@hono/zod-validator";
import { updateProfileDTO } from "../dto/user.dto";
import type { User } from "@prisma/client";

export const usersRoute = new Hono()
    .get("/by-username/:username", async c => {
        const usernameParam = c.req.param('username');
        const userDoc = await prisma.user.findFirst({
            where: { username: usernameParam },
            include: {
                playlists: { include: { videos: true } },
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
    .patch("/update-profile", auth, zValidator('json', updateProfileDTO), async c => {
        const user = c.var.user;
        const json = await c.req.json();
        const newData = updateProfileDTO.parse(json);

        const updated = await prisma.$transaction(
            async (tx) => {
                const usernameDuplicate = await tx.user.findFirst({
                    where: { username: newData.username }
                })
                if ((!!usernameDuplicate) && (usernameDuplicate.id !== user.id)) {
                    throw new Error("Пользователь с таким username уже существует.")
                }

                const updated = await tx.user.update({
                    where: { id: user.id },
                    data: {
                        bio: newData.bio,
                        username: newData.username,
                        given_name: newData.given_name,
                        family_name: newData.family_name,
                        picture: newData.picture
                    }
                })

                return updated
            }
        )

        return c.json(updated)
    })
    .patch("/subscribe/:subscriberID{[0-9]+}/:targetUserID{[0-9]+}", auth, async c => {
        const user = c.var.user;
        const subscriberID = parseInt(c.req.param('subscriberID'));
        const targetUserID = parseInt(c.req.param('targetUserID'));

        try {
            const updatedTargetUser = await prisma.$transaction(async tx => {
                const target = await tx.user.findFirst({
                    where: { id: targetUserID },
                    select: { id: true, username: true }
                })
                if (!target) throw new Error("target-not-found");

                // push sub to target arr
                const updatedTarget = await tx.user.update({
                    where: { id: target.id },
                    data: { subscribers: { connect: { id: user.id } } }
                })

                await tx.user.update({
                    where: { id: user.id },
                    data: { subscribedTo: { connect: { id: target.id } } }
                })

                return updatedTarget;
            })

            return c.json(updatedTargetUser)
        } catch (error) {
            switch ((error as Error).message) {
                case "target-not-found":
                    return c.text("Целевой пользователь не найден", 404);
                default:
                    return c.text("Внутренняя ошибка сервера", 500);
            }
        }
    })