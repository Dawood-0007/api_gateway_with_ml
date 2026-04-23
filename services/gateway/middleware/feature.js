import { createClient } from "redis";
import { prisma } from "../lib/prisma.js";

const redis = await createClient().on("error", (err) => console.log("Redis Client Error", err))
    .connect();

const sensitiveEndpoints = ["/api/auth/login", "/api/auth/register", "/api/auth/refresh", "/api/data"]

const methodMap = {
    GET: 0,
    POST: 1,
    PUT: 2,
    DELETE: 3
};

export const featureExtraction = async (req, res, next) => {
    const ip = req.clientIP;
    const endpoint = req.path;

    if (sensitiveEndpoints.includes(endpoint)) {
        const result = await prisma.blockedIP.findUnique({
            where: {
                ip: ip
            }
        });

        if (result) {
            req.blocked = true;
        }
        else {
            const email = req.body.email ? req.body.email : "";
            if (email.replaceAll(" ", "").toLowerCase().includes("\'or1=1") || email.replaceAll(" ", "").toLowerCase().includes('\"or1=1')) {
                req.injection = true;
            }
        }

    }

    const key = `ip:${ip}:count`;

    await redis.incr(key);
    await redis.expire(key, 10);

    // const loginAttempt = `ip:${ip}:login:total`;
    // const failedAttempt = `ip:${ip}:login:failed`;
    // await redis.incr(`ip:${ip}:login_total`);

    // if (loginFailed) {
    //     await redis.incr(`ip:${ip}:login_failed`);
    // }

    // const total = await redis.get(`ip:${ip}:login_total`);
    // const failed = await redis.get(`ip:${ip}:login_failed`);

    // const failed_login_ratio = failed / total;

    const rate = await redis.get(key);

    const last = await redis.get(`ip:${ip}:last_request`);
    const now = Date.now();

    let avg_time_between_requests = 0;

    if (last) {
        avg_time_between_requests = (now - last) / 1000;
    }

    await redis.set(`ip:${ip}:last_request`, now);

    await redis.sAdd(`ip:${ip}:endpoints`, endpoint);
    await redis.expire(`ip:${ip}:endpoints`, 30);

    const unique_endpoints = await redis.sCard(`ip:${ip}:endpoints`);

    req.features = {
        ip_request_rate: Number(rate),
        method_encoded: methodMap[req.method],
        avg_time_between_requests: avg_time_between_requests,
        unique_endpoints: unique_endpoints,
        is_sensitive_endpoint: sensitiveEndpoints.includes(endpoint) ? 1 : 0
    };

    next();
};