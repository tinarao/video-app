import { zValidator } from "@hono/zod-validator";
import { env } from "bun";
import { Hono } from "hono";
import { setCookie, getCookie, deleteCookie } from 'hono/cookie';
import { decode, sign, verify } from "hono/jwt";
import { LoginDTO, RegisterDTO } from "../dto/auth.dto";

import * as bcrypt from "bcrypt"
import prisma from "../prisma/db"

export const authRoute = new Hono()
    .get("/me", async c => {
        const accessToken = getCookie(c, "access_token");
        const refreshToken = getCookie(c, "refresh_token");
        if (!accessToken || !refreshToken) {
            deleteCookie(c, "access_token");
            deleteCookie(c, "refresh_token");

            return c.json({ "message": "Unauthorized" }, 401)
        }

        let userID: string

        try {
            // bun.verify кидает ошибку, если токен не проходит проверку
            // поэтому, чтобы всё дело работало, мне пришлось написать это уёбище
            await verify(accessToken!, Bun.env.JWT_SECRET!)

            const decoded = decode(accessToken)
            userID = decoded.payload.userID
        } catch (error) {
            deleteCookie(c, "access_token")
            const decoded = decode(refreshToken)
            userID = decoded.payload.userID
        }

        const userDoc = await prisma.user.findFirst({
            where: { id: parseInt(userID) },
            include: { videos: true }
        })
        if (!userDoc) {
            return c.json({ "message": "Bad request" }, 400)
        }

        deleteCookie(c, "access_token")
        const newToken = await sign({
            "exp": Math.floor(Date.now() / 1000) + 60 * 20,
            "userID": userDoc.id
        }, Bun.env.JWT_SECRET!)
        setCookie(c, "access_token", newToken, { httpOnly: true })

        const { password, ...user } = userDoc;
        return c.json({ user })

    })
    .post("/register", zValidator('json', RegisterDTO), async c => {
        try {
            const { username, password: passwordNotHashed, email } = await c.req.json()
            const isUserExist = await prisma.user.findFirst({
                where: { email: email }
            })
            if (!!isUserExist) {
                return c.json({ "message": "User with such credentials already exist" }, 400)
            }

            const salt = await bcrypt.genSalt(10)
            const password = await bcrypt.hash(passwordNotHashed, salt)

            const createdUser = await prisma.user.create({
                data: {
                    username: username,
                    email: email,
                    password: password,
                }
            })

            const { password: hp, ...saved } = createdUser;

            return c.json({ ...saved }, 201)
        } catch (error) {
            console.error(error);
            return c.json({ "message": "An error occured while registering a user" }, 500);
        }
    })
    .post("/login", zValidator('json', LoginDTO), async c => {
        try {
            const { username, password } = await c.req.json()
            const user = await prisma.user.findFirst({
                where: { username: username },
                select: { id: true, password: true },
            })
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
        } catch (error) {
            console.error(error);
            return c.json({ "message": "Internal server error" }, 500)
        }
    })
    .get("/logout", async c => {
        deleteCookie(c, "access_token")
        deleteCookie(c, "refresh_token")

        return c.status(200)
    })