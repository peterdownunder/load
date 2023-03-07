"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassThruApi = void 0;
let fetch = require("node-fetch");
class PassThruApi {
    constructor(serverUrl, logger) {
        this.serverUrl = serverUrl;
        this.logger = logger;
    }
    AnswerCall(href) {
        const body = {
            Modalities: [1],
            Prompts: []
        };
        return fetch(href, {
            method: 'POST',
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
    CancelMedia(href) {
        fetch(href, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: ('""')
        }).then((resp) => {
            this.logger.log('info', {
                url: href,
                action: 'CancelMedia',
                httpstatus: resp.status,
            });
        }).catch((err) => {
            console.log(err);
        });
    }
    SubscribeDTMF(href) {
        return fetch(href, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: {}
        });
    }
    AnnounceCall(href, prompts) {
        return fetch(href, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(prompts)
        });
    }
}
exports.PassThruApi = PassThruApi;
exports.default = PassThruApi;
//# sourceMappingURL=passthru.api.js.map