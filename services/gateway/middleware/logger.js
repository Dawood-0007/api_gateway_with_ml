import { prisma } from "../lib/prisma.js";
import geoip from "geoip-lite";

export const requestLogger = async (req, res, next) => {
    const ip = req.clientIP;
    const geo = geoip.lookup(ip);
    const status = req.attack ? 403: 200;
    const start = req.start;

    const duration = performance.now() - start;

    let country = "Unknown";
    if (ip === '::1' || ip === '127.0.0.1' || ip === "::ffff:127.0.0.1") {
        country = "Localhost";
    } else if (geo) {
        country = geo.country;
    }

    await prisma.requestLog.create({
        data: {
            ip: ip,
            endpoint: req.path,
            method: req.method,
            country: country,
            statusCode: status,
            responseTime: duration,
            anomalyScore: req.anomalyScore,
            isMalicious: req.attack,
            requestCount: 1
        }
    });

    if (req.attack) {
        return res.status(403).json({
            message: "Blocked: suspicious traffic detected"
        });
    }

    next();
};