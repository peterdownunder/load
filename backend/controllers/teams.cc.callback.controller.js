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
exports.TeamsCcCallbackController = void 0;
const express = __importStar(require("express"));
const CCCallState_1 = require("../dto/CCCallState");
const types_1 = require("../dto/types");
class TeamsCcCallbackController {
    constructor(logger, notifier, subscriptionId) {
        this.logger = logger;
        this.notifier = notifier;
        this.subscriptionId = subscriptionId;
        this.Routes = express.Router();
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        /*
        This is a heart beat to check that we are still alive. Need to put decide what we do about the subscriptionId != rx subscriptionId
         */
        this.Routes.post('/ping', (req, resp, next) => {
            resp.json({
                SubscriptionId: this.subscriptionId
            });
            resp.status(200);
            resp.end();
        });
        /*
        Should only the this call if the subscription does not include the aut answer flag
         */
        this.Routes.post('/CallArrival', (req, resp, next) => {
            this.logger.log('info', {
                message: {
                    state: 'On /CallArrival',
                    payLoad: req.body
                }
            });
            const newCall = req.body;
            resp.json({});
            resp.status(200);
            resp.end();
            this.notifier.NewCallEvent.next({
                callId: newCall.CallState.Id,
                callerId: (newCall.CallState.Caller.Party.User) ? newCall.CallState.Caller.Party.User.Id : newCall.CallState.Caller.Party.Phone.Id,
                conversationId: newCall.CallState.ConversationId,
                hrefAnswer: newCall.CallState.Actions.includes(CCCallState_1.Action.Answer) ? `${newCall.CallState.Href}/answer` : undefined
            });
        });
        /*
        This could be the initial event for a call if auto answer is true, or the subsequent event if auto answer is false and we have successfully answered the call
         */
        this.Routes.post('/NewCall', (req, resp, next) => {
            this.logger.log('info', {
                message: {
                    state: 'On /Newcall',
                    payLoad: req.body
                }
            });
            const callStatus = req.body;
            this.notifier.CallQueued.next(new types_1.CallQueuedArgs(callStatus.CallState.Id, callStatus.CallState.Actions.includes(CCCallState_1.Action.Drop) ? `${callStatus.CallState.Href}` : undefined, callStatus.CallState.Actions.includes(CCCallState_1.Action.Announce) ? `${callStatus.CallState.Href}/media/prompts` : undefined, callStatus.CallState.Actions.includes(CCCallState_1.Action.SubscribeDtmf) ? `${callStatus.CallState.Href}/media/subscribedtmf` : undefined));
            resp.json({});
            resp.status(200);
            resp.end();
        });
        this.Routes.post('/CallStatus', (req, resp, next) => {
            this.logger.log('info', {
                message: {
                    state: 'On /CallStatus',
                    payLoad: req.body
                }
            });
            const callStatus = req.body;
            if (callStatus.CallState.State === CCCallState_1.CCCallState.End) {
                this.notifier.CallTerminated.next({ CallId: callStatus.CallState.Id });
            }
            resp.json({});
            resp.status(200);
            resp.end();
        });
        this.Routes.post('/DtmfDetected', (req, resp, next) => {
            this.logger.log('info', {
                message: {
                    state: 'On /DtmfDetected ',
                    payLoad: req.body
                }
            });
            resp.json({});
            //            this.notifier.DtmfKey.next(req.body as DtmfKeyPress)
            resp.status(200);
            resp.end();
        });
        this.Routes.post('/AnnounceState', (req, resp, next) => {
            this.logger.log('info', {
                message: {
                    state: 'On /AnnounceState',
                    payLoad: req.body
                }
            });
            const announce = req.body;
            this.notifier.AnnounceStatus.next(new types_1.AnnounceStateArgs(announce.CallState.Id, announce.CallState.Actions.includes(CCCallState_1.Action.Drop) ? `${announce.CallState.Href}` : undefined, announce.CallState.Actions.includes(CCCallState_1.Action.Announce) ? `${announce.CallState.Href}/media/prompts` : undefined, announce.CallState.Actions.includes(CCCallState_1.Action.CancelMedia) ? `${announce.CallState.Href}/media` : undefined, announce.Announce));
            resp.json({});
            resp.status(200);
            resp.end();
        });
    }
}
exports.TeamsCcCallbackController = TeamsCcCallbackController;
exports.default = TeamsCcCallbackController;
//# sourceMappingURL=teams.cc.callback.controller.js.map