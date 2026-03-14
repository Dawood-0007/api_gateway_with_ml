export const extractIP = (req, res, next) => {
    req.clientIP =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    req.start = performance.now();
    next();
};