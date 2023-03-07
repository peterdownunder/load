"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Call = exports.eventLog = exports.fsmCallState = void 0;
const queueOffering_1 = require("./dto/queueOffering");
const liveCallNotifier_1 = require("./liveCallNotifier");
let fetch = require("node-fetch");
var fsmCallState;
(function (fsmCallState) {
    fsmCallState[fsmCallState["Initial"] = 0] = "Initial";
    fsmCallState[fsmCallState["MakeCall"] = 1] = "MakeCall";
    fsmCallState[fsmCallState["CallArrival"] = 2] = "CallArrival";
    fsmCallState[fsmCallState["AnswerRequest"] = 3] = "AnswerRequest";
    fsmCallState[fsmCallState["AnnounceRequest"] = 4] = "AnnounceRequest";
    fsmCallState[fsmCallState["AnnounceStart"] = 5] = "AnnounceStart";
    fsmCallState[fsmCallState["AnnounceComplete"] = 6] = "AnnounceComplete";
    fsmCallState[fsmCallState["AnnounceRequest2"] = 7] = "AnnounceRequest2";
    fsmCallState[fsmCallState["AnnounceStart2"] = 8] = "AnnounceStart2";
    fsmCallState[fsmCallState["AnnounceComplete2"] = 9] = "AnnounceComplete2";
    fsmCallState[fsmCallState["DropRequest"] = 10] = "DropRequest";
    fsmCallState[fsmCallState["EndCall"] = 11] = "EndCall";
})(fsmCallState = exports.fsmCallState || (exports.fsmCallState = {}));
class eventLog {
    constructor() {
        this.Event = "";
        this.Time = new Date();
        this.Offset = 0;
    }
}
exports.eventLog = eventLog;
class Call {
    constructor(logger, callerId, RunId) {
        this.logger = logger;
        this.RunId = RunId;
        this.notifier = liveCallNotifier_1.LiveCallNotifier.getInstance();
        this.callState = fsmCallState.Initial;
        this.EventLog = [];
        this.ErrorLog = [];
        this.SipLog = [];
        this.WaveLog = [];
        this.Start = Date.now();
        this.Caller = "";
        this.LastDtmfKey = -1;
        this.ScenarioId = "";
        this.lastQueueStatus = new queueOffering_1.CallStateEvent();
        this.AnnounceError = 0;
        this.AnnounceRepeat = 0;
        this.Caller = callerId;
        this.logger.info('info', {
            call: `created call runId ${RunId} for caller ${callerId}`
        });
        this.EventLog.push({
            Event: 'MakeCall',
            Time: new Date(),
            Offset: Date.now() - this.Start
        });
    }
    set SipId(id) {
        this.sipId = id;
    }
    get SipId() {
        return this.sipId;
    }
    processQueueStatus(status) {
        this.lastQueueStatus = status;
        this.EventLog.push({
            Event: status.InitiatingEvent,
            Time: new Date(),
            Offset: Date.now() - this.Start
        });
    }
    AnswerRequest() {
        this.callState = fsmCallState.AnswerRequest;
        this.EventLog.push({
            Event: "AnswerRequest",
            Time: new Date(),
            Offset: Date.now() - this.Start
        });
    }
    DeliverRequest() {
        this.EventLog.push({
            Event: "DeliverRequest",
            Time: new Date(),
            Offset: Date.now() - this.Start
        });
    }
    AddSipEvent(ev) {
        //        ev.Offset = Date.now() - this.Start;
        //      this.SipLog.push(ev);
    }
    onHttpError(apiFunction, status, err) {
        this.ErrorLog.push({
            Action: apiFunction,
            Offset: Date.now() - this.Start,
            Message: err,
            Error: status
        });
        this.logger.log('info', {
            error: status,
            message: err,
        });
    }
    AnnounceRequest() {
        this.callState = this.AnnounceRepeat === 0 ? fsmCallState.AnnounceRequest : fsmCallState.AnnounceRequest2;
        this.EventLog.push({
            Event: this.AnnounceRepeat === 0 ? "AnnounceRequest" : "AnnounceRequest2",
            Time: new Date(),
            Offset: Date.now() - this.Start
        });
    }
    DropRequest() {
        this.callState = fsmCallState.DropRequest;
        this.EventLog.push({
            Event: "DropRequest",
            Time: new Date(),
            Offset: Date.now() - this.Start
        });
    }
    OnDtmf(key) {
        this.LastDtmfKey = key;
        this.EventLog.push({
            Event: "DtmfRx",
            Time: new Date(),
            Offset: Date.now() - this.Start
        });
    }
    CancalMediaRequest() {
        this.EventLog.push({
            Event: "CancelMedia",
            Time: new Date(),
            Offset: Date.now() - this.Start
        });
    }
    OnCallArrival(newCall) {
        this.callState = fsmCallState.CallArrival;
        this.ScenarioId = newCall.callId;
        this.ConversationId = newCall.conversationId;
        this.EventLog.push({
            Event: "CallArrival",
            Time: new Date(),
            Offset: Date.now() - this.Start
        });
        this.notifier.sendCallNotify({
            event: 'CallArrival',
            runId: this.RunId,
            caller: this.Caller,
            callId: this.ScenarioId,
            offset: Date.now() - this.Start
        });
    }
    OnAnnounceComplete(errorCode) {
        if (errorCode !== 0) {
            this.AnnounceError = this.AnnounceError + 1;
        }
        this.callState = this.AnnounceRepeat === 1 ? fsmCallState.AnnounceComplete : fsmCallState.AnnounceComplete2;
        this.EventLog.push({
            Event: this.AnnounceRepeat === 1 ? "AnnounceComplete" : "AnnounceComplete2",
            Time: new Date(),
            Offset: Date.now() - this.Start
        });
        const announce1complete = this.EventLog.find(e => e.Event === 'AnnounceComplete');
        const announce2Start = this.EventLog.find(e => e.Event === 'AnnounceStart2');
        let diff = 0;
        if (announce1complete && announce2Start) {
            diff = announce2Start.Offset - announce1complete.Offset;
            this.notifier.sendCallNotify({
                event: 'AnnounceComplete',
                runId: this.RunId,
                callId: this.ScenarioId,
                offset: diff
            });
        }
    }
    OnAnnounceStart() {
        this.AnnounceRepeat = this.AnnounceRepeat + 1;
        this.callState = this.AnnounceRepeat === 1 ? fsmCallState.AnnounceStart : fsmCallState.AnnounceStart2;
        this.EventLog.push({
            Event: this.AnnounceRepeat === 1 ? "AnnounceStart" : "AnnounceStart2",
            Time: new Date(),
            Offset: Date.now() - this.Start
        });
    }
    OnCallQueued() {
        this.callState = fsmCallState.CallArrival;
        const offset = Date.now() - this.Start;
        this.EventLog.push({
            Event: "NewCall",
            Time: new Date(),
            Offset: offset
        });
        const answerRequest = this.EventLog.find(e => e.Event === 'AnswerRequest');
        if (answerRequest) {
            this.notifier.sendCallNotify({
                event: 'NewCall',
                runId: this.RunId,
                callId: this.ScenarioId,
                offset: offset - answerRequest.Offset
            });
        }
        else {
            this.logger.info(`Cannot find answrer request WTF`);
        }
    }
    onCallEnded() {
        const t = Date.now() - this.Start;
        this.EventLog.push({
            Event: "EndCall",
            Time: new Date(),
            Offset: t
        });
        const droprequest = this.EventLog.find(e => e.Event === 'DropRequest');
        if (droprequest) {
            this.notifier.sendCallNotify({
                event: 'EndCall',
                runId: this.RunId,
                callId: this.ScenarioId,
                offset: t - droprequest.Offset
            });
        }
    }
    logStats() {
        return {
            runId: this.RunId,
            scenarioId: this.ScenarioId,
            caller: this.Caller,
            announceErrors: this.AnnounceError,
            stats: this.EventLog,
            errors: this.ErrorLog,
            sip: this.SipLog,
            wave: this.WaveLog
        };
    }
    OnWaveRequest(wr) {
        wr.Offset = Date.now() - this.Start;
        this.WaveLog.push(wr);
    }
}
exports.Call = Call;
//# sourceMappingURL=call.js.map