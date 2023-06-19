"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallCollector = exports.eventLog = exports.fsmCallState = void 0;
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
        this.Index = 0;
        this.Event = "";
        this.Time = new Date();
        this.Offset = 0;
    }
}
exports.eventLog = eventLog;
class CallCollector {
    constructor(logger, callerId, RunId, callIndex) {
        this.logger = logger;
        this.RunId = RunId;
        this.InitialDelay = 0;
        this.notifier = liveCallNotifier_1.LiveCallNotifier.getInstance();
        this.EventLog = [];
        this.ErrorLog = [];
        this.SipLog = [];
        this.Start = Date.now();
        this.Caller = "";
        this.ScenarioId = "";
        this.AnnounceError = 0;
        this.Index = 0;
        this.CallId = '';
        this.CallIndex = 0;
        this.Caller = callerId;
        this.logger.info('create collector add MakeCall event', {
            call: `created call runId ${RunId} for caller ${callerId}`
        });
        this.CallIndex = callIndex;
        this.Index = this.Index + 1;
        this.EventLog.push({
            Index: this.Index,
            Event: 'MakeCall',
            Time: new Date(),
            Offset: (Date.now() - this.Start) - this.InitialDelay
        });
    }
    set SipId(id) {
        this.sipId = id;
    }
    get SipId() {
        return this.sipId;
    }
    OnCallArrival(newCall) {
        this.logger.info('add CallArrival event');
        this.Index = this.Index + 1;
        this.CallId = newCall.callId;
        this.EventLog.push({
            Index: this.Index,
            Event: "CallArrival",
            Time: new Date(),
            Offset: (Date.now() - this.Start) - this.InitialDelay
        });
        this.notifier.sendCallNotify({
            event: 'CallArrival',
            runId: this.RunId,
            caller: this.Caller,
            callId: this.ScenarioId,
            offset: (Date.now() - this.Start) - this.InitialDelay
        });
    }
    onSipEvent(sip) {
        if (sip.State == 'SipReady') {
            this.sipId = sip.freeswitchId;
        }
        this.notifier.sendCallNotify({
            event: sip.State,
            runId: this.RunId,
            caller: this.Caller,
            callId: this.ScenarioId,
            reason: sip.reason,
            offset: (Date.now() - this.Start) - this.InitialDelay
        });
        this.Index = this.Index + 1;
        this.EventLog.push({
            Index: this.Index,
            Event: sip.State,
            Time: new Date(),
            Offset: (Date.now() - this.Start) - this.InitialDelay
        });
    }
    onCallEnded() {
        this.Index = this.Index + 1;
        this.EventLog.push({
            Index: this.Index,
            Event: "EndCall",
            Time: new Date(),
            Offset: (Date.now() - this.Start) - this.InitialDelay
        });
        this.notifier.sendCallNotify({
            event: 'EndCall',
            runId: this.RunId,
            caller: this.Caller,
            callId: this.ScenarioId,
            offset: (Date.now() - this.Start) - this.InitialDelay
        });
    }
    logStats() {
        return {
            runId: this.RunId,
            callId: this.CallId,
            callIndex: this.CallIndex,
            scenarioId: this.ScenarioId,
            caller: this.Caller,
            announceErrors: this.AnnounceError,
            stats: this.EventLog,
            errors: this.ErrorLog,
            sip: this.SipLog
        };
    }
}
exports.CallCollector = CallCollector;
//# sourceMappingURL=callCollector.js.map