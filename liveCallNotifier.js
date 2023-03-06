"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveCallNotifier = void 0;
class LiveCallNotifier {
    constructor() {
    }
    static getInstance() {
        return LiveCallNotifier._instance;
    }
    createConnection(io, logger) {
        this.logger = logger;
        this.io = io;
        io.on('connection', (socket) => {
            socket.on('disconnect', () => {
                this.logger?.error('socketio user disconnected');
            });
        });
        io.on('imhere', (client) => {
            this.logger?.error(`client ${client.name}`);
        });
    }
    testStatusNotify(testData) {
        this.io.emit('testrogress', testData);
    }
    sendNewCallInfo(callData) {
        this.io.emit('callinitiate', callData);
    }
    sendCallNotify(callData) {
        this.io.emit('liveupdate', callData);
    }
}
exports.LiveCallNotifier = LiveCallNotifier;
LiveCallNotifier._instance = new LiveCallNotifier();
//# sourceMappingURL=liveCallNotifier.js.map