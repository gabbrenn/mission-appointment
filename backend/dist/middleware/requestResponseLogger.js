"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestResponseLogger = requestResponseLogger;
const SENSITIVE_KEYS = [
    "password",
    "token",
    "authorization",
    "refreshToken",
    "accessToken",
    "secret",
    "apiKey",
];
function shouldLogHttp() {
    if (process.env.HTTP_LOGS === "true")
        return true;
    if (process.env.HTTP_LOGS === "false")
        return false;
    return process.env.NODE_ENV !== "production";
}
function maskSensitive(input) {
    if (!input || typeof input !== "object")
        return input;
    if (Array.isArray(input)) {
        return input.map(maskSensitive);
    }
    const obj = input;
    const masked = {};
    for (const [key, value] of Object.entries(obj)) {
        const isSensitive = SENSITIVE_KEYS.some((sensitive) => key.toLowerCase().includes(sensitive.toLowerCase()));
        if (isSensitive) {
            masked[key] = "***";
            continue;
        }
        masked[key] = maskSensitive(value);
    }
    return masked;
}
function pickHeaders(headers) {
    const selected = {
        "content-type": headers["content-type"],
        "user-agent": headers["user-agent"],
        authorization: headers.authorization,
        host: headers.host,
        origin: headers.origin,
        referer: headers.referer,
    };
    return maskSensitive(selected);
}
function requestResponseLogger(req, res, next) {
    if (!shouldLogHttp()) {
        next();
        return;
    }
    const startedAt = Date.now();
    const requestId = `${startedAt}-${Math.random().toString(36).slice(2, 8)}`;
    let responseBody;
    const originalJson = res.json.bind(res);
    const originalSend = res.send.bind(res);
    res.json = ((body) => {
        responseBody = body;
        return originalJson(body);
    });
    res.send = ((body) => {
        if (responseBody === undefined) {
            responseBody = body;
        }
        return originalSend(body);
    });
    console.log("\n[HTTP REQUEST]");
    console.log({
        requestId,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        headers: pickHeaders(req.headers),
        query: maskSensitive(req.query),
        params: maskSensitive(req.params),
        body: maskSensitive(req.body),
    });
    res.on("finish", () => {
        const durationMs = Date.now() - startedAt;
        console.log("[HTTP RESPONSE]");
        console.log({
            requestId,
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            durationMs,
            response: maskSensitive(responseBody),
        });
    });
    next();
}
