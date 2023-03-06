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
exports.RunConfig = void 0;
const os = __importStar(require("os"));
const config = __importStar(require("./runConfiguration.json"));
/*
export interface ccParameters {
    clientWebUrl: string;
    userName: string;
    password: string;
    numberToDial: string;
}

export interface Config {
    connectionString: string;
    mongodb: string;
    tenantId: string;
    teamsAdapterUrl: string;
    callbackUrl: string;
    freeswitchEslIp: string;
    freeswitchEslPassword: string;
    usePlugin: string;
    numberToDial: string;
    subscriptionId: string;
    teamAudioCallbackUrl: string;
    logToConsole: boolean,
    logRoot: string;
    ccSystem: ccParameters;
}
*/
class RunConfig {
    constructor() {
    }
    get Config() {
        return this._config;
    }
    static getInstance() {
        return RunConfig._instance;
    }
    loadTargetSystems() {
        return config.ccSystems;
    }
    loadConfig() {
        const host = os.hostname().toLowerCase();
        console.log(host);
        let c = config.environments.find(m => m.hostname.startsWith(host));
        if (c) {
            // @ts-ignore
            this._config = c;
        }
        c = config.environments.find(m => m.hostname == 'default');
        if (c) {
            // @ts-ignore
            this._config = c;
        }
        return this._config;
    }
    loadConfigs() {
        const host = os.hostname().toLowerCase();
        console.log(host);
        let c = config.environments.find(m => m.hostname.startsWith(host));
        if (c) {
            // @ts-ignore
            this._config = c;
        }
        return config.environments;
    }
}
exports.RunConfig = RunConfig;
RunConfig._instance = new RunConfig();
//# sourceMappingURL=RunConfig.js.map