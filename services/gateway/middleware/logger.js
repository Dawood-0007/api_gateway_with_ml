import { prisma } from "../lib/prisma.js";
import geoip from "geoip-lite";

export const requestLogger = async (req, res, next) => {
    const ip = req.clientIP;
    const geo = geoip.lookup(ip);
    const status = req.attack ? req.injection ? 403 : 500 : 200;
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
        await prisma.blockedIP.create({
            data: {
              ip: ip,
              reason: req.injection ? "SQL Injection Detected" : "Malicious Request Detected"
            }
        });

        return res.status(status).json({
            message: "Blocked: suspicious traffic detected"
        });
    }

    next();
};