"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionInfo = void 0;
class SubscriptionInfo {
    constructor(webhook, subscriptionId, autoAnswer, upns, queues, mainUpn) {
        this.webhook = webhook;
        this.subscriptionId = subscriptionId;
        this.autoAnswer = autoAnswer;
        this.upns = upns;
        this.queues = queues;
        this.mainUpn = mainUpn;
    }
}
exports.SubscriptionInfo = SubscriptionInfo;
exports.default = SubscriptionInfo;
//# sourceMappingURL=subscriber.js.map