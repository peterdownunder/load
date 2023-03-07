"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassThruCallManager = void 0;
let fetch = require("node-fetch");
const call_1 = require("../call");
const dataLogger_1 = require("../dataLogger");
const callMaker_1 = require("../callMaker");
const subscriber_1 = require("../dto/subscriber");
const passthru_api_1 = require("../api/passthru.api");
const passthru_event_1 = require("../dto/passthru.event");
const liveCallNotifier_1 = require("../liveCallNotifier");
class PassThruCallManager {
    constructor(config, logger, notifier, serverUrl, dataLogger) {
        this.config = config;
        this.logger = logger;
        this.notifier = notifier;
        this.dataLogger = dataLogger;
        this.calls = new Array();
        this.introPrompt = new passthru_event_1.PromptCollection([{
                resourceId: 'AADemoStep1Greet',
                uri: `${this.config.teamAudioCallbackUrl}AADemoStep1Greet.wav`
            }], false, 'loadTest');
        this.secondPrompt = new passthru_event_1.PromptCollection([{
                resourceId: 'techdificulties',
                uri: `${this.config.teamAudioCallbackUrl}techdificulties.wav`
            }], false, 'loadTest');
        this.passThruApi = new passthru_api_1.PassThruApi(this.config.teamsAdapterUrl, logger);
        this.notifier.NewCallEvent.subscribe((newCall) => {
            logger.info({ passThru: "newCall", newCall });
            this.onNewCall(newCall);
        });
        this.notifier.CallQueued.subscribe((queued) => {
            this.onCallQueued(queued);
        });
        this.notifier.CallTerminated.subscribe((terminate) => {
            this.onCallComplete(terminate);
        });
        this.notifier.AnnounceStatus.subscribe((state) => {
            this.onAnnounceStatus(state);
        });
        this.notifier.DtmfKeyPress.subscribe((d) => {
            this.onDtmfKey(d);
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
    static async subscribe(config, logger, serverUrl, queues) {
        const resistration = await fetch(`${serverUrl}/PassThrough/${config.tenantId}/subscribers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(new subscriber_1.SubscriptionInfo(config.callbackUrl, config.subscriptionId, false, queues, [], queues[0]))
        });
        const subResult = await resistration.json();
        logger.log('info', {
            resistration: {
                callbackUrl: config.callbackUrl,
                callBackId: "C127C802-B71C-48C1-A88C-26C805B37ADD",
                queues: queues,
                result: subResult
            },
        });
        return subResult;
    }
    async startTest(testDef) {
        this.logger.info('info', {
            message: 'PassThru',
            testDef: testDef
        });
        if (this.dataLogger) {
            const record = await this.dataLogger.addNewTest(testDef);
            this.logger.info(record.insertedId);
            this.currentRunId = record.insertedId;
            const callMaker = callMaker_1.CallMaker.getInstance();
            return callMaker.connectToFreeswitch(this.config).then((c) => {
                const that = this;
                callMaker.makeCalls(record.insertedId, testDef, true, function (cli, initialDelay) {
                    const newCall = new call_1.Call(that.logger, cli, record.insertedId);
                    that.calls.push(newCall);
                    liveCallNotifier_1.LiveCallNotifier.getInstance().testStatusNotify({
                        event: 'CallsRemaining',
                        runId: '',
                        callCount: that.calls.length
                    });
                });
                return {
                    testDef: testDef,
                    summary: this.dataLogger?.getReportSummaryData(record.insertedId)
                };
            }).catch((s) => {
                this.logger.info('info', {
                    message: `failed to connect to Freeswitch on ${this.config.freeswitchEslIp}`,
                    error: s
                });
                return s;
            });
        }
        return {
            testDef: testDef,
            summary: new dataLogger_1.ReportSummary()
        };
    }
    onNewCall(newCall) {
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
        if (existing.callState !== call_1.fsmCallState.Initial) {
            this.logger.error({
                callId: newCall.callId,
                passThru: "Ignoring Invalid State"
            });
        }
        existing.OnCallArrival(newCall);
        this.logger.info({ passThru: "Answering now" });
        if (newCall.hrefAnswer) {
            this.passThruApi.AnswerCall(newCall.hrefAnswer).then(async (resp) => {
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
    }
    onCallQueued(queued) {
        const existing = this.calls.find(c => c.ScenarioId == queued.CallId);
        if (!existing) {
            this.logger.info({ passThru: "onCallQueued can't find call", CallQueuedArgs: queued });
            return;
        }
        if (existing.callState !== call_1.fsmCallState.AnswerRequest) {
            this.logger.error({
                callId: queued.CallId,
                passThru: "Ignoring Invalid State"
            });
            return;
        }
        existing.OnCallQueued();
        this.logger.info({ passThru: "Call now queued", queued: queued });
        if (queued.hrefSubscribeDtmf) {
            this.passThruApi.SubscribeDTMF(queued.hrefSubscribeDtmf).then(async (resp) => {
                this.logger.log('info', {
                    callId: queued.CallId,
                    action: 'SubscribeDTMF',
                    httpstatus: resp.status,
                });
                if (resp.status > 202) {
                    existing.onHttpError('SubscribeDTMF', resp.status, await resp.text());
                }
            }).catch((err) => {
                console.log(err);
            });
        }
        if (queued.hrefAnnounce) {
            this.logger.info({
                callId: queued.CallId,
                passThru: 'announce It AADemoStep1Greet.wav'
            });
            this.passThruApi.AnnounceCall(queued.hrefAnnounce, this.introPrompt).then(async (resp) => {
                this.logger.log('info', {
                    callId: queued.CallId,
                    action: 'AnnounceCall',
                    httpstatus: resp.status,
                });
                if (resp.status > 202) {
                    existing.onHttpError('AnnounceCall', resp.status, await resp.text());
                }
            }).catch((err) => {
                console.log(err);
            });
            existing.AnnounceRequest();
        }
    }
    onAnnounceStatus(state) {
        const existing = this.calls.find(c => c.ScenarioId == state.CallId);
        if (!existing) {
            this.logger.info({
                callId: state.CallId,
                passThru: "onAnnounceStatus can't find call",
                AnnounceStateArgs: state
            });
            return;
        }
        const pr = state.PlayResult;
        existing.hrefCancelMedia = state.hrefCancelAnnounce;
        if (pr.Code === passthru_event_1.PromptResultCode.Accepted) {
            if (existing.callState === call_1.fsmCallState.AnnounceRequest || existing.callState === call_1.fsmCallState.AnnounceRequest2) {
                this.logger.info({
                    callId: state.CallId,
                    passThru: "got announce start"
                });
                existing.OnAnnounceStart();
            }
            else {
                this.logger.error({
                    callId: state.CallId,
                    passThru: `Ignoring Invalid State ${existing.callState}`
                });
            }
        }
        else {
            if (existing.callState === call_1.fsmCallState.AnnounceStart || existing.callState === call_1.fsmCallState.AnnounceStart2) {
                existing.OnAnnounceComplete(pr.Code);
                if (existing.AnnounceRepeat == 1) {
                    if (state.hrefAnnounce) {
                        this.logger.info({
                            callId: state.CallId,
                            passThru: "do announce techdificulties"
                        });
                        this.passThruApi.AnnounceCall(state.hrefAnnounce, this.secondPrompt);
                        existing.AnnounceRequest();
                    }
                }
                else {
                    if (existing.LastDtmfKey === 1) {
                        this.logger.info({
                            callId: state.CallId,
                            passThru: "do announce AADemoStep1Options.wav ion DTMKey 1"
                        });
                        if (state.hrefAnnounce) {
                            const prompts = new passthru_event_1.PromptCollection([{ resourceId: 'AADemoStep1Options2', uri: `${this.config.teamAudioCallbackUrl}AADemoStep1Options.wav` }], false, 'loadTest');
                            this.passThruApi.AnnounceCall(state.hrefAnnounce, prompts);
                            existing.callState = call_1.fsmCallState.AnnounceRequest2;
                            existing.AnnounceRepeat = 0;
                        }
                        existing.LastDtmfKey = -1;
                    }
                    else {
                        if (state.hrefDrop) {
                            this.logger.info({
                                callId: state.CallId,
                                passThru: "got announce complete, dropcall"
                            });
                            this.passThruApi.DropCall(state.hrefDrop).then(async (resp) => {
                                this.logger.log('info', {
                                    callId: state.CallId,
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
            }
            else {
                this.logger.error({
                    callId: state.CallId,
                    passThru: `Ignoring Invalid Announce State ${existing.callState}`
                });
            }
        }
    }
    onDtmfKey(d) {
        const existing = this.calls.find(c => c.ScenarioId == d.CallId);
        if (existing && existing.hrefCancelMedia) {
            existing.OnDtmf(d.DtmfKey);
            this.passThruApi.CancelMedia(existing.hrefCancelMedia);
            existing.CancalMediaRequest();
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
                                callerId: ev.CallerId});
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
exports.PassThruCallManager = PassThruCallManager;
PassThruCallManager.CreateAsync = async (config, logger, notifier, serverUrl, dataLogger) => {
    let resp = await fetch(`${serverUrl}/PassThrough/${config.tenantId}/endpoints`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    const endpoints = await resp.json();
    const queues = Array.from(endpoints, (q) => q.upn);
    logger.log('info', {
        queues: queues,
    });
    const sub = await PassThruCallManager.subscribe(config, logger, serverUrl, queues);
    if (sub.lifeTime.totalMilliseconds > 10000) {
        setInterval(async () => {
            await PassThruCallManager.subscribe(config, logger, serverUrl, queues);
        }, sub.lifeTime.totalMilliseconds - 5000);
    }
    return new PassThruCallManager(config, logger, notifier, serverUrl, dataLogger);
};
//# sourceMappingURL=passThruCallManager.js.map