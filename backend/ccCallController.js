"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ccCallController = void 0;
const ccQueueApi_1 = require("./api/ccQueueApi");
const RunConfig_1 = require("./RunConfig");
class ccCallController {
    constructor(logger, notifier, serverUrl, dataLogger) {
        this.logger = logger;
        this.notifier = notifier;
        this.dataLogger = dataLogger;
        const config = RunConfig_1.RunConfig.getInstance().loadConfig();
        this.ccQueueApi = new ccQueueApi_1.ccQueueApi(config.teamsAdapterUrl, logger);
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
    }
    staggerDropCalls(interval) {
        throw new Error('Method not implemented.');
    }
    onNewCall(newCall) {
        throw new Error('Method not implemented.');
    }
    onCallQueued(queued) {
        throw new Error('Method not implemented.');
    }
    onCallComplete(terminate) {
        throw new Error('Method not implemented.');
    }
    onAnnounceStatus(state) {
        throw new Error('Method not implemented.');
    }
    onDtmfKey(d) {
        throw new Error('Method not implemented.');
    }
    startTest(testDef) {
        throw new Error("Method not implemented.");
    }
}
exports.ccCallController = ccCallController;
//# sourceMappingURL=ccCallController.js.map