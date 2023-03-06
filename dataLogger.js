"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataLogger = exports.ReportRecord = exports.ReportSummary = void 0;
const mongodb_1 = require("mongodb");
const RunConfig_1 = require("./RunConfig");
class CallInfo {
    constructor() {
        this.errors = [];
    }
}
class ReportSummary {
}
exports.ReportSummary = ReportSummary;
class ReportRecord {
    constructor() {
        this.summary = new ReportSummary;
        this.callInfo = [];
    }
}
exports.ReportRecord = ReportRecord;
class DataLogger {
    constructor(logger) {
        this.logger = logger;
        const config = RunConfig_1.RunConfig.getInstance().loadConfig();
        this.logger.info('connect to mongo', {
            mongo: `${config.connectionString}/${config.mongodb}`,
        });
        this.client = new mongodb_1.MongoClient(`${config.connectionString}/${config.mongodb}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
    async connect() {
        try {
            await this.client.connect();
            this.db = this.client.db('loadtest').collection('runResults');
        }
        catch (error) {
            this.logger.log('info', {
                mongo: 'Db not preset, will not log',
                error: error
            });
        }
    }
    async logCall(d) {
        return new Promise(async (resolve, reject) => {
            if (this.db) {
                console.log(`Attempt to log ${d}`);
                const record = await this.db.insertOne(d);
                resolve(true);
            }
            else {
                console.log(`Attempt to log NOT CONNECTED`);
                reject();
            }
        });
    }
    addNewTest(testDef) {
        return new Promise((resolve, reject) => {
            this.client.db('loadtest').collection('runs').insertOne(testDef, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    getCallStats(id) {
        console.log(`get stats for test ${id}`);
        return new Promise((resolve, reject) => {
            this.client.db('loadtest').collection('runResults').find({ runId: new mongodb_1.ObjectId(id) }).toArray(function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    getReportData(id) {
        console.log(`get stats for test ${id}`);
        return new Promise((resolve, reject) => {
            this.client.db('loadtest').collection('runResults').find({ runId: new mongodb_1.ObjectId(id) }).toArray((err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    const repData = this.calculateCCReportData(id, result);
                    resolve(repData);
                }
            });
        });
    }
    getReportSummaryData(runId) {
        const summary = new ReportSummary;
        summary.runId = runId;
        summary.xlabels = Array();
        summary.xlabels.push('call setup');
        summary.xlabels.push('call queued');
        summary.xlabels.push('annc delay');
        summary.xlabels.push('drop delay');
        return summary;
    }
    calculateCCReportData(runId, calls) {
        const reportData = new ReportRecord;
        reportData.summary = this.getReportSummaryData(runId);
        reportData.callInfo = calls.sort((ca1, ca2) => ca1.callIndex - ca2.callIndex);
        return reportData;
    }
    deleteCallStats(id) {
        console.log(`get stats for test ${id}`);
        return new Promise((resolve, reject) => {
            this.client.db('loadtest').collection('runResults').deleteMany({ runId: new mongodb_1.ObjectId(id) }).then(res => {
                console.log(`Delete results returned ${res}`);
                this.client.db('loadtest').collection('runs').deleteOne({ _id: new mongodb_1.ObjectId(id) }).then(res => {
                    console.log(`Delete test returned ${res}`);
                    resolve(true);
                });
            });
        });
    }
    getTestRuns() {
        return new Promise((resolve, reject) => {
            this.client.db('loadtest').collection('runs').find({}).toArray(function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
}
exports.DataLogger = DataLogger;
//# sourceMappingURL=dataLogger.js.map