"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallMaker = exports.fsConnectionResult = void 0;
const freeswitch = __importStar(require("modesl"));
const rxjs_1 = require("rxjs");
var fsConnectionResult;
(function (fsConnectionResult) {
    fsConnectionResult[fsConnectionResult["connected"] = 0] = "connected";
    fsConnectionResult[fsConnectionResult["failed"] = 1] = "failed";
})(fsConnectionResult = exports.fsConnectionResult || (exports.fsConnectionResult = {}));
class CallMaker {
    constructor() {
        this.isConnected = false;
        this.connectToFreeswitch = (config) => {
            return new Promise((resolve, reject) => {
                console.log(`Connect to ${config.freeswitchEslIp}`);
                if (this.isConnected) {
                    console.log('already connected, use existing connection');
                    resolve(fsConnectionResult.connected); // this.eslConn
                }
                else {
                    console.log('try fs connect');
                    this.eslConn = new freeswitch.Connection(config.freeswitchEslIp, 8021, config.freeswitchEslPassword)
                        .on("error", (error) => {
                        console.log('ESL Connection Error ' + JSON.stringify(error));
                    });
                    freeswitch.setLogLevel(7);
                    this.eslConn.on("esl::end", () => {
                        console.log('ESL Connection Ended');
                        this.isConnected = false;
                        reject(fsConnectionResult.failed);
                    });
                    this.eslConn.on("esl::ready", () => {
                        // Subscribe to events
                        this.eslConn?.events('json', 'ALL', function () {
                            console.log('ESL ready - subscribed to receive events.');
                        });
                        this.isConnected = true;
                        resolve(fsConnectionResult.connected); // this.eslConn
                    });
                    this.eslConn.on("esl::event::**", (event, headers, body) => {
                        if (event.type === 'CUSTOM' && event.subclass === "load") {
                            const state = event.headers.find((e) => e.name == 'state');
                            const callerId = event.headers.find((e) => e.name == 'callerId');
                            const sipId = event.headers.find((e) => e.name == 'freeswitchId');
                            const reason = event.headers.find((e) => e.name == 'reason');
                            this.logger.log('error', {
                                callerId: callerId,
                                sipId: sipId,
                                state: state
                            });
                            this._notifier.SipEvents.next({
                                State: (state) ? state.value : 'unknown',
                                callerId: (callerId) ? callerId.value : 'unknown',
                                freeswitchId: (sipId) ? sipId.value : '',
                                reason: (reason) ? reason.value : ''
                            });
                        }
                    });
                }
            });
        };
    }
    set Notifier(n) {
        this._notifier = n;
    }
    static getInstance() {
        return CallMaker._instance;
    }
    //    testDef: NewTest
    //public makeCalls (testRef: string, numberToDial: string, cliBase: string, numberOfCalls: number, stagger: number, record: boolean, eachone: any): void {
    makeCalls(reference, testdef, record, eachone) {
        if (!this.eslConn) {
            this.logger.log('error', { freeswitch: 'Not connected' });
            return;
        }
        let delay = 0;
        for (let i = 0; i < testdef.NumberOfCalls; i++) {
            let trunkRoute = {
                name: '',
                ipaddress: ''
            };
            if (testdef.Trunks.length > 0) {
                trunkRoute = testdef.Trunks[i % testdef.Trunks.length];
            }
            delay = delay + testdef.Stagger;
            let cli = `${testdef.CliPattern}${i}`;
            this.logger.log('info', { freeswitch: `make call to ${testdef.NumberToDial} from ${cli} in route ${trunkRoute.name}` });
            eachone(cli, delay, i + 1);
            this.eslConn.api('luarun', ['outboundload.lua', reference, testdef.NumberToDial, cli, trunkRoute.name, delay.toString(), record ? 'record' : 'noRecord']);
        }
    }
    dropAllCalls() {
        if (!this.eslConn) {
            this.logger.log('error', { freeswitch: 'Not connected' });
            return;
        }
        this.eslConn.api('hupall', []);
    }
    dropCall(uuid) {
        if (!this.eslConn) {
            this.logger.log('error', { freeswitch: 'Not connected' });
            return;
        }
        this.eslConn.api('uuid_kill', [uuid]);
    }
    getSipProfiles() {
        if (!this.eslConn) {
            this.logger.log('error', { freeswitch: 'Not connected' });
            return rxjs_1.of([]);
        }
        return new rxjs_1.Observable(ob => {
            this.logger.log('error', { freeswitch: 'getting SIPProfiles' });
            this.eslConn?.bgapi('sofia', ['status', 'gateway'], (response) => {
                this.logger.log('error', {
                    freeswitch: 'got SIPProfiles',
                    response: response
                });
                const trunks = [];
                console.dir('SOFIA');
                console.dir(typeof response);
                const s = JSON.stringify(response);
                const lines = s.split('\\n');
                lines.forEach(l => {
                    let ipaddress = '';
                    const tns = l.indexOf('external::');
                    if (tns != -1) {
                        const ips = l.indexOf('@');
                        if (ips != -1) {
                            const ipe = l.indexOf('\\t', ips);
                            if (ipe !== -1) {
                                ipaddress = `${l.substr(ips + 1, ipe - ips - 1)}`;
                            }
                        }
                        const tne = l.indexOf('\\t', tns);
                        const name = `${l.substr(tns + 10, tne - tns - 10)}`;
                        trunks.push({
                            name: name,
                            ipaddress: ipaddress
                        });
                    }
                });
                ob.next(trunks);
                ob.complete();
            });
        });
    }
}
exports.CallMaker = CallMaker;
CallMaker._instance = new CallMaker();
//# sourceMappingURL=callMaker.js.map