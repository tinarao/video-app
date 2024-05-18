import { zValidator } from "@hono/zod-validator";
import { env } from "bun";
import { Hono } from "hono";
import { setCookie, getCookie, deleteCookie } from 'hono/cookie';
import { decode, sign, verify } from "hono/jwt";
import { AuthDTO } from "../dto/auth.dto";

import * as bcrypt from "bcrypt"
import { User } from "../db/entities/user.entity";
import { AppDataSource } from "../db/db";

export const authRoute = new Hono()
    .get("/me", async c => {
        // i am deeply sorry for this one
        const accessToken = getCookie(c, "access_token")
        const refreshToken = getCookie(c, "refresh_token")
        if (!accessToken || !refreshToken) {
            deleteCookie(c, "access_token")
            deleteCookie(c, "refresh_token")

            return c.json({ "message": "Bad request" }, 401)
        }

        let userID: string

        try {
            await verify(accessToken!, Bun.env.JWT_SECRET!)

            const decoded = decode(accessToken)
            userID = decoded.payload.userID
        } catch (error) {
            deleteCookie(c, "access_token")
            const decoded = decode(refreshToken)
            userID = decoded.payload.userID
        }

        const { password, ...user } = await AppDataSource.manager.findOne(User,
            {
                where: {
                    id: parseInt(userID)
                }
            }
        )
        if (!user) {
            return c.json({ "message": "Bad request" }, 400)
        }

        deleteCookie(c, "access_token")
        const newToken = await sign({
            "exp": Math.floor(Date.now() / 1000) + 60 * 20,
            "userID": user.id
        }, Bun.env.JWT_SECRET!)
        setCookie(c, "access_token", newToken, { httpOnly: true })

        return c.json({ user })
    })
    .post("/register", zValidator('json', AuthDTO), async c => {
        // register logic
        const { username, password: passwordNotHashed } = await c.req.json()

        const isUserExist = await AppDataSource.manager.findOne(User, { where: { username: username } })
        if (!!isUserExist) {
            return c.json({ "message": "User with such credentials already exist" }, 400)
        }

        const salt = await bcrypt.genSalt(10)
        const password = await bcrypt.hash(passwordNotHashed, salt)

        const user = new User()
        user.username = username
        user.password = password
        user.createdAt = new Date()

        const { password: hp, ...saved } = await AppDataSource.manager.save(user)

        return c.json({ ...saved }, 201)
    })
    .post("/login", zValidator('json', AuthDTO), async c => {

        const { username, password } = await c.req.json()
        const user = await AppDataSource.manager.findOne(User, { where: { username: username } })
        if (!user) {
            return c.json({ "message": "User does not exist" }, 404)
        }

        const isTruePassword = await bcrypt.compare(password, user.password)
        if (!isTruePassword) {
            return c.json({ "message": "Wrong credentials provided" }, 400)
        }

        const secret = Bun.env.JWT_SECRET
        const accessToken = await sign({
            "exp": Math.floor(Date.now() / 1000) + 60 * 20,
            "userID": user.id
        }, secret!)

        const refreshToken = await sign({
            "userID": user.id
        }, secret!)

        const { password: hashed, ...data } = user

        setCookie(c, "access_token", accessToken, { httpOnly: true })
        setCookie(c, "refresh_token", refreshToken, { httpOnly: true })

        return c.json({ data }, 200)
    })
    .get("/logout", async c => {
        deleteCookie(c, "access_token")
        deleteCookie(c, "refresh_token")

        return c.status(200)
    })