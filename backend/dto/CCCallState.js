"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultCode = exports.MediaState = exports.Modality = exports.PartyType = exports.Action = exports.CCMediaTerminationReason = exports.EndpointType = exports.CCCallTerminationReason = exports.CCCallState = void 0;
var CCCallState;
(function (CCCallState) {
    /// <summary>
    /// Initial state
    /// </summary>
    CCCallState[CCCallState["Wait"] = 0] = "Wait";
    /// <summary>
    /// Setup state
    /// </summary>
    CCCallState[CCCallState["Setup"] = 1] = "Setup";
    /// <summary>
    /// The call on the bot is being answered
    /// </summary>
    CCCallState[CCCallState["QueueAnswer"] = 2] = "QueueAnswer";
    /// <summary>
    /// The call is connected on the bot and in the state of queue offering
    /// </summary>
    CCCallState[CCCallState["QueueOffering"] = 3] = "QueueOffering";
    /// <summary>
    /// The call is in playing prompts
    /// </summary>
    CCCallState[CCCallState["Announce"] = 4] = "Announce";
    /// <summary>
    /// The call is starting the delivery process
    /// </summary>
    CCCallState[CCCallState["Deliver"] = 5] = "Deliver";
    /// <summary>
    /// The call is starting the delivery process via the direct invite approach, i.e. directly invite the agent to join in the call
    /// </summary>
    CCCallState[CCCallState["ExtDeliverOnInvite"] = 6] = "ExtDeliverOnInvite";
    /// <summary>
    /// The agent is on alerting state resulting from the making outbound call approach
    /// </summary>
    CCCallState[CCCallState["ExtDeliverRingBack"] = 7] = "ExtDeliverRingBack";
    /// <summary>
    /// The agent has answered the call
    /// </summary>
    CCCallState[CCCallState["ExtDeliverConnected"] = 8] = "ExtDeliverConnected";
    /// <summary>
    /// The caller is on alerting state
    /// </summary>
    CCCallState[CCCallState["ExtCallerRingback"] = 9] = "ExtCallerRingback";
    /// <summary>
    /// The caller has answered the call
    /// </summary>
    CCCallState[CCCallState["ExtCallerConnected"] = 10] = "ExtCallerConnected";
    /// <summary>
    /// The called is on alerting
    /// </summary>
    CCCallState[CCCallState["ExtCalledOffering"] = 11] = "ExtCalledOffering";
    /// <summary>
    /// The called is on alerting resulting from the direct invite approach
    /// </summary>
    CCCallState[CCCallState["ExtCalledOfferingOnInvite"] = 12] = "ExtCalledOfferingOnInvite";
    /// <summary>
    /// The called has answered the call
    /// </summary>
    CCCallState[CCCallState["ExtCalledConnected"] = 13] = "ExtCalledConnected";
    /// <summary>
    /// A party is on alerting/offering state
    /// </summary>
    CCCallState[CCCallState["ExtOffering"] = 14] = "ExtOffering";
    /// <summary>
    /// The call is on connected state
    /// </summary>
    CCCallState[CCCallState["Connected"] = 15] = "Connected";
    /// <summary>
    /// The call is on pending transfer state
    /// </summary>
    CCCallState[CCCallState["PendingBlindXfer"] = 16] = "PendingBlindXfer";
    /// <summary>
    /// The call is on transferring state
    /// </summary>
    CCCallState[CCCallState["BlindTransferring"] = 17] = "BlindTransferring";
    /// <summary>
    /// The call is on transferring state resulting from the direct invite approach
    /// </summary>
    CCCallState[CCCallState["BlindTransferringOnDirectInvite"] = 18] = "BlindTransferringOnDirectInvite";
    /// <summary>
    /// The transfer destination has answered the call
    /// </summary>
    CCCallState[CCCallState["BlindXferDestinationConnected"] = 19] = "BlindXferDestinationConnected";
    /// <summary>
    /// The transferring call is being recalled
    /// </summary>
    CCCallState[CCCallState["BlindXferRecalling"] = 20] = "BlindXferRecalling";
    /// <summary>
    /// The call is starting conference invitation process via the making outbound call approach
    /// </summary>
    CCCallState[CCCallState["ConferenceInviting"] = 21] = "ConferenceInviting";
    /// <summary>
    /// The call is starting conference invitation process via the direct invite approach
    /// </summary>
    CCCallState[CCCallState["ConferenceInvitingOnInvite"] = 22] = "ConferenceInvitingOnInvite";
    /// <summary>
    /// The invitee is on alerting state resulting from the making outbound call approach
    /// </summary>
    CCCallState[CCCallState["ExtConfInviteRingBack"] = 23] = "ExtConfInviteRingBack";
    /// <summary>
    /// The invitee has answered the call
    /// </summary>
    CCCallState[CCCallState["ExtConfInviteConnected"] = 24] = "ExtConfInviteConnected";
    /// <summary>
    /// The call is on conferenced state
    /// </summary>
    CCCallState[CCCallState["Conferenced"] = 25] = "Conferenced";
    /// <summary>
    /// Do an annoucement before dropping the call
    /// </summary>
    CCCallState[CCCallState["AnnounceOnConsumerDown"] = 26] = "AnnounceOnConsumerDown";
    /// <summary>
    /// The call is ending
    /// </summary>
    CCCallState[CCCallState["Ending"] = 27] = "Ending";
    /// <summary>
    /// The call has ended
    /// </summary>
    CCCallState[CCCallState["End"] = 28] = "End";
    /// <summary>
    /// Default
    /// </summary>
    CCCallState[CCCallState["Default"] = 29] = "Default";
})(CCCallState = exports.CCCallState || (exports.CCCallState = {}));
var CCCallTerminationReason;
(function (CCCallTerminationReason) {
    /// <summary>
    /// No specific
    /// </summary>
    CCCallTerminationReason[CCCallTerminationReason["None"] = 0] = "None";
    /// <summary>
    /// Normal termination
    /// </summary>
    CCCallTerminationReason[CCCallTerminationReason["Normal"] = 1] = "Normal";
    /// <summary>
    /// Busy
    /// </summary>
    CCCallTerminationReason[CCCallTerminationReason["Busy"] = 2] = "Busy";
    /// <summary>
    /// No answer
    /// </summary>
    CCCallTerminationReason[CCCallTerminationReason["NoAnswer"] = 3] = "NoAnswer";
    /// <summary>
    /// Being rejected
    /// </summary>
    CCCallTerminationReason[CCCallTerminationReason["Rejected"] = 4] = "Rejected";
    /// <summary>
    /// Invalid target
    /// </summary>
    CCCallTerminationReason[CCCallTerminationReason["InvalidNumber"] = 5] = "InvalidNumber";
    /// <summary>
    /// Target busy
    /// </summary>
    CCCallTerminationReason[CCCallTerminationReason["LocalBusy"] = 6] = "LocalBusy";
    /// <summary>
    /// Target forbidden
    /// </summary>
    CCCallTerminationReason[CCCallTerminationReason["LocalForbidden"] = 7] = "LocalForbidden";
    /// <summary>
    /// Being rejected by the target
    /// </summary>
    CCCallTerminationReason[CCCallTerminationReason["LocalReject"] = 8] = "LocalReject";
    /// <summary>
    /// Target is reached
    /// </summary>
    CCCallTerminationReason[CCCallTerminationReason["TargetReached"] = 9] = "TargetReached";
    /// <summary>
    /// Target is not reached
    /// </summary>
    CCCallTerminationReason[CCCallTerminationReason["TargetNotReached"] = 10] = "TargetNotReached";
    /// <summary>
    /// Pstn number is mal-formatted
    /// </summary>
    CCCallTerminationReason[CCCallTerminationReason["MalformedPhoneNumber"] = 11] = "MalformedPhoneNumber";
    /// <summary>
    /// General failure
    /// </summary>
    CCCallTerminationReason[CCCallTerminationReason["Failed"] = 12] = "Failed";
    /// <summary>
    /// Killing phantom
    /// </summary>
    CCCallTerminationReason[CCCallTerminationReason["KillPhantom"] = 13] = "KillPhantom";
    /// <summary>
    /// Undefined
    /// </summary>
    CCCallTerminationReason[CCCallTerminationReason["Unknown"] = 14] = "Unknown";
})(CCCallTerminationReason = exports.CCCallTerminationReason || (exports.CCCallTerminationReason = {}));
var EndpointType;
(function (EndpointType) {
    EndpointType[EndpointType["Default"] = 0] = "Default";
    EndpointType[EndpointType["Voicemail"] = 1] = "Voicemail";
    EndpointType[EndpointType["Unknown"] = 2] = "Unknown";
})(EndpointType = exports.EndpointType || (exports.EndpointType = {}));
var CCMediaTerminationReason;
(function (CCMediaTerminationReason) {
    /// <summary>
    /// None
    /// </summary>
    CCMediaTerminationReason[CCMediaTerminationReason["None"] = 0] = "None";
    /// <summary>
    /// A specific key detected
    /// </summary>
    CCMediaTerminationReason[CCMediaTerminationReason["SpecificDigit"] = 1] = "SpecificDigit";
    /// <summary>
    /// Maximum timeout
    /// </summary>
    CCMediaTerminationReason[CCMediaTerminationReason["MaximumTime"] = 2] = "MaximumTime";
    /// <summary>
    /// Inter keys timeout, i.e. timeout between two keys detection
    /// </summary>
    CCMediaTerminationReason[CCMediaTerminationReason["InterDigit"] = 3] = "InterDigit";
    /// <summary>
    /// The play media operation is cancelled
    /// </summary>
    CCMediaTerminationReason[CCMediaTerminationReason["PlayCancelled"] = 4] = "PlayCancelled";
    /// <summary>
    /// The play media operation is completed
    /// </summary>
    CCMediaTerminationReason[CCMediaTerminationReason["PlayComplete"] = 5] = "PlayComplete";
    /// <summary>
    /// The call is ended
    /// </summary>
    CCMediaTerminationReason[CCMediaTerminationReason["CallEnd"] = 6] = "CallEnd";
    /// <summary>
    /// Media play operation failed
    /// </summary>
    CCMediaTerminationReason[CCMediaTerminationReason["PlayError"] = 7] = "PlayError";
    /// <summary>
    /// Maximum length is met
    /// </summary>
    CCMediaTerminationReason[CCMediaTerminationReason["MaxLength"] = 8] = "MaxLength";
    /// <summary>
    /// Unknown
    /// </summary>
    CCMediaTerminationReason[CCMediaTerminationReason["Unknown"] = 9] = "Unknown";
})(CCMediaTerminationReason = exports.CCMediaTerminationReason || (exports.CCMediaTerminationReason = {}));
var Action;
(function (Action) {
    /// <summary>
    /// The call can be answered
    /// </summary>
    Action[Action["Answer"] = 0] = "Answer";
    /// <summary>
    /// The call can be dropped
    /// </summary>
    Action[Action["Drop"] = 1] = "Drop";
    /// <summary>
    /// The call can invite other parties to join in
    /// </summary>
    Action[Action["Invite"] = 2] = "Invite";
    /// <summary>
    /// The participant/party can be dropped
    /// </summary>
    Action[Action["Leave"] = 3] = "Leave";
    /// <summary>
    /// The call can be rejected
    /// </summary>
    Action[Action["Reject"] = 4] = "Reject";
    /// <summary>
    /// The call can play prompts
    /// </summary>
    Action[Action["Announce"] = 5] = "Announce";
    /// <summary>
    /// The media operation can be cancelled
    /// </summary>
    Action[Action["CancelMedia"] = 6] = "CancelMedia";
    /// <summary>
    /// A user can subscribe Dtmf key detection to the call
    /// </summary>
    Action[Action["SubscribeDtmf"] = 7] = "SubscribeDtmf";
    /// <summary>
    /// The call can be delivered to an agent
    /// </summary>
    Action[Action["Deliver"] = 8] = "Deliver";
    /// <summary>
    /// The call can perform blind transfer
    /// </summary>
    Action[Action["BlindTransfer"] = 9] = "BlindTransfer";
    /// <summary>
    /// The transferring call can be picked up
    /// </summary>
    Action[Action["Pickup"] = 10] = "Pickup";
})(Action = exports.Action || (exports.Action = {}));
var PartyType;
(function (PartyType) {
    PartyType[PartyType["Unknown"] = 0] = "Unknown";
    PartyType[PartyType["User"] = 1] = "User";
    PartyType[PartyType["Application"] = 2] = "Application";
    PartyType[PartyType["ApplicationInstance"] = 3] = "ApplicationInstance";
    PartyType[PartyType["Conversation"] = 4] = "Conversation";
    PartyType[PartyType["ConversationIdentityType"] = 5] = "ConversationIdentityType";
    PartyType[PartyType["Encrypted"] = 6] = "Encrypted";
    PartyType[PartyType["Guest"] = 7] = "Guest";
    PartyType[PartyType["Phone"] = 8] = "Phone";
    PartyType[PartyType["Device"] = 9] = "Device";
})(PartyType = exports.PartyType || (exports.PartyType = {}));
var Modality;
(function (Modality) {
    Modality[Modality["Unknown"] = 0] = "Unknown";
    Modality[Modality["Audio"] = 1] = "Audio";
    Modality[Modality["Video"] = 2] = "Video";
})(Modality = exports.Modality || (exports.Modality = {}));
var MediaState;
(function (MediaState) {
    MediaState[MediaState["Inactive"] = 0] = "Inactive";
    MediaState[MediaState["SendOnly"] = 1] = "SendOnly";
    MediaState[MediaState["ReceiveOnly"] = 2] = "ReceiveOnly";
    MediaState[MediaState["SendReceive"] = 3] = "SendReceive";
    MediaState[MediaState["Unknown"] = 4] = "Unknown";
})(MediaState = exports.MediaState || (exports.MediaState = {}));
var ResultCode;
(function (ResultCode) {
    ResultCode[ResultCode["Ok"] = 0] = "Ok";
    ResultCode[ResultCode["BadRequest"] = 1] = "BadRequest";
    ResultCode[ResultCode["NotFound"] = 2] = "NotFound";
    ResultCode[ResultCode["NotAcceptable"] = 3] = "NotAcceptable";
    ResultCode[ResultCode["ExpectationFailed"] = 4] = "ExpectationFailed";
    ResultCode[ResultCode["NoTarget"] = 5] = "NoTarget";
    ResultCode[ResultCode["InvalidTenantId"] = 6] = "InvalidTenantId";
    ResultCode[ResultCode["InvalidBot"] = 7] = "InvalidBot";
    ResultCode[ResultCode["NoId"] = 8] = "NoId";
    ResultCode[ResultCode["NoPlayList"] = 9] = "NoPlayList";
    ResultCode[ResultCode["InvalidArgs"] = 10] = "InvalidArgs";
    ResultCode[ResultCode["NoInviteeProvided"] = 11] = "NoInviteeProvided";
    ResultCode[ResultCode["CallNotFound"] = 12] = "CallNotFound";
    ResultCode[ResultCode["Accepted"] = 13] = "Accepted";
    ResultCode[ResultCode["Created"] = 14] = "Created";
    ResultCode[ResultCode["FailToRetrievePartipants"] = 15] = "FailToRetrievePartipants";
    ResultCode[ResultCode["ParticipantsNotFound"] = 16] = "ParticipantsNotFound";
    ResultCode[ResultCode["CallIsNotGroupCall"] = 17] = "CallIsNotGroupCall";
    ResultCode[ResultCode["TargetTypeNotSupported"] = 18] = "TargetTypeNotSupported";
    ResultCode[ResultCode["InvalidEndpoint"] = 19] = "InvalidEndpoint";
    ResultCode[ResultCode["InvalidCallState"] = 20] = "InvalidCallState";
    ResultCode[ResultCode["ResourceBusy"] = 21] = "ResourceBusy";
    ResultCode[ResultCode["PartialFailure"] = 22] = "PartialFailure";
})(ResultCode = exports.ResultCode || (exports.ResultCode = {}));
//# sourceMappingURL=CCCallState.js.map