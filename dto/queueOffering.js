"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DtmfKeyPress = exports.AnnounceEvent = exports.AnnounceReason = exports.CallStateInfoArgs = exports.CallStateEvent = exports.CallParticipantRole = void 0;
var CallParticipantRole;
(function (CallParticipantRole) {
    CallParticipantRole[CallParticipantRole["bot"] = 0] = "bot";
    CallParticipantRole[CallParticipantRole["caller"] = 1] = "caller";
    CallParticipantRole[CallParticipantRole["member"] = 2] = "member";
})(CallParticipantRole = exports.CallParticipantRole || (exports.CallParticipantRole = {}));
class CallStateEvent {
    constructor() {
        this.InitiatingEvent = "";
        this.CallState = new CallStateInfoArgs();
    }
}
exports.CallStateEvent = CallStateEvent;
class CallStateInfoArgs {
    constructor() {
        this.Id = "";
        this.State = "";
        this.Actions = [];
        this.Parties = new Array();
    }
}
exports.CallStateInfoArgs = CallStateInfoArgs;
class AnnounceReason {
    constructor() {
        this.Reason = "";
        this.State = "";
        this.Key = 0;
    }
}
exports.AnnounceReason = AnnounceReason;
class AnnounceEvent {
    constructor() {
        this.InitiatingEvent = "";
        this.Announce = new AnnounceReason();
        this.CallState = new CallStateInfoArgs();
    }
}
exports.AnnounceEvent = AnnounceEvent;
class DtmfKeyPress {
    constructor() {
        this.InitiatingEvent = "";
        this.DtmfKeyPress = 0;
        this.CallState = new CallStateInfoArgs();
    }
}
exports.DtmfKeyPress = DtmfKeyPress;
exports.default = CallStateInfoArgs;
//# sourceMappingURL=queueOffering.js.map