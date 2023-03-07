"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallTerminatedArgs = exports.AnnounceStateArgs = exports.DtmfArgs = exports.CallQueuedArgs = exports.PluginType = void 0;
var PluginType;
(function (PluginType) {
    PluginType[PluginType["PassThru"] = 0] = "PassThru";
    PluginType[PluginType["Trio"] = 1] = "Trio";
    PluginType[PluginType["QueueApi"] = 2] = "QueueApi";
    PluginType[PluginType["CCSystem"] = 3] = "CCSystem";
})(PluginType = exports.PluginType || (exports.PluginType = {}));
class CallQueuedArgs {
    constructor(CallId, hrefDrop, hrefAnnounce, hrefSubscribeDtmf) {
        this.CallId = CallId;
        this.hrefDrop = hrefDrop;
        this.hrefAnnounce = hrefAnnounce;
        this.hrefSubscribeDtmf = hrefSubscribeDtmf;
    }
}
exports.CallQueuedArgs = CallQueuedArgs;
class DtmfArgs {
    constructor(CallId, DtmfKey) {
        this.CallId = CallId;
        this.DtmfKey = DtmfKey;
    }
}
exports.DtmfArgs = DtmfArgs;
class AnnounceStateArgs {
    constructor(CallId, hrefDrop, hrefAnnounce, hrefCancelAnnounce, PlayResult) {
        this.CallId = CallId;
        this.hrefDrop = hrefDrop;
        this.hrefAnnounce = hrefAnnounce;
        this.hrefCancelAnnounce = hrefCancelAnnounce;
        this.PlayResult = PlayResult;
    }
}
exports.AnnounceStateArgs = AnnounceStateArgs;
class CallTerminatedArgs {
    constructor(CallId) {
        this.CallId = CallId;
    }
}
exports.CallTerminatedArgs = CallTerminatedArgs;
//# sourceMappingURL=types.js.map