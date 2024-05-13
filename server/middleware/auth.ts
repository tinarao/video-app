import { createMiddleware } from "hono/factory"
import { kindeClient, sessionManager } from "../config/auth";
import type { UserType } from "@kinde-oss/kinde-typescript-sdk";

type Env = {
    Variables: {
        user: UserType
    }
}

export const auth = createMiddleware<Env>(async (c, next) => {
    try {
        const isAuthenticated = await kindeClient.isAuthenticated(sessionManager(c)); // Boolean: true or false
        if (!isAuthenticated) {
            return c.json({ "message": "Unauthorized" }, 401)
        }
        const user = await kindeClient.getUserProfile(sessionManager(c))
        c.set("user", user)

        await next()
    } catch (error) {
        console.error(error)
        return c.json({ "message": "Unauthorized" }, 401)
    }
})