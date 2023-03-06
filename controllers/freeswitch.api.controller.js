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
exports.freeswitchApiController = void 0;
const express = __importStar(require("express"));
const callMaker_1 = require("../callMaker");
class freeswitchApiController {
    constructor(logger) {
        this.logger = logger;
        this.Routes = express.Router();
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.Routes.post('/fxapi', async (req, resp, next) => {
            this.logger.info({
                request: req.body
            });
            resp.type('application/xml');
            resp.status(200);
            resp.send('' +
                '<document type="freeswitch/xml">\n' +
                '  <section name="result">\n' +
                '    <result status="not found" />\n' +
                '  </section>\n' +
                '</document>');
            resp.end();
        });
        this.Routes.get('/fxapi/sipprofiles', async (req, resp, next) => {
            this.logger.info({
                message: 'peter was here',
                request: req.body
            });
            const callMaker = callMaker_1.CallMaker.getInstance();
            callMaker.getSipProfiles().subscribe((trunks) => {
                resp.type('application/json');
                resp.status(200);
                this.logger.info({
                    message: 'peter was here',
                    request: trunks
                });
                resp.json(trunks);
                resp.end();
            });
        });
    }
}
exports.freeswitchApiController = freeswitchApiController;
//# sourceMappingURL=freeswitch.api.controller.js.map