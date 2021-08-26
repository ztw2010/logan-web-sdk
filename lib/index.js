var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { LogEncryptMode } from './interface';
import Config from './global-config';
import { isValidDay } from './lib/utils';
import { ResultMsg } from './interface';
import LogManager from './log-manager';
import saveLog from './save-log';
import reportLog from './report-log';
var logQueueBeforeLoad = [];
function logContentWrapper(content, logType) {
    var logOb = {
        t: logType,
        c: "" + encodeURIComponent(content),
        d: "" + Date.now(),
    };
    return JSON.stringify(logOb);
}
function reportParamChecker(reportConfig) {
    if (!reportConfig) {
        throw new Error('reportConfig needs to be an object');
    }
    var dayFormatDesc = 'is not valid, needs to be YYYY-MM-DD format';
    if (!isValidDay(reportConfig.fromDayString)) {
        throw new Error("fromDayString " + dayFormatDesc);
    }
    if (!isValidDay(reportConfig.toDayString)) {
        throw new Error("toDayString " + dayFormatDesc);
    }
    if (reportConfig.fromDayString > reportConfig.toDayString) {
        throw new Error('fromDayString needs to be no bigger than toDayString');
    }
}
function logParamChecker(logType, encryptVersion) {
    if (typeof logType !== 'number') {
        throw new Error('logType needs to be set');
    }
    if (encryptVersion === LogEncryptMode.RSA) {
        if (!Config.get('publicKey')) {
            throw new Error('publicKey needs to be set before logWithEncryption');
        }
    }
}
function logAsync(logItem) {
    return __awaiter(this, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!LogManager.canSave()) return [3 /*break*/, 6];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 5]);
                    return [4 /*yield*/, saveLog(logItem)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    e_1 = _a.sent();
                    LogManager.errorTrigger();
                    return [4 /*yield*/, Config.get('errorHandler')(e_1)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 5: return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, Config.get('errorHandler')(new Error(ResultMsg.EXCEED_TRY_TIMES))];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8: return [2 /*return*/];
            }
        });
    });
}
function logIfLoaded(logItem) {
    if (!document.readyState || (document.readyState && document.readyState === 'complete')) {
        logAsync(logItem);
    }
    else {
        logQueueBeforeLoad.push(logItem);
    }
}
function standardLog(content, logType, encryptVersion) {
    try {
        logParamChecker(logType, LogEncryptMode.PLAIN);
    }
    catch (e) {
        Config.get('errorHandler')(e);
    }
    logIfLoaded({
        logContent: logContentWrapper(content, logType),
        encryptVersion: encryptVersion,
    });
}
function onWindowLoad() {
    logQueueBeforeLoad.forEach(function (logItem) {
        logAsync(logItem);
    });
    logQueueBeforeLoad = [];
    window.removeEventListener('load', onWindowLoad);
}
window.addEventListener('load', onWindowLoad);
/**
 * Set global settings for this single Logan instance. Usually you only need to call this once after Logan is imported. Each time this method is called, all previous global configs will be overwritten by current settings.
 *
 * @param globalConfig Global settings
 */
export function initConfig(globalConfig) {
    Config.set(globalConfig);
}
/**
 * Save one log locally.
 * @param content Log content.
 * @param logType Log type.
 */
export function log(content, logType) {
    standardLog(content, logType, LogEncryptMode.PLAIN);
}
/**
 * Save one confidential log locally. Before saving, the log content will be encrypted and it is very hard to crack after then.
 * @param content Log content.
 * @param logType Log type.
 */
export function logWithEncryption(content, logType) {
    standardLog(content, logType, LogEncryptMode.RSA);
}
/**
 * Save custom formatted log content locally.
 * @param {LogConfig} logConfig
 */
export function customLog(logConfig) {
    logIfLoaded({
        logContent: logConfig.logContent,
        encryptVersion: logConfig.encryptVersion,
    });
}
/**
 * Report local logs to the server side.
 *
 * @param reportConfig Config for this report.
 * @returns {Promise<ReportResult>} Reject with an Error if anything goes wrong during the report process. Resolve ReportResult if the process is successful.
 */
export function report(reportConfig) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            reportParamChecker(reportConfig);
            return [2 /*return*/, reportLog(reportConfig)];
        });
    });
}
export default {
    initConfig: initConfig,
    log: log,
    logWithEncryption: logWithEncryption,
    report: report,
    customLog: customLog,
    ResultMsg: ResultMsg,
};
//# sourceMappingURL=index.js.map