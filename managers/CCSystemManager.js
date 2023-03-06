"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CCSystemManager = void 0;
const dataLogger_1 = require("../dataLogger");
const node_fetch_1 = __importDefault(require("node-fetch"));
const callMaker_1 = require("../callMaker");
const liveCallNotifier_1 = require("../liveCallNotifier");
const ccSystemApi_1 = require("../api/ccSystemApi");
const callCollector_1 = require("../callCollector");
class CCSystemManager {
    constructor(config, logger, notifier, serverUrl, dataLogger) {
        this.config = config;
        this.logger = logger;
        this.notifier = notifier;
        this.dataLogger = dataLogger;
        this.callLogger = new Array();
        this.api = new ccSystemApi_1.ccSystemApi('', logger);
        this.notifier.NewCallEvent.subscribe((newCall) => {
            logger.info({ ccSystem: "newCall", newCall });
            this.onNewCall(newCall);
        });
        this.notifier.CallTerminated.subscribe((terminate) => {
            this.onCallComplete(terminate);
        });
        this.notifier.SipEvents.subscribe((sip) => {
            this.onSipEvent(sip);
        });
        /*
                this.notifier.CallQueued.subscribe((queued: CallQueuedArgs) => {
                    this.onCallQueued(queued);
                });
                this.notifier.AnnounceStatus.subscribe((state: AnnounceStateArgs) => {
                    this.onAnnounceStatus(state);
                });
                this.notifier.DtmfKeyPress.subscribe((d: DtmfArgs)=> {
                    this.onDtmfKey (d);
                });
                this.notifier.SipEvents.subscribe(ev => {
                    this.onSipEvent (ev);
                });
        */
    }
    staggerDropCalls(interval) {
        const uuids = [];
        this.callLogger.map(cl => {
            if (cl.SipId) {
                uuids.push(cl.SipId);
            }
        });
        this.logger.info(`staggerDropCalls`, {
            interval: interval,
            calls: uuids
        });
        const callMaker = callMaker_1.CallMaker.getInstance();
        this.killTimer = setInterval(() => {
            const callid = uuids.shift();
            if (callid) {
                callMaker.dropCall(callid);
            }
            else {
                clearInterval(this.killTimer);
            }
        }, interval);
    }
    onNewCall(newCall) {
        this.logger.info(`CCSystemManager new call search for cli ${newCall.callerId}`, {
            call: newCall
        });
        let existing = this.callLogger.find(c => c.Caller == newCall.callerId);
        if (!existing) {
            this.logger.info(`CCSystemManager not found create with runId ${this.currentRunId}`, {
                call: newCall
            });
            existing = new callCollector_1.CallCollector(this.logger, newCall.callerId, this.currentRunId, -1);
            this.callLogger.push(existing);
            liveCallNotifier_1.LiveCallNotifier.getInstance().testStatusNotify({
                event: 'CallsRemaining',
                runId: this.currentRunId,
                callCount: this.callLogger.length
            });
        }
        else {
            this.logger.info(`CCSystemManager FOUND EXISTING ${newCall.callerId}`);
            existing.ScenarioId = newCall.callId;
        }
        existing.OnCallArrival(newCall);
    }
    onSipEvent(sip) {
        let existing = this.callLogger.find(c => c.Caller == sip.callerId);
        existing?.onSipEvent(sip);
    }
    onCallComplete(terminate) {
        const existing = this.callLogger.find(c => c.ScenarioId == terminate.CallId);
        if (existing) {
            this.logger.info(`CCSystemManager FOUND EXISTING ${terminate.CallId} to delete`);
            existing.onCallEnded();
            const existingIndex = this.callLogger.findIndex(c => c.ScenarioId == terminate.CallId);
            if (existingIndex !== -1) {
                this.callLogger.splice(existingIndex, 1);
                this.logger.error({ terminate: `removed call ${this.callLogger.length} remaining`,
                    call: terminate });
                this.dataLogger?.logCall(existing?.logStats()).then((success) => {
                    liveCallNotifier_1.LiveCallNotifier.getInstance().testStatusNotify({
                        event: 'CallsRemaining',
                        runId: this.currentRunId,
                        callCount: this.callLogger.length
                    });
                });
            }
        }
        else {
            this.logger.error({ terminate: "cant find call",
                call: terminate });
        }
    }
    async startTest(testDef) {
        this.logger.info('ccSystem startTest', {
            testDef: testDef
        });
        if (this.dataLogger) {
            const record = await this.dataLogger.addNewTest(testDef);
            this.logger.info(record.insertedId);
            this.currentRunId = record.insertedId;
            const callMaker = callMaker_1.CallMaker.getInstance();
            return callMaker.connectToFreeswitch(this.config).then((c) => {
                const that = this;
                callMaker.makeCalls(record.insertedId, testDef, true, function (cli, initialDelay, index) {
                    const newCall = new callCollector_1.CallCollector(that.logger, cli, record.insertedId, index);
                    newCall.InitialDelay = initialDelay;
                    that.logger.info('info', {
                        message: 'Add new started call ',
                        call: newCall.Caller
                    });
                    that.callLogger.push(newCall);
                    liveCallNotifier_1.LiveCallNotifier.getInstance().sendNewCallInfo({
                        callerId: cli,
                        initialDelay: initialDelay,
                        callsInProgress: that.callLogger.length,
                        runId: that.currentRunId
                    });
                    liveCallNotifier_1.LiveCallNotifier.getInstance().testStatusNotify({
                        event: 'CallsRemaining',
                        runId: record.insertedId,
                        callCount: that.callLogger.length
                    });
                });
                return {
                    testDef: testDef,
                    summary: this.dataLogger?.getReportSummaryData(record.insertedId)
                };
            }).catch((s) => {
                this.logger.info(`failed to connect to Freeswitch on ${this.config.freeswitchEslIp}`, {
                    error: s
                });
                return s;
            });
        }
        return {
            testDef: testDef,
            summary: new dataLogger_1.ReportSummary
        };
    }
}
exports.CCSystemManager = CCSystemManager;
CCSystemManager.CreateAsync = async (config, logger, notifier, server, dataLogger) => {
    let resp = await node_fetch_1.default(`${server.clientWebUrl}/api/v1/Authentication/credentials`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'username': server.userName,
            'password': server.password
        },
    });
    const loginState = await resp.json();
    CCSystemManager.token = `Bearer ${loginState.token}`;
    logger.info('ClientLogin', {
        status: resp.status,
        token: loginState.token
    });
    return new CCSystemManager(config, logger, notifier, server.clientWebUrl, dataLogger);
};
//# sourceMappingURL=CCSystemManager.js.map