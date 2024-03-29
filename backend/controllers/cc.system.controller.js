"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CcSystemController = exports.getDeliveryPriority = exports.PreviewInteractionRequest = exports.QueuedInteractionsRequest = exports.QueueFilterType = exports.QueueListFilter = exports.QueueHubMethods = exports.InteractionsHubMethod = exports.DeliveryType = exports.Interaction = exports.InteractionParty = exports.ContactId = exports.InteractionProperty = exports.InteractionType = exports.ContactType = exports.InteractionPartyType = exports.InteractionState = exports.MediaType = exports.InteractionCapabilityType = void 0;
const signalr_1 = require("@microsoft/signalr");
const node_fetch_1 = __importDefault(require("node-fetch"));
const types_1 = require("../dto/types");
var InteractionCapabilityType;
(function (InteractionCapabilityType) {
    InteractionCapabilityType["answer"] = "answer";
    InteractionCapabilityType["sipAutoAnswerInvite"] = "sipAutoAnswerInvite";
    InteractionCapabilityType["hold"] = "hold";
    InteractionCapabilityType["unhold"] = "unhold";
    InteractionCapabilityType["drop"] = "drop";
    InteractionCapabilityType["reply"] = "reply";
    InteractionCapabilityType["replyAll"] = "replyAll";
    InteractionCapabilityType["forward"] = "forward";
    InteractionCapabilityType["transfer"] = "transfer";
    InteractionCapabilityType["cancelTransfer"] = "cancelTransfer";
    InteractionCapabilityType["completeTransfer"] = "completeTransfer";
    InteractionCapabilityType["swapHeld"] = "swapHeld";
    InteractionCapabilityType["conference"] = "conference";
    InteractionCapabilityType["intrude"] = "intrude";
    InteractionCapabilityType["whisper"] = "whisper";
    InteractionCapabilityType["record"] = "record";
    InteractionCapabilityType["pauseRecord"] = "pauseRecord";
    InteractionCapabilityType["resumeRecord"] = "resumeRecord";
    InteractionCapabilityType["stopRecord"] = "stopRecord";
    InteractionCapabilityType["replayCallback"] = "replayCallback";
    InteractionCapabilityType["establishCallback"] = "establishCallback";
    InteractionCapabilityType["resolveCallback"] = "resolveCallback";
    InteractionCapabilityType["invite"] = "invite";
    InteractionCapabilityType["resolveUsingTransfer"] = "resolveUsingTransfer";
    InteractionCapabilityType["decline"] = "decline";
    InteractionCapabilityType["sendDtmf"] = "sendDtmf";
    InteractionCapabilityType["request"] = "request";
    InteractionCapabilityType["preview"] = "preview";
    InteractionCapabilityType["pickup"] = "pickup";
    InteractionCapabilityType["accessKnowledgeBase"] = "accessKnowledgeBase";
})(InteractionCapabilityType = exports.InteractionCapabilityType || (exports.InteractionCapabilityType = {}));
var MediaType;
(function (MediaType) {
    MediaType["Unknown"] = "unknown";
    MediaType["Phone"] = "voice";
    MediaType["Chat"] = "chat";
    MediaType["Sms"] = "sms";
    MediaType["Email"] = "email";
    MediaType["Fax"] = "fax";
    MediaType["TextCallback"] = "textCallback";
    MediaType["Task"] = "task";
})(MediaType = exports.MediaType || (exports.MediaType = {}));
var InteractionState;
(function (InteractionState) {
    InteractionState["unknown"] = "unknown";
    InteractionState["idle"] = "idle";
    InteractionState["offering"] = "offering";
    InteractionState["ringback"] = "ringback";
    InteractionState["connected"] = "connected";
    InteractionState["consulting"] = "consulting";
    InteractionState["consultingConnected"] = "consultingConnected";
    InteractionState["consultingHeld"] = "consultingHeld";
    InteractionState["consultingSwapped"] = "consultingSwapped";
    InteractionState["conferenced"] = "conferenced";
    InteractionState["onhold"] = "onHold";
    InteractionState["composing"] = "composing";
    InteractionState["connecting"] = "connecting";
})(InteractionState = exports.InteractionState || (exports.InteractionState = {}));
var InteractionPartyType;
(function (InteractionPartyType) {
    InteractionPartyType["original"] = "original";
    InteractionPartyType["consulted"] = "consulted";
    InteractionPartyType["conference"] = "conference";
    InteractionPartyType["transferred"] = "transferred";
    InteractionPartyType["transferring"] = "transferring";
    InteractionPartyType["recalledFrom"] = "recalledFrom";
    InteractionPartyType["forwardedFrom"] = "forwardedFrom";
    InteractionPartyType["parkedBy"] = "parkedBy";
    InteractionPartyType["parkedFor"] = "parkedFor";
    InteractionPartyType["monitoring"] = "monitoring";
    InteractionPartyType["consultedMonitoring"] = "consultedMonitoring";
    InteractionPartyType["monitored"] = "monitored";
})(InteractionPartyType = exports.InteractionPartyType || (exports.InteractionPartyType = {}));
var ContactType;
(function (ContactType) {
    ContactType["Default"] = "default";
    ContactType["Queue"] = "queue";
    ContactType["External"] = "external";
    ContactType["Address"] = "address";
})(ContactType = exports.ContactType || (exports.ContactType = {}));
var InteractionType;
(function (InteractionType) {
    InteractionType["unknown"] = "unknown";
    InteractionType["queued"] = "queued";
    InteractionType["active"] = "active";
    InteractionType["historical"] = "historical";
    InteractionType["agent"] = "agent";
    InteractionType["related"] = "related";
})(InteractionType = exports.InteractionType || (exports.InteractionType = {}));
class InteractionProperty {
}
exports.InteractionProperty = InteractionProperty;
class ContactId {
}
exports.ContactId = ContactId;
class InteractionParty {
}
exports.InteractionParty = InteractionParty;
class Interaction {
    constructor() {
        //    @Type(() => InteractionParty)
        this.parties = [];
        //  @Type(() => InteractionProperty)
        this.properties = [];
        this.capabilities = [];
        // property only used on frontend to ensure the associated web page isnt automatically opened multiple times
        this.webPageOpened = false;
    }
}
exports.Interaction = Interaction;
var DeliveryType;
(function (DeliveryType) {
    DeliveryType["Primary"] = "primary";
    DeliveryType["Demand"] = "demand";
    DeliveryType["Backup"] = "backup";
    DeliveryType["None"] = "none";
    DeliveryType["Totaling"] = "totaling";
})(DeliveryType = exports.DeliveryType || (exports.DeliveryType = {}));
var InteractionsHubMethod;
(function (InteractionsHubMethod) {
    InteractionsHubMethod["activeInteractionChanged"] = "changed";
    InteractionsHubMethod["activeInteractionsChanged"] = "interactionschanged";
    InteractionsHubMethod["activeInteractionRemoved"] = "removed";
    InteractionsHubMethod["mediaCapabilitiesChanged"] = "mediaCapabilitiesChanged";
    InteractionsHubMethod["lastDialFailed"] = "lastDialFailed";
    InteractionsHubMethod["wrapupCompleted"] = "wrapupCompleted";
    InteractionsHubMethod["messageAdded"] = "messageAdded";
})(InteractionsHubMethod = exports.InteractionsHubMethod || (exports.InteractionsHubMethod = {}));
var QueueHubMethods;
(function (QueueHubMethods) {
    QueueHubMethods["QueueAdd"] = "queueAdd";
    QueueHubMethods["QueueUpdate"] = "queueUpdate";
    QueueHubMethods["QueuesUpdate"] = "queuesUpdate";
    QueueHubMethods["QueueAlerts"] = "queueAlerts";
    QueueHubMethods["TotalingQueueAdd"] = "totalingQueueAdd";
    QueueHubMethods["SecurityUpdate"] = "securityUpdate";
    QueueHubMethods["FilterChanged"] = "filterChanged";
    QueueHubMethods["AgentStateChanged"] = "agentStateChanged";
})(QueueHubMethods = exports.QueueHubMethods || (exports.QueueHubMethods = {}));
class QueueListFilter {
    constructor(priority, type, displayType) {
        this.priority = priority;
        this.type = type;
        this.displayType = displayType;
    }
}
exports.QueueListFilter = QueueListFilter;
var QueueFilterType;
(function (QueueFilterType) {
    QueueFilterType[QueueFilterType["myDelivery"] = 0] = "myDelivery";
    QueueFilterType[QueueFilterType["myCompany"] = 1] = "myCompany";
    QueueFilterType[QueueFilterType["myDepartment"] = 2] = "myDepartment";
})(QueueFilterType = exports.QueueFilterType || (exports.QueueFilterType = {}));
class QueuedInteractionsRequest {
    constructor(queueIds) {
        this.queueIdList = queueIds;
    }
}
exports.QueuedInteractionsRequest = QueuedInteractionsRequest;
class PreviewInteractionRequest {
    constructor(interactionId) {
        this.interactionId = interactionId;
    }
}
exports.PreviewInteractionRequest = PreviewInteractionRequest;
const getDeliveryPriority = (deliveryType) => {
    switch (deliveryType) {
        case DeliveryType.Primary: return 10;
        case DeliveryType.Backup: return 20;
        case DeliveryType.Demand: return 30;
        case DeliveryType.Totaling: return 40;
        case DeliveryType.None:
        default:
            return 50;
    }
};
exports.getDeliveryPriority = getDeliveryPriority;
class CcSystemController {
    constructor(logger, notifier, serverSelector) {
        this.logger = logger;
        this.notifier = notifier;
        this.serverSelector = serverSelector;
        this.queueList = [];
        this.callList = [];
        this.token = '';
    }
    async initRestApi() {
        this.serverSelector.subscribe(async (server) => {
            this.logger.info('serverUpdate', {
                selection: server,
                currentToken: this.token,
                currentServer: this.config
            });
            if (server.token && server.token.length > 0) {
                if (this.config && this.config.clientWebUrl.length > 0 && this.config.clientWebUrl !== server.ccSystem.clientWebUrl) {
                    await this.closeSession();
                }
                await this.initSession(server);
            }
            else {
                await this.closeSession();
            }
            this.config = server.ccSystem;
            this.token = server.token;
        });
    }
    async initSession(server) {
        let queues = {};
        this.logger.info('info', {
            message: 'initRestApi with token',
            url: server.token,
            host: server.ccSystem.clientWebUrl
        });
        const queueReq = await node_fetch_1.default(`${server.ccSystem.clientWebUrl}/api/v1/queues`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': server.token
            }
        });
        this.queueList = await queueReq.json();
        this.logger.info('info', {
            message: 'get queues list resp',
            url: `${server.ccSystem.clientWebUrl}/api/v1/queues`,
            result: queueReq.status,
            queueList: this.queueList
        });
        const res = await node_fetch_1.default(`${server.ccSystem.clientWebUrl}/api/v1/queues/filters`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': server.token
            }
        });
        if (res.status === 200) {
            let filters = await res.json();
            this.logger.info('info', {
                message: 'get queues filters response',
                url: `${server.ccSystem.clientWebUrl}/api/v1/queues/filters`,
                result: res.status,
                filters: filters
            });
        }
        const params = new URLSearchParams();
        params.append('changedFilterType', '300');
        const setfil = `${server.ccSystem.clientWebUrl}/api/v1/queues/setActiveFilter?${params}`;
        let y = await node_fetch_1.default(setfil, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': server.token
            },
        });
        this.logger.info('info', {
            message: 'set active filters resp',
            url: setfil,
            result: y.status
        });
        let resp = await node_fetch_1.default(`${server.ccSystem.clientWebUrl}/api/v1/queues`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': server.token
            },
        });
        this.logger.info('info', {
            message: 'get queues resp',
            status: resp.status,
        });
        const q = await resp.json();
        this.logger.info('info', {
            message: 'get queuee',
            q: q
        });
        await this.initialiseSignalR(server);
        this.registerQueueHubEvents();
        this.registerInteractionHubEvents();
    }
    async closeSession() {
        this.logger.info('close session');
        await Promise.all([
            this.hubQueueUpdate?.stop(),
            this.hubInteractions?.stop()
        ]);
        this.queueList.length = 0;
    }
    async initialiseSignalR(server) {
        this.logger.info('initialiseSignalR');
        const queuesMonitor = [];
        this.queueList.map(q => {
            queuesMonitor.push(q.config.id);
        });
        await this.subscribeForInteractions(server, queuesMonitor);
        this.hubQueueUpdate = new signalr_1.HubConnectionBuilder()
            .withUrl(`${server.ccSystem.clientWebUrl}/touchpoint/hub/queuesHub`, {
            accessTokenFactory: () => server.token.substr(7)
        })
            .configureLogging(signalr_1.LogLevel.Information)
            .build();
        this.hubInteractions = new signalr_1.HubConnectionBuilder()
            .withUrl(`${server.ccSystem.clientWebUrl}/touchpoint/hub/interactionsHub`, {
            accessTokenFactory: () => server.token.substr(7)
        })
            .configureLogging(signalr_1.LogLevel.Information)
            .build();
        const res = await this.hubQueueUpdate.start();
        this.logger.info('info', {
            message: 'Signalr Connected to queuesHub',
            result: res
        });
        this.hubQueueUpdate.onclose((err) => {
            this.logger.error('hubQueueUpdate close', {
                result: err
            });
        });
        try {
            await this.hubInteractions.start();
            this.logger.info('info', {
                message: 'Signalr Connected to interactionsHub'
            });
        }
        catch {
            (error) => {
                this.logger.info('info', {
                    message: 'Signalr Connected to interactionsHub failed',
                    error: error
                });
            };
        }
        this.hubInteractions.onclose((err) => {
            this.logger.error('hubInteractions close', {
                result: err
            });
        });
    }
    registerInteractionHubEvents() {
        this.logger.info('info', {
            message: 'registerInteractionHubEvents'
        });
        this.hubInteractions?.on(InteractionsHubMethod.activeInteractionChanged, (data) => {
            this.processInteractionUpdate(data);
        });
        this.hubInteractions?.on(InteractionsHubMethod.activeInteractionsChanged, (interactions) => {
            interactions.map(data => {
                this.processInteractionUpdate(data);
            });
        });
        this.hubInteractions?.on(InteractionsHubMethod.activeInteractionChanged, (data) => {
            this.processInteractionUpdate(data);
        });
        this.hubInteractions?.on(InteractionsHubMethod.activeInteractionRemoved, (data) => {
            this.logger.info('info', {
                signalrTopic: 'InteractionsHubMethod.activeInteractionRemoved',
                event: data
            });
        });
    }
    registerQueueHubEvents() {
        this.logger.info('info', {
            message: 'Register Signalr'
        });
        this.hubQueueUpdate?.on(QueueHubMethods.QueueAdd, (data) => {
            this.logger.info('info', {
                signalrTopic: 'QueueHubMethods.QueueAdd',
                event: data
            });
        });
        this.hubQueueUpdate?.on(QueueHubMethods.QueueUpdate, (data) => {
            this.logger.info('info', {
                signalrTopic: 'QueueHubMethods.QueueUpdate',
                callsWaiting: data.stats.numberOfCallsInQueue
            });
            if (data.deliveryType === DeliveryType.Totaling) {
            }
            else {
            }
        });
        this.hubQueueUpdate?.on(QueueHubMethods.QueuesUpdate, (queues) => {
            queues.map(data => {
                this.logger.info('info', {
                    signalrTopic: 'QueueHubMethods.QueueUpdate',
                    callsWaiting: data.stats.numberOfCallsInQueue
                });
            });
        });
        this.hubQueueUpdate?.on(QueueHubMethods.TotalingQueueAdd, (data) => {
            this.logger.info('info', {
                signalrTopic: 'QueueHubMethods.TotalingQueueAdd',
                event: data
            });
        });
        this.hubQueueUpdate?.on(QueueHubMethods.AgentStateChanged, (queues, agentIsLoggedIn) => {
            this.logger.info('info', {
                signalrTopic: 'QueueHubMethods.AgentStateChanged',
                agentIsLoggedIn: agentIsLoggedIn,
                event: queues
            });
        });
    }
    processInteractionUpdate(data) {
        const callId = +data.id;
        if (this.callList.find(id => callId === id)) // using the native call reference number (no interactionId supplied by clientwebserver) so if we know about this call
         {
            this.logger.info('info', {
                signalrTopic: 'InteractionsHubMethod.activeInteractionChanged existing Call',
                event: {
                    id: data.id,
                    queue: data.queueName,
                    queueId: data.queueId,
                    state: data.state
                }
            });
            if (data.state === InteractionState.idle) {
                const i = this.callList.findIndex(c => callId === c);
                if (i !== -1) {
                    this.callList.splice(i, 1);
                    this.logger.info('interaction', {
                        action: 'idle',
                        totalCalls: this.callList.length
                    });
                }
                else {
                    this.logger.info('interaction', {
                        action: 'idle unknown',
                        totalCalls: this.callList.length
                    });
                }
                this.notifier.CallTerminated.next(new types_1.CallTerminatedArgs(data.id));
            }
            else {
            }
        }
        else { // we have never seen this caLL
            if (data.state !== InteractionState.idle) { // if it is an idle don't create the call as the CWS does not send call complete, so a phontom would be created
                this.callList.push(callId); // local cache of active calls for linking
                this.logger.info('info', {
                    signalrTopic: 'InteractionsHubMethod.activeInteractionChanged new Call',
                    alldata: data,
                    event: {
                        id: data.id,
                        queue: data.queueName,
                        queueId: data.queueId,
                        state: data.state,
                        currentCalls: this.callList.length
                    }
                });
                const c = data.parties.find(party => party.type === InteractionPartyType.original);
                const callerId = c?.address?.replace(/[^0-9+]/g, ''); // strip the tapi formatting
                if (callerId) { // no point if caller is missing
                    this.notifier.NewCallEvent.next({
                        callId: data.id,
                        callerId: callerId ?? '',
                        conversationId: '',
                        hrefAnswer: undefined
                    });
                }
                else {
                    this.logger.error('cannot resolve call no caller');
                }
                this.logger.info('interaction', {
                    action: `not idle ${data.state}`,
                    totalCalls: this.callList.length
                });
            }
            else { // should never happen but no point in creating call on idle as noted above
                this.logger.error('info', {
                    signalrTopic: 'InteractionsHubMethod.activeInteractionChanged ignore event',
                    event: {
                        id: data.id,
                        queue: data.queueName,
                        queueId: data.queueId,
                        state: data.state
                    }
                });
            }
        }
    }
    async subscribeForInteractions(server, queueIds) {
        const request = new QueuedInteractionsRequest(queueIds);
        let resp = await node_fetch_1.default(`${server.ccSystem.clientWebUrl}/api/v1/queues/interactions`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': server.token
            },
            body: JSON.stringify(request)
        });
        this.logger.info('info', {
            message: 'subscribeForInteractions ',
            resp: resp.status,
            queues: request
        });
    }
}
exports.CcSystemController = CcSystemController;
//# sourceMappingURL=cc.system.controller.js.map