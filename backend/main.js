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
const express_1 = __importDefault(require("express"));
const request_logger_middleware_1 = require("./request.logger.middleware");
const notifier_1 = require("./notifier");
const cors_1 = __importDefault(require("cors"));
const winston = __importStar(require("winston"));
const dataLogger_1 = require("./dataLogger");
const stats_callback_controller_1 = __importDefault(require("./controllers/stats.callback.controller"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const liveCallNotifier_1 = require("./liveCallNotifier");
require("winston-daily-rotate-file");
const RunConfig_1 = require("./RunConfig");
const callMaker_1 = require("./callMaker");
const CCSystemManager_1 = require("./managers/CCSystemManager");
const cc_system_controller_1 = require("./controllers/cc.system.controller");
const system_config_controller_1 = __importDefault(require("./controllers/system.config.controller"));
const freeswitch_api_controller_1 = require("./controllers/freeswitch.api.controller");
const port = 8879;
// https://pb-enghouse-teams.ngrok.io/callback/calling for load
// https://retepmahnob.duckdns.org:5100/callback/calling
const runConfig = RunConfig_1.RunConfig.getInstance().loadConfig();
const transports = new Array();
transports.push(new winston.transports.DailyRotateFile({
    format: winston.format.combine(winston.format.timestamp(), winston.format.prettyPrint()),
    filename: `${runConfig.logRoot}loadtest-%DATE%.log`,
    datePattern: 'DD',
    zippedArchive: false,
    maxSize: '20m',
    maxFiles: '14d'
}));
if (runConfig.logToConsole) {
    transports.push(new winston.transports.Console({
        format: winston.format.combine(winston.format.timestamp(), winston.format.splat(), winston.format.prettyPrint())
    }));
}
const logger = winston.createLogger({
    level: 'info',
    transports: transports,
});
const app = express_1.default();
app.use(cors_1.default());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: true
}));
const statusNofier = new notifier_1.Notifier(logger);
app.use(function (req, res, next) {
    if (req.originalUrl.indexOf('audio/') !== -1) {
        console.log(JSON.stringify(req.headers));
        statusNofier.WaveRequest.next({
            AudioFile: req.originalUrl,
            ConversationId: req.headers['x-microsoft-skype-chain-id'],
            Offset: 0
        });
    }
    next();
});
app.use(request_logger_middleware_1.requestLoggerMiddleware);
app.use(express_1.default.static('static'));
let dataLogger = undefined;
if (runConfig.mongodb.length > 1) {
    dataLogger = new dataLogger_1.DataLogger(logger);
    dataLogger.connect().then(() => {
        logger.log('info', {
            message: 'Connected to mongodb'
        });
    }).catch(() => {
        logger.log('info', {
            message: 'Failed to connect to mongodb'
        });
    });
}
const systemConfigController = new system_config_controller_1.default(logger);
app.use(systemConfigController.Routes);
const callMaker = callMaker_1.CallMaker.getInstance();
callMaker.logger = logger;
setTimeout(() => {
    callMaker.connectToFreeswitch(runConfig);
}, 10000);
const fsapi = new freeswitch_api_controller_1.freeswitchApiController(logger);
app.use(fsapi.Routes);
callMaker.Notifier = statusNofier;
CCSystemManager_1.CCSystemManager.CreateAsync(runConfig, logger, statusNofier, dataLogger).then(callController => {
    setTimeout(() => {
        const cnew = new cc_system_controller_1.CcSystemController(logger, statusNofier, RunConfig_1.RunConfig.getInstance().systemChange);
        cnew.initRestApi().then(() => {
            logger.log('info', {
                message: 'init statsCallbackcontroller',
                token: CCSystemManager_1.CCSystemManager.token
            });
            if (dataLogger) {
                logger.log('info', {
                    message: 'init statsCallbackcontroller dataLogger',
                    token: CCSystemManager_1.CCSystemManager.token
                });
                const statsCallbackcontroller = new stats_callback_controller_1.default(logger, dataLogger, callController);
                statsCallbackcontroller.Token = CCSystemManager_1.CCSystemManager.token;
                app.use(statsCallbackcontroller.Routes);
            }
        });
    }, 4000);
});
const httpServer = http_1.createServer(app);
const io = new socket_io_1.Server(httpServer, {
    pingInterval: 10000,
    pingTimeout: 30000,
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const liveCallNotifier = liveCallNotifier_1.LiveCallNotifier.getInstance();
liveCallNotifier.createConnection(io, logger);
httpServer.listen(port);
//# sourceMappingURL=main.js.map