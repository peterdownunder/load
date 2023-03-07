"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ccNotifier = void 0;
const rxjs_1 = require("rxjs");
class ccNotifier {
    constructor(logger) {
        this.logger = logger;
        this.QueueState = new rxjs_1.Subject();
        this.AnnounceState = new rxjs_1.Subject();
        this.NewCallEvent = new rxjs_1.Subject();
        this.CallQueued = new rxjs_1.Subject();
        this.CallTerminated = new rxjs_1.Subject();
    }
}
exports.ccNotifier = ccNotifier;
exports.default = ccNotifier;
//# sourceMappingURL=ccNotifier.js.map