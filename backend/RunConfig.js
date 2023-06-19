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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunConfig = void 0;
const os = __importStar(require("os"));
const config = __importStar(require("./runConfiguration.json"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const rxjs_1 = require("rxjs");
class RunConfig {
    constructor() {
        this.systemChange = new rxjs_1.Subject();
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
    loadTrunks() {
        const fs = require('fs');
        var parser = require('xml2json');
        fs.readFile('./trunks/data.xml', function (err, data) {
            var json = parser.toJson(data);
            console.log("to json ->", json);
        });
    }
    async signOut() {
        if (!this.si) {
            return;
        }
        try {
            let creds = await node_fetch_1.default(`${this.si.ccSystem.clientWebUrl}/api/v1/authentication/signout`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
        }
        catch (e) {
            console.log('Error logging out');
            console.log(e);
        }
        const c = {
            ccSystem: this.si.ccSystem,
            token: ''
        };
        this.systemChange.next(c);
        return c;
    }
    async setServer(server) {
        let token = '';
        try {
            let creds = await node_fetch_1.default(`${server.clientWebUrl}/touchpoint/api/v1/Authentication/credentials`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'username': server.userName,
                    'password': server.password
                },
            });
            const loginState = await creds.json();
            token = `Bearer ${loginState.token}`;
        }
        catch (e) {
            console.log('Error logging in');
            console.log(e);
        }
        const c = {
            ccSystem: server,
            token: token
        };
        this.systemChange.next(c);
        return c;
    }
    loadConfig() {
        const host = os.hostname().toLowerCase();
        console.log(host);
        this._config = config.environment;
        return this._config;
    }
}
exports.RunConfig = RunConfig;
RunConfig._instance = new RunConfig();
//# sourceMappingURL=RunConfig.js.map