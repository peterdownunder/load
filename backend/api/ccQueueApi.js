"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ccQueueApi = void 0;
let fetch = require("node-fetch");
class ccQueueApi {
    constructor(serverUrl, logger) {
        this.serverUrl = serverUrl;
        this.logger = logger;
    }
    PlayPrompt(href, prompts) {
        return fetch(href, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(prompts)
        });
    }
    AnswerCall(href) {
        const body = {
            Modalities: [1],
            Prompts: []
        };
        return fetch(href, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
    }
    DropCall(href) {
        return fetch(href, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: {}
        });
    }
}
exports.ccQueueApi = ccQueueApi;
//# sourceMappingURL=ccQueueApi.js.map