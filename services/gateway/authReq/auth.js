import express from "express";
import { prisma } from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import { createClient } from "redis";

const authRouter = express.Router();

authRouter.use(express.json());
authRouter.use(express.urlencoded({ extended: true }));

authRouter.use(cookieParser());

const client = await createClient().on("error", (err) => console.log("Redis Client Error", err))
    .connect();

authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const dbQuery = await prisma.user.findUnique({
        where: {
            email: email
        }
    });
    
    if (dbQuery) {
        const comparision = bcrypt.compareSync(password, dbQuery.passwordHash);

        if (!comparision) {
            return res.sendStatus(402);
        }
        else {

            const role = dbQuery.role;

            const token = jwt.sign({ email, role }, process.env.JWT_SECRET, { expiresIn: "1m" });
            const refreshToken = jwt.sign({ email, role }, process.env.JWT_REFRESH_SECRET);

            await client.set(email, refreshToken, {
                EX: 7 * 24 * 60 * 60
            })


            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            await prisma.user.update({
                where: {
                    email: email
                },
                data: {
                    lastLogin: new Date,
                }
            })

            res.status(200).json({ token: token });
        }
    }
    else {
        res.sendStatus(403);
    }

})

authRouter.post("/register", async (req, res) => {
    const { email, password, role, name } = req.body;

    const dbQuery = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    if (dbQuery) {
        res.sendStatus(400)
    }
    else {
        const hash = bcrypt.hashSync(password, 10);
        const accessToken = jwt.sign({ email, role }, process.env.JWT_SECRET, { expiresIn: "1m" });
        const refreshToken = jwt.sign({ email, role }, process.env.JWT_REFRESH_SECRET);

        await client.set(email, refreshToken, {
            EX: 7 * 24 * 60 * 60
        });

        await prisma.user.create({
            data: {
                email: email,
                passwordHash: hash,
                name: name,
                role: role,
                updatedAt: new Date,
                lastLogin: new Date
            }
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ token: accessToken });
    }
});

authRouter.post('/refresh', async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json("Access Denied. No refresh token provided.");

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const storedToken = await client.get(decoded.email);

        if (storedToken !== refreshToken) {
            return res.sendStatus(403);
        }

        const newAccessToken = jwt.sign(
            { email: decoded.email, role: decoded.role },
            process.env.JWT_SECRET,
            { expiresIn: "1m" }
        );

        return res.json({ accessToken: newAccessToken });
    } catch (err) {
        return res.status(403).json("Invalid or expired refresh token.");
    }
});

authRouter.post('/logout', async (req, res) => {
    res.clearCookie('refreshToken');
    res.status(200).json("Logged out successfully.");
});

export default authRouter;