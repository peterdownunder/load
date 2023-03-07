"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptCollection = exports.Actions = exports.strCallState = exports.CallState = exports.PromptResultCode = exports.MediaOperationStatus = void 0;
var MediaOperationStatus;
(function (MediaOperationStatus) {
    MediaOperationStatus[MediaOperationStatus["Queued"] = 0] = "Queued";
    MediaOperationStatus[MediaOperationStatus["Playing"] = 1] = "Playing";
    MediaOperationStatus[MediaOperationStatus["Recording"] = 2] = "Recording";
    MediaOperationStatus[MediaOperationStatus["Completed"] = 3] = "Completed";
    MediaOperationStatus[MediaOperationStatus["Canceled"] = 4] = "Canceled";
    MediaOperationStatus[MediaOperationStatus["Failed"] = 5] = "Failed";
    MediaOperationStatus[MediaOperationStatus["Unknown"] = 6] = "Unknown";
})(MediaOperationStatus = exports.MediaOperationStatus || (exports.MediaOperationStatus = {}));
var PromptResultCode;
(function (PromptResultCode) {
    PromptResultCode[PromptResultCode["Ok"] = 0] = "Ok";
    PromptResultCode[PromptResultCode["BadRequest"] = 1] = "BadRequest";
    PromptResultCode[PromptResultCode["NotFound"] = 2] = "NotFound";
    PromptResultCode[PromptResultCode["NotAcceptable"] = 3] = "NotAcceptable";
    PromptResultCode[PromptResultCode["ExpectationFailed"] = 4] = "ExpectationFailed";
    PromptResultCode[PromptResultCode["NoTarget"] = 5] = "NoTarget";
    PromptResultCode[PromptResultCode["InvalidTenantId"] = 6] = "InvalidTenantId";
    PromptResultCode[PromptResultCode["InvalidBot"] = 7] = "InvalidBot";
    PromptResultCode[PromptResultCode["NoId"] = 8] = "NoId";
    PromptResultCode[PromptResultCode["NoPlayList"] = 9] = "NoPlayList";
    PromptResultCode[PromptResultCode["InvalidArgs"] = 10] = "InvalidArgs";
    PromptResultCode[PromptResultCode["NoInviteeProvided"] = 11] = "NoInviteeProvided";
    PromptResultCode[PromptResultCode["CallNotFound"] = 12] = "CallNotFound";
    PromptResultCode[PromptResultCode["Accepted"] = 13] = "Accepted";
    PromptResultCode[PromptResultCode["Created"] = 14] = "Created";
    PromptResultCode[PromptResultCode["FailToRetrievePartipants"] = 15] = "FailToRetrievePartipants";
    PromptResultCode[PromptResultCode["ParticipantsNotFound"] = 16] = "ParticipantsNotFound";
    PromptResultCode[PromptResultCode["CallIsNotGroupCall"] = 17] = "CallIsNotGroupCall";
    PromptResultCode[PromptResultCode["TargetTypeNotSupported"] = 18] = "TargetTypeNotSupported";
    PromptResultCode[PromptResultCode["InvalidEndpoint"] = 19] = "InvalidEndpoint";
    PromptResultCode[PromptResultCode["InvalidCallState"] = 20] = "InvalidCallState";
})(PromptResultCode = exports.PromptResultCode || (exports.PromptResultCode = {}));
var CallState;
(function (CallState) {
    CallState[CallState["Unknown"] = 0] = "Unknown";
    CallState[CallState["Incoming"] = 1] = "Incoming";
    CallState[CallState["Establishing"] = 2] = "Establishing";
    CallState[CallState["Ringing"] = 3] = "Ringing";
    CallState[CallState["Established"] = 4] = "Established";
    CallState[CallState["Hold"] = 5] = "Hold";
    CallState[CallState["Transferring"] = 6] = "Transferring";
    CallState[CallState["TransferAccepted"] = 7] = "TransferAccepted";
    CallState[CallState["Redirecting"] = 8] = "Redirecting";
    CallState[CallState["Terminating"] = 9] = "Terminating";
    CallState[CallState["Terminated"] = 10] = "Terminated";
})(CallState = exports.CallState || (exports.CallState = {}));
function strCallState(s) {
    const cs = [
        'Unknown',
        'Incoming',
        'Establishing',
        'Ringing',
        'Established',
        'Hold',
        'Transferring',
        'TransferAccepted',
        'Redirecting',
        'Terminating',
        'Terminated'
    ];
    return cs[s];
}
exports.strCallState = strCallState;
var Actions;
(function (Actions) {
    Actions[Actions["AnswerCall"] = 0] = "AnswerCall";
    Actions[Actions["DropCall"] = 1] = "DropCall";
    Actions[Actions["RejectCall"] = 2] = "RejectCall";
    Actions[Actions["RedirectCall"] = 3] = "RedirectCall";
    Actions[Actions["SubscribeDtmf"] = 4] = "SubscribeDtmf";
    Actions[Actions["PlayPrompts"] = 5] = "PlayPrompts";
    Actions[Actions["Recording"] = 6] = "Recording";
    Actions[Actions["CancelMediaProcessing"] = 7] = "CancelMediaProcessing";
    Actions[Actions["InviteParticipants"] = 8] = "InviteParticipants";
    Actions[Actions["GetParticipants"] = 9] = "GetParticipants";
    Actions[Actions["RemoveParticipant"] = 10] = "RemoveParticipant";
})(Actions = exports.Actions || (exports.Actions = {}));
class PromptCollection {
    constructor(Prompts, loop, reference) {
        this.Prompts = Prompts;
        this.loop = loop;
        this.reference = reference;
    }
}
exports.PromptCollection = PromptCollection;
//# sourceMappingURL=passthru.event.js.map