"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLoggerMiddleware = void 0;
const requestLoggerMiddleware = (req, resp, next) => {
    console.info(`${req.method} ${req.originalUrl} ${req.headers}`);
    const start = new Date().getTime();
    resp.on('finish', () => {
        const elapsed = new Date().getTime() - start;
        console.info(`${req.method} ${req.originalUrl} Status:${resp.statusCode} ${elapsed}ms`);
    });
    next();
};
exports.requestLoggerMiddleware = requestLoggerMiddleware;
//# sourceMappingURL=request.logger.middleware.js.map