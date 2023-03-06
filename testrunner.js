"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTests = void 0;
const mocha_1 = __importDefault(require("mocha"));
function runTests() {
    const mocha = new mocha_1.default({ timeout: 5000 });
}
exports.runTests = runTests;
//# sourceMappingURL=testrunner.js.map