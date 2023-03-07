"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamsPassThruController = void 0;
const express = __importStar(require("express"));
const passthru_event_1 = require("../dto/passthru.event");
const types_1 = require("../dto/types");
class TeamsPassThruController {
    constructor(logger, notifier) {
        this.logger = logger;
        this.notifier = notifier;
        this.Routes = express.Router();
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.Routes.post('/newcall', (req, resp, next) => {
            this.logger.log('info', {
                passthru: {
                    route: 'newcall',
                    payLoad: req.body
                }
            });
            resp.json({});
            const newCall = req.body;
            const hrefAnswer = newCall.Links.find((l) => l.Action === passthru_event_1.Actions.AnswerCall);
            this.notifier.NewCallEvent.next({
                callId: newCall.CallId,
                callerId: (newCall.Caller.Party.User) ? newCall.Caller.Party.User.Id : newCall.Caller.Party.Phone.Id,
                conversationId: newCall.ConversationId,
                hrefAnswer: hrefAnswer?.Link
            });
            resp.status(200);
            resp.end();
        });
        this.Routes.post('/callstatus', (req, resp, next) => {
            const callStatus = req.body;
            const hrefPrompts = callStatus.Links.find((l) => l.Action === passthru_event_1.Actions.PlayPrompts);
            const hrefDrop = callStatus.Links.find((l) => l.Action === passthru_event_1.Actions.DropCall);
            if (callStatus.State === passthru_event_1.CallState.Established) {
                this.logger.log('info', {
                    passthru: {
                        route: 'callstatus',
                        callState: passthru_event_1.strCallState(callStatus.State),
                        payLoad: req.body
                    }
                });
                this.notifier.CallQueued.next(new types_1.CallQueuedArgs(callStatus.CallId, hrefDrop?.Link, hrefPrompts?.Link, callStatus.Links.find((l) => l.Action === passthru_event_1.Actions.SubscribeDtmf)?.Link));
            }
            else if (callStatus.State === passthru_event_1.CallState.Terminated) {
                this.logger.log('info', {
                    route: 'callstatus',
                    callState: passthru_event_1.strCallState(callStatus.State)
                });
                this.notifier.CallTerminated.next(new types_1.CallTerminatedArgs(callStatus.CallId));
            }
            else {
                this.logger.log('info', {
                    ignore: {
                        callId: callStatus.CallId,
                        route: 'callstatus',
                        callState: passthru_event_1.strCallState(callStatus.State)
                    }
                });
            }
            resp.json({});
            resp.status(200);
            resp.end();
        });
        this.Routes.post('/dtmf', (req, resp, next) => {
            this.logger.log('info', {
                passthru: {
                    route: 'dtmf',
                    payLoad: req.body
                }
            });
            resp.json({});
            const dtmf = req.body;
            this.notifier.DtmfKeyPress.next(new types_1.DtmfArgs(dtmf.CallId, +dtmf.DtmfKey));
            resp.status(200);
            resp.end();
        });
        this.Routes.post('/playpromptstateupdated', (req, resp, next) => {
            this.logger.log('info', {
                passthru: {
                    route: 'playpromptstateupdated',
                    payLoad: req.body
                }
            });
            resp.json({});
            const as = req.body;
            this.notifier.AnnounceStatus.next(new types_1.AnnounceStateArgs(as.CallId, as.Links.find((l) => l.Action === passthru_event_1.Actions.DropCall)?.Link, as.Links.find((l) => l.Action === passthru_event_1.Actions.PlayPrompts)?.Link, as.Links.find((l) => l.Action === passthru_event_1.Actions.CancelMediaProcessing)?.Link, as.Result));
            resp.status(200);
            resp.end();
        });
    }
}
exports.TeamsPassThruController = TeamsPassThruController;
exports.default = TeamsPassThruController;
//# sourceMappingURL=teams.passthru.controller.js.map