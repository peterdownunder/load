"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notifier = void 0;
const rxjs_1 = require("rxjs");
class Notifier {
    constructor(logger) {
        this.logger = logger;
        this.QueueState = new rxjs_1.Subject();
        this.AnnounceState = new rxjs_1.Subject();
        this.NewCallEvent = new rxjs_1.Subject();
        this.BotEvent = new rxjs_1.Subject();
        this.DtmfEvent = new rxjs_1.Subject();
        this.CallQueued = new rxjs_1.Subject();
        this.CallTerminated = new rxjs_1.Subject();
        this.AnnounceStatus = new rxjs_1.Subject();
        this.SipEvents = new rxjs_1.Subject();
        this.DtmfKeyPress = new rxjs_1.Subject();
        this.WaveRequest = new rxjs_1.Subject();
    }
}
exports.Notifier = Notifier;
exports.default = Notifier;
//# sourceMappingURL=notifier.js.map