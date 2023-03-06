"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventController = void 0;
let fetch = require("node-fetch");
const call_1 = require("./call");
class EventController {
    constructor(logger, notifier, serverUrl) {
        this.logger = logger;
        this.notifier = notifier;
        this.calls = new Array();
        this.notifier.BotEvent.subscribe((queueStatus) => {
            this.onBotEvent(queueStatus);
        });
        // this.notifier.DtmfKey.subscribe((keyPress: DtmfKeyPress) => {
        //     this.onDtmfKeyPress (keyPress);
        // });
    }
    onBotEvent(status) {
        const call = this.calls.find(c => c.ScenarioId == status.CallState.Id);
        if (call) {
            this.logger.log('info', {
                message: {
                    state: 'onBotEvent for existing call'
                }
            });
        }
        else {
            const newCall = new call_1.Call(this.logger, status.CallState.Id, '');
            //         newCall.AnswerCall(status)
            this.calls.push(newCall);
            this.logger.log('info', {
                message: {
                    state: 'Request answer of new bot call'
                }
            });
        }
    }
}
exports.EventController = EventController;
EventController.CreateAsync = async (logger, notifier, serverUrl) => {
    let resp = await fetch(`${serverUrl}/teams/queues`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    const queues = await resp.json();
    logger.log('info', {
        queues: queues,
    });
    const resistration = await fetch(`${serverUrl}/register/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            callbackUrl: "http://localhost:8879",
            callBackId: "C127C802-B71C-48C1-A88C-26C805B37ADD",
            queues: queues
        })
    });
    logger.log('info', {
        result: {
            callbackUrl: "http://localhost:8879",
            callBackId: "C127C802-B71C-48C1-A88C-26C805B37ADD",
            queues: queues
        },
    });
    return new EventController(logger, notifier, serverUrl);
};
//# sourceMappingURL=EventController.js.map