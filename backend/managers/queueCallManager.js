"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueCallManager = void 0;
const ccQueueApi_1 = require("../api/ccQueueApi");
const call_1 = require("../call");
const dataLogger_1 = require("../dataLogger");
const callMaker_1 = require("../callMaker");
const subscriber_1 = require("../dto/subscriber");
const passthru_event_1 = require("../dto/passthru.event");
const liveCallNotifier_1 = require("../liveCallNotifier");
let fetch = require("node-fetch");
class QueueCallManager {
    constructor(config, logger, notifier, serverUrl, dataLogger) {
        this.config = config;
        this.logger = logger;
        this.notifier = notifier;
        this.dataLogger = dataLogger;
        this.calls = new Array();
        this.queueApi = new ccQueueApi_1.ccQueueApi(serverUrl, logger);
        this.notifier.NewCallEvent.subscribe((newCall) => {
            this.onNewBotCall(newCall);
        });
        this.notifier.CallQueued.subscribe((callEvent) => {
            this.onCallQueued(callEvent);
        });
        this.notifier.AnnounceStatus.subscribe((announce) => {
            this.onAnnounce(announce);
        });
        this.notifier.CallTerminated.subscribe((endCall) => {
            this.onCallComplete(endCall);
        });
        this.notifier.SipEvents.subscribe(ev => {
            this.onSipEvent(ev);
        });
        this.notifier.WaveRequest.subscribe((wr) => {
            this.onWaveRequest(wr);
        });
    }
    staggerDropCalls(interval) {
        throw new Error("Method not implemented.");
    }
    async startTest(testDef) {
        this.logger.info('info', {
            message: 'QueueApi',
            testDef: testDef
        });
        if (this.dataLogger) {
            const record = await this.dataLogger.addNewTest(testDef);
            this.logger.info(record.insertedId);
            this.currentRunId = record.insertedId;
            const callMaker = callMaker_1.CallMaker.getInstance();
            const that = this;
            callMaker.makeCalls(record.insertedId, testDef, true, function (cli, initialDelay) {
                const newCall = new call_1.Call(that.logger, cli, record.insertedId);
                that.calls.push(newCall);
                liveCallNotifier_1.LiveCallNotifier.getInstance().testStatusNotify({
                    event: 'CallsRemaining',
                    runId: record.insertedId,
                    callCount: that.calls.length
                });
            });
            return {
                testDef: testDef,
                summary: this.dataLogger?.getReportSummaryData(record.insertedId)
            };
        }
        return {
            testDef: testDef,
            summary: new dataLogger_1.ReportSummary
        };
    }
    /*
        public async startTest (testDef: NewTest): Promise<RunRequestResult> {
            this.logger.info('info', {
                message: 'QueueApi',
                testDef: testDef
            });
            if (this.dataLogger) {
                const record = await this.dataLogger.addNewTest(testDef);
                this.logger.info(record.insertedId);
                this.currentRunId = record.insertedId;
                const callMaker = CallMaker.getInstance();
                return callMaker.connectToFreeswitch(this.config).then((c: fsConnectionResult) => {
                    const that = this;
                    callMaker.makeCalls(record.insertedId, testDef, true, function (cli: string, initialDelay: number) {
                        const newCall: Call = new Call(that.logger, cli, record.insertedId);
                        that.calls.push(newCall);
                        LiveCallNotifier.getInstance().testStatusNotify({
                            event: 'CallsRemaining',
                            runId: record.insertedId,
                            callCount: that.calls.length
                        })
                    });
                    return {
                        testDef: testDef,
                        summary: this.dataLogger?.getReportSummaryData(record.insertedId)
                    };
                }).catch((s: any) => {
                    this.logger.info('info', {
                        message: `failed to connect to Freeswitch on ${this.config.freeswitchEslIp}`,
                        error: s
                    });
                    return s;
                });
            }
            return {
                testDef: testDef,
                summary: new ReportSummary
            };
        }
    */
    onNewBotCall(newCall) {
        let existing = this.calls.find(c => c.Caller == newCall.callerId);
        if (!existing) {
            existing = new call_1.Call(this.logger, newCall.callerId, newCall.callerId);
            this.calls.push(existing);
            liveCallNotifier_1.LiveCallNotifier.getInstance().testStatusNotify({
                event: 'CallsRemaining',
                runId: this.currentRunId,
                callCount: this.calls.length
            });
        }
        existing.OnCallArrival(newCall);
        if (newCall.hrefAnswer) {
            this.queueApi.AnswerCall(newCall.hrefAnswer).then(async (resp) => {
                this.logger.log('info', {
                    callId: newCall.callId,
                    action: 'AnswerCall',
                    httpstatus: resp.status,
                });
                if (resp.status > 202) {
                    existing?.onHttpError('AnswerCall', resp.status, await resp.text());
                }
            }).catch((err) => {
                console.log(err);
            });
            existing.AnswerRequest();
        }
        else {
            this.logger.alert({
                StateError: 'call arrivale with no answer capability'
            });
        }
    }
    onCallQueued(callEvent) {
        let existing = this.calls.find(c => c.ScenarioId == callEvent.CallId);
        if (existing) {
            existing?.OnCallQueued();
            this.playAnnounce(existing, callEvent.hrefAnnounce, 'AADemoStep1Greet.wav');
        }
    }
    playAnnounce(existing, hrefAnnounce, prompt) {
        if (!hrefAnnounce) {
            return;
        }
        this.queueApi.PlayPrompt(hrefAnnounce, {
            postRequestClear: false,
            preRequestClear: true,
            terminationKeyOptions: {
                terminateKeys: ['1', '2', '3', '4']
            },
            loop: false,
            prompts: [
                {
                    resourceId: prompt,
                    uri: `${this.config.teamAudioCallbackUrl}${prompt}`
                }
            ],
            reference: prompt
        }).then(async (resp) => {
            if (resp.status > 202) {
                existing?.onHttpError('AnnounecCall', resp.status, await resp.text());
            }
            this.logger.log('info', {
                url: hrefAnnounce,
                PlayPrompt: resp.status,
            });
        }).catch((err) => {
            this.logger.crit({
                url: hrefAnnounce,
                PlayPromptError: err,
            });
        });
        existing.AnnounceRequest();
    }
    onAnnounce(announce) {
        const existing = this.calls.find(c => c.ScenarioId == announce.CallId);
        this.logger.info(announce);
        this.logger.info({ AnnounceRepeat: existing?.AnnounceRepeat });
        if (existing) {
            const anr = announce.PlayResult;
            if (anr.State === passthru_event_1.MediaOperationStatus.Completed) {
                existing.OnAnnounceComplete(anr.Reason.Result.Code);
                if (existing.AnnounceRepeat === 1) {
                    this.playAnnounce(existing, announce.hrefAnnounce, 'techdificulties.wav');
                }
                else {
                    if (announce.hrefDrop) {
                        this.queueApi.DropCall(announce.hrefDrop).then(async (resp) => {
                            this.logger.log('info', {
                                callId: announce.CallId,
                                action: 'DropCall',
                                httpstatus: resp.status,
                            });
                            if (resp.status > 202) {
                                existing.onHttpError('DropCall', resp.status, await resp.text());
                            }
                        }).catch((err) => {
                            console.log(err);
                        });
                        existing.DropRequest();
                    }
                }
            }
            else if (anr.State === passthru_event_1.MediaOperationStatus.Playing) {
                existing.OnAnnounceStart();
            }
        }
    }
    onCallComplete(terminate) {
        const existing = this.calls.find(c => c.ScenarioId == terminate.CallId);
        existing?.onCallEnded();
        const existingIndex = this.calls.findIndex(c => c.ScenarioId == terminate.CallId);
        if (existingIndex !== -1) {
            this.calls.splice(existingIndex, 1);
            this.logger.error({ terminate: `removed call ${this.calls.length} remaining`,
                call: terminate });
            this.dataLogger?.logCall(existing?.logStats()).then((success) => {
                liveCallNotifier_1.LiveCallNotifier.getInstance().testStatusNotify({
                    event: 'CallsRemaining',
                    runId: this.currentRunId,
                    callCount: this.calls.length
                });
            });
        }
        else {
            this.logger.error({ terminate: "cant find call",
                call: terminate });
        }
    }
    onSipEvent(ev) {
        this.logger.info({ sipevent: "got event",
            event: ev });
        if (ev.State === 'outbound') {
            const existing = this.calls.find(c => c.Caller == ev.callerId);
            if (existing) {
                existing.AddSipEvent(ev);
            }
            else {
                this.logger.error({ sipevent: "cant find call",
                    callerId: ev.callerId });
            }
        }
        else if (ev.State === 'answered') {
            const existing = this.calls.find(c => c.Caller == ev.callerId);
            if (existing) {
                existing.AddSipEvent(ev);
            }
            else {
                this.logger.error({ sipevent: "cant find call",
                    callerId: ev.callerId });
            }
        }
        if (ev.State === 'endcall') {
            /*
                        const existing  = this.calls.find(c => c.SipId == ev.SipId);
                        if (existing) {
                            existing.AddSipEvent(ev);
                        } else {
                            this.logger.error({sipevent: "cant find call",
                                callerId: ev.callerId});
                        }
            */
        }
    }
    onWaveRequest(wr) {
        const existing = this.calls.find(c => c.ConversationId == wr.ConversationId);
        if (existing) {
            this.logger.info({
                callId: existing.ScenarioId,
                passThru: "got wave request",
                WaveRequest: wr
            });
            existing.OnWaveRequest(wr);
        }
    }
}
exports.QueueCallManager = QueueCallManager;
QueueCallManager.CreateAsync = async (config, logger, notifier, serverUrl, dataLogger) => {
    let resp = await fetch(`${serverUrl}/Queue/${config.tenantId}/endpoints`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    const endpoints = await resp.json();
    const queueList = Array.from(endpoints, (q) => q.upn);
    logger.log('info', {
        queues: queueList,
        endpoints: endpoints
    });
    const ccQueues = [];
    queueList.forEach(ql => {
        ccQueues.push({
            upn: ql,
            autoAnswer: false,
            mohUriList: [
                `${config.teamAudioCallbackUrl}/techdificolties.wav`
            ]
        });
    });
    const ql = JSON.stringify(new subscriber_1.SubscriptionInfo(config.callbackUrl, "C127C802-B71C-48C1-A88C-26C805B37ADD", false, queueList, ccQueues, queueList[0]));
    const response = await fetch(`${serverUrl}/Queue/${config.tenantId}/subscribers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: ql
    });
    const isText = response.headers.get('content-type')?.includes('text/plain');
    const data = isText ? await response.text() : null;
    logger.log('info', {
        result: {
            callbackUrl: config.callbackUrl,
            callBackId: "C127C802-B71C-48C1-A88C-26C805B37ADD",
            queues: ql,
            status: response.status,
            result: data
        },
    });
    return new QueueCallManager(config, logger, notifier, serverUrl, dataLogger);
};
//# sourceMappingURL=queueCallManager.js.map