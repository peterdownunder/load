"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Broadcaster = void 0;
const ws_1 = require("ws");
class Broadcaster {
    constructor() {
        this.wsServer = new ws_1.Server({
            port: 8088
        });
        this.wsServer.on('connection', (ws) => {
            this.onConnection();
        });
    }
    onConnection() {
    }
    onClose() {
    }
}
exports.Broadcaster = Broadcaster;
//# sourceMappingURL=broadcaster.js.map