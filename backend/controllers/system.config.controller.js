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
exports.StatsConfigController = void 0;
const express = __importStar(require("express"));
const RunConfig_1 = require("../RunConfig");
const glob_1 = require("glob");
const fs = __importStar(require("fs-extra"));
const xml_js_1 = require("xml-js");
class StatsConfigController {
    constructor(logger) {
        this.logger = logger;
        this.Routes = express.Router();
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.Routes.get('/api/v1/config/current', (req, resp, next) => {
            var id = req.params.id;
            const runConfig = RunConfig_1.RunConfig.getInstance().loadConfig();
            resp.json({
                config: runConfig,
                token: ''
            });
            resp.status(200);
            resp.end();
        });
        this.Routes.post('/api/v1/config/current', async (req, resp, next) => {
            this.logger.info({
                request: req.body
            });
            try {
                const sys = await RunConfig_1.RunConfig.getInstance().setServer(req.body);
                resp.json(sys);
                resp.status(200);
            }
            catch (e) {
                console.dir(e);
                resp.status(e.status);
            }
            resp.end();
        });
        this.Routes.get('/api/v1/systems', (req, resp, next) => {
            var id = req.params.id;
            const runConfig = RunConfig_1.RunConfig.getInstance().loadTargetSystems();
            resp.json({
                systems: runConfig,
            });
            resp.status(200);
            resp.end();
        });
        this.Routes.get('/api/v1/trunks', async (req, resp, next) => {
            const ta = [];
            const trunks = await glob_1.glob('trunks/*.xml');
            var options = { compact: true, ignoreComment: true, spaces: 4 };
            await Promise.all(trunks.map(async (t) => {
                const xstring = await fs.readFile(t, 'utf8');
                const j = xml_js_1.xml2js(xstring, options);
                const name = j.include.gateway._attributes.name;
                const p = j.include.gateway.param.find((p) => p._attributes.name === 'proxy');
                const r = j.include.gateway.param.find((p) => p._attributes.name === 'realm');
                const ipAddress = p._attributes.value;
                const realm = r._attributes.value;
                ta.push({
                    file: t,
                    name: name,
                    ipAddress: ipAddress,
                    realm: realm
                });
            }));
            this.logger.info('files', {
                trunks: ta
            });
            resp.json(ta);
            resp.status(200);
            resp.end();
        });
    }
}
exports.StatsConfigController = StatsConfigController;
exports.default = StatsConfigController;
//# sourceMappingURL=system.config.controller.js.map