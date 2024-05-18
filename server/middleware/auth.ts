import { createMiddleware } from "hono/factory"
import { deleteCookie, getCookie } from "hono/cookie"
import { decode, verify } from "hono/jwt"
import { AppDataSource } from "../db/db"
import type { User as UserWoPassword } from "../../frontend/src/types/user"
import { User } from "../db/entities/user.entity"

type Env = {
    Variables: {
        user: UserWoPassword
    }
}

export const auth = createMiddleware<Env>(async (c, next) => {
    try {
        const accessToken = getCookie(c, "access_token")
        const refreshToken = getCookie(c, "refresh_token")
        if (!accessToken || !refreshToken) {
            deleteCookie(c, "access_token")
            deleteCookie(c, "refresh_token")

            return c.json({ "message": "Bad request" }, 403)
        }

        const isValidRefresh = await verify(refreshToken, Bun.env.JWT_SECRET!)
        const isValidAccess = await verify(accessToken, Bun.env.JWT_SECRET!)
        if (!isValidAccess || !isValidRefresh) {
            deleteCookie(c, "access_token")
            deleteCookie(c, "refresh_token")

            return c.json({ "message": "Bad request" }, 403)
        }

        const decodedAT = decode(accessToken)
        const decodedRT = decode(refreshToken)

        const userIdAT: string = decodedAT.payload.userID
        const userIdRT: string = decodedRT.payload.userID

        if (userIdAT !== userIdRT) {
            deleteCookie(c, "access_token")
            deleteCookie(c, "refresh_token")

            return c.json({ "message": "Bad request" }, 403)
        }

        const { password, ...user } = await AppDataSource.manager.findOne(User, {
            where: {
                id: parseInt(userIdAT)
            }
        })

        if (!user) {
            deleteCookie(c, "access_token")
            deleteCookie(c, "refresh_token")

            return c.json({ "message": "Bad request" }, 403)
        }

        c.set("user", user)
        await next()

    } catch (error) {
        console.error(error)
        return c.json({ "message": "Unauthorized" }, 401)
    }
})