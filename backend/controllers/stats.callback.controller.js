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
exports.StatsCallbackController = void 0;
const express = __importStar(require("express"));
const callMaker_1 = require("../callMaker");
class StatsCallbackController {
    constructor(logger, dataLogger, callController) {
        this.logger = logger;
        this.dataLogger = dataLogger;
        this.callController = callController;
        this.Routes = express.Router();
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.Routes.get('/api/v1/load/stats/:id', (req, resp, next) => {
            var id = req.params.id;
            this.dataLogger.getCallStats(id).then((data) => {
                resp.json(data);
                resp.status(200);
                resp.end();
            });
        });
        this.Routes.get('/api/v1/load/report/:id', (req, resp, next) => {
            var id = req.params.id;
            this.dataLogger.getReportData(id).then((data) => {
                resp.json(data);
                resp.status(200);
                resp.end();
            });
        });
        this.Routes.delete('/api/v1/load/stats/:id', (req, resp, next) => {
            var id = req.params.id;
            this.dataLogger.deleteCallStats(id).then((data) => {
                resp.json({});
                resp.status(200);
                resp.end();
            });
        });
        this.Routes.get('/api/v1/load/tests', (req, resp, next) => {
            this.dataLogger.getTestRuns().then((data) => {
                resp.json(data);
                resp.status(200);
                resp.end();
            });
        });
        this.Routes.post('/api/v1/load/tests', async (req, resp, next) => {
            this.logger.info({
                request: req.body
            });
            const result = await this.callController.startTest(req.body);
            resp.json(result);
            resp.status(200);
            resp.end();
        });
        this.Routes.patch('/api/v1/drop', async (req, resp, next) => {
            this.logger.info({
                request: req.body
            });
            const callMaker = callMaker_1.CallMaker.getInstance();
            callMaker.dropAllCalls();
            resp.type('application/json');
            resp.status(200);
            resp.end();
        });
        this.Routes.patch('/api/v1/staggerdrop', async (req, resp, next) => {
            const sr = req.body;
            this.logger.info({
                request: sr
            });
            this.callController.staggerDropCalls(sr.stagger);
            resp.type('application/json');
            resp.status(200);
            resp.end();
        });
    }
}
exports.StatsCallbackController = StatsCallbackController;
exports.default = StatsCallbackController;
//# sourceMappingURL=stats.callback.controller.js.map