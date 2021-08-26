var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { ResultMsg } from './interface';
import LoganDB from './lib/logan-db';
import { LOG_DAY_TABLE_PRIMARY_KEY } from './lib/logan-db';
import Config from './global-config';
import Ajax from './lib/ajax';
import { dayFormat2Date, ONE_DAY_TIME_SPAN, dateFormat2Day } from './lib/utils';
import { invokeInQueue } from './logan-operation-queue';
var LoganDBInstance;
/**
 * @returns Promise<number> with reported pageIndex if this page has logs, otherwise Promise<null>.
 */
function getLogAndSend(reportName, reportConfig) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var logItems, pageIndex_1, logItemStrings, logReportOb, customXHROpts_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, LoganDBInstance.getLogsByReportName(reportName)];
                case 1:
                    logItems = _b.sent();
                    if (!(logItems.length > 0)) return [3 /*break*/, 3];
                    pageIndex_1 = LoganDBInstance.logReportNameParser(reportName).pageIndex;
                    logItemStrings = logItems.map(function (logItem) {
                        return encodeURIComponent(logItem.logString);
                    });
                    logReportOb = LoganDBInstance.logReportNameParser(reportName);
                    customXHROpts_1 = typeof reportConfig.xhrOptsFormatter === 'function'
                        ? reportConfig.xhrOptsFormatter(logItemStrings, logReportOb.pageIndex + 1, logReportOb.logDay)
                        : {};
                    return [4 /*yield*/, Ajax(customXHROpts_1.reportUrl || reportConfig.reportUrl || Config.get('reportUrl'), customXHROpts_1.data ||
                            JSON.stringify({
                                client: 'Web',
                                webSource: "" + (reportConfig.webSource || ''),
                                deviceId: reportConfig.deviceId,
                                environment: "" + (reportConfig.environment || ''),
                                customInfo: "" + (reportConfig.customInfo || ''),
                                logPageNo: logReportOb.pageIndex + 1,
                                fileDate: logReportOb.logDay,
                                logArray: logItems
                                    .map(function (logItem) {
                                    return encodeURIComponent(logItem.logString);
                                })
                                    .toString(),
                            }), (_a = customXHROpts_1.withCredentials) !== null && _a !== void 0 ? _a : false, 'POST', customXHROpts_1.headers || {
                            'Content-Type': 'application/json',
                            Accept: 'application/json,text/javascript',
                        }).then(function (responseText) {
                            if (typeof customXHROpts_1.responseDealer === 'function') {
                                var result = customXHROpts_1.responseDealer(responseText);
                                if (result.resultMsg === ResultMsg.REPORT_LOG_SUCC) {
                                    return pageIndex_1;
                                }
                                else {
                                    throw new Error(result.desc);
                                }
                            }
                            else {
                                var response = void 0;
                                try {
                                    response = JSON.parse(responseText);
                                }
                                catch (e) {
                                    throw new Error("Try to parse response failed, responseText: " + responseText);
                                }
                                if ((response === null || response === void 0 ? void 0 : response.code) === 200) {
                                    return pageIndex_1;
                                }
                                else {
                                    throw new Error("Server error, code: " + (response === null || response === void 0 ? void 0 : response.code));
                                }
                            }
                        })];
                case 2: return [2 /*return*/, _b.sent()];
                case 3: 
                // Resolve directly if no logs in current page.
                return [2 /*return*/, Promise.resolve(null)];
            }
        });
    });
}
export default function reportLog(reportConfig) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!LoganDB.idbIsSupported()) return [3 /*break*/, 1];
                    throw new Error(ResultMsg.DB_NOT_SUPPORT);
                case 1:
                    if (!LoganDBInstance) {
                        LoganDBInstance = new LoganDB(Config.get('dbName'));
                    }
                    return [4 /*yield*/, invokeInQueue(function () { return __awaiter(_this, void 0, void 0, function () {
                            var logDaysInfoList, logReportMap, reportResult, startDate, endDate, logTime, logDay, batchReportResults, reportedPageIndexes, e_1, e_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, LoganDBInstance.getLogDaysInfo(reportConfig.fromDayString, reportConfig.toDayString)];
                                    case 1:
                                        logDaysInfoList = _a.sent();
                                        logReportMap = logDaysInfoList.reduce(function (acc, logDayInfo) {
                                            var _a;
                                            return __assign((_a = {}, _a[logDayInfo[LOG_DAY_TABLE_PRIMARY_KEY]] = logDayInfo.reportPagesInfo
                                                ? logDayInfo.reportPagesInfo.pageSizes.map(function (i, pageIndex) {
                                                    return LoganDBInstance.logReportNameFormatter(logDayInfo[LOG_DAY_TABLE_PRIMARY_KEY], pageIndex);
                                                })
                                                : [], _a), acc);
                                        }, {});
                                        reportResult = {};
                                        startDate = dayFormat2Date(reportConfig.fromDayString);
                                        endDate = dayFormat2Date(reportConfig.toDayString);
                                        logTime = +startDate;
                                        _a.label = 2;
                                    case 2:
                                        if (!(logTime <= +endDate)) return [3 /*break*/, 14];
                                        logDay = dateFormat2Day(new Date(logTime));
                                        if (!(logReportMap[logDay] && logReportMap[logDay].length > 0)) return [3 /*break*/, 12];
                                        _a.label = 3;
                                    case 3:
                                        _a.trys.push([3, 10, , 11]);
                                        return [4 /*yield*/, Promise.all(logReportMap[logDay].map(function (reportName) {
                                                return getLogAndSend(reportName, reportConfig);
                                            }))];
                                    case 4:
                                        batchReportResults = _a.sent();
                                        reportResult[logDay] = {
                                            msg: ResultMsg.REPORT_LOG_SUCC,
                                        };
                                        _a.label = 5;
                                    case 5:
                                        _a.trys.push([5, 8, , 9]);
                                        reportedPageIndexes = batchReportResults.filter(function (reportedPageIndex) { return reportedPageIndex !== null; });
                                        if (!(reportedPageIndexes.length > 0 && reportConfig.incrementalReport)) return [3 /*break*/, 7];
                                        // Delete logs of reported pages after report.
                                        return [4 /*yield*/, LoganDBInstance.incrementalDelete(logDay, reportedPageIndexes)];
                                    case 6:
                                        // Delete logs of reported pages after report.
                                        _a.sent();
                                        _a.label = 7;
                                    case 7: return [3 /*break*/, 9];
                                    case 8:
                                        e_1 = _a.sent();
                                        return [3 /*break*/, 9];
                                    case 9: return [3 /*break*/, 11];
                                    case 10:
                                        e_2 = _a.sent();
                                        reportResult[logDay] = {
                                            msg: ResultMsg.REPORT_LOG_FAIL,
                                            desc: e_2.message || e_2.stack || JSON.stringify(e_2),
                                        };
                                        return [3 /*break*/, 11];
                                    case 11: return [3 /*break*/, 13];
                                    case 12:
                                        reportResult[logDay] = { msg: ResultMsg.NO_LOG };
                                        _a.label = 13;
                                    case 13:
                                        logTime += ONE_DAY_TIME_SPAN;
                                        return [3 /*break*/, 2];
                                    case 14: return [2 /*return*/, reportResult];
                                }
                            });
                        }); })];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
//# sourceMappingURL=report-log.js.map