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
class StatsConfigController {
    constructor(logger) {
        this.logger = logger;
        this.Routes = express.Router();
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.Routes.get('/api/v1/config', (req, resp, next) => {
            var id = req.params.id;
            const runConfig = RunConfig_1.RunConfig.getInstance().loadConfigs();
            resp.json(runConfig);
            resp.status(200);
            resp.end();
        });
        this.Routes.get('/api/v1/config/current', (req, resp, next) => {
            var id = req.params.id;
            const runConfig = RunConfig_1.RunConfig.getInstance().loadConfig();
            resp.json({
                config: runConfig,
                token: this.Token
            });
            resp.status(200);
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
    }
}
exports.StatsConfigController = StatsConfigController;
exports.default = StatsConfigController;
//# sourceMappingURL=system.config.controller.js.map