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
import { CustomDB, idbIsSupported, deleteDB } from 'idb-managed';
import { dateFormat2Day, M_BYTE, sizeOf, getStartOfDay, dayFormat2Date } from './utils';
import { ResultMsg } from '../interface';
var LOGAN_DB_VERSION = 1;
var LOGAN_DB_NAME = 'logan_web_db';
var LOG_DETAIL_TABLE_NAME = 'logan_detail_table';
var LOG_DETAIL_REPORTNAME_INDEX = 'logReportName';
var LOG_DETAIL_CREATETIME_INDEX = 'logCreateTime';
var LOG_DAY_TABLE_NAME = 'log_day_table';
export var LOG_DAY_TABLE_PRIMARY_KEY = 'logDay';
var DEFAULT_LOG_DURATION = 7 * 24 * 3600 * 1000; // logan-web keeps 7 days logs locally
var DEFAULT_SINGLE_DAY_MAX_SIZE = 7 * M_BYTE; // 7M storage limit for one day
var DEFAULT_SINGLE_PAGE_MAX_SIZE = 1 * M_BYTE; // 1M storage limit for one page
var LoganDB = /** @class */ (function () {
    function LoganDB(dbName) {
        var _a;
        this.DB = new CustomDB({
            dbName: dbName || LOGAN_DB_NAME,
            dbVersion: LOGAN_DB_VERSION,
            tables: (_a = {},
                _a[LOG_DETAIL_TABLE_NAME] = {
                    indexList: [
                        {
                            indexName: LOG_DETAIL_REPORTNAME_INDEX,
                            unique: false,
                        },
                        {
                            indexName: LOG_DETAIL_CREATETIME_INDEX,
                            unique: false,
                        },
                    ],
                },
                _a[LOG_DAY_TABLE_NAME] = {
                    primaryKey: LOG_DAY_TABLE_PRIMARY_KEY,
                },
                _a),
        });
    }
    /**
     * @param logDay
     * @param pageIndex start from 0
     */
    LoganDB.prototype.logReportNameFormatter = function (logDay, pageIndex) {
        return logDay + "_" + pageIndex;
    };
    LoganDB.prototype.logReportNameParser = function (reportName) {
        var splitArray = reportName.split('_');
        return {
            logDay: splitArray[0],
            pageIndex: +splitArray[1],
        };
    };
    LoganDB.prototype.getLogDayInfo = function (logDay) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.DB.getItem(LOG_DAY_TABLE_NAME, logDay)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    LoganDB.prototype.getLogDaysInfo = function (fromLogDay, toLogDay) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(fromLogDay === toLogDay)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.DB.getItem(LOG_DAY_TABLE_NAME, fromLogDay)];
                    case 1:
                        result = (_a.sent());
                        return [2 /*return*/, result ? [result] : []];
                    case 2: return [4 /*yield*/, this.DB.getItemsInRange({
                            tableName: LOG_DAY_TABLE_NAME,
                            indexRange: {
                                indexName: LOG_DAY_TABLE_PRIMARY_KEY,
                                lowerIndex: fromLogDay,
                                upperIndex: toLogDay,
                                lowerExclusive: false,
                                upperExclusive: false,
                            },
                        })];
                    case 3: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    LoganDB.prototype.getLogsByReportName = function (reportName) {
        return __awaiter(this, void 0, void 0, function () {
            var logs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.DB.getItemsInRange({
                            tableName: LOG_DETAIL_TABLE_NAME,
                            indexRange: {
                                indexName: LOG_DETAIL_REPORTNAME_INDEX,
                                onlyIndex: reportName,
                            },
                        })];
                    case 1:
                        logs = (_a.sent());
                        return [2 /*return*/, logs];
                }
            });
        });
    };
    LoganDB.prototype.addLog = function (logString) {
        return __awaiter(this, void 0, void 0, function () {
            var logSize, now, today, todayInfo, currentPageSizesArr, currentPageIndex, currentPageSize, needNewPage, nextPageSizesArr, logItem, updatedTodayInfo, durationBeforeExpired;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        logSize = sizeOf(logString);
                        now = new Date();
                        today = dateFormat2Day(now);
                        return [4 /*yield*/, this.getLogDayInfo(today)];
                    case 1:
                        todayInfo = (_d.sent()) || (_a = {},
                            _a[LOG_DAY_TABLE_PRIMARY_KEY] = today,
                            _a.totalSize = 0,
                            _a.reportPagesInfo = {
                                pageSizes: [0],
                            },
                            _a);
                        if (todayInfo.totalSize + logSize > DEFAULT_SINGLE_DAY_MAX_SIZE) {
                            throw new Error(ResultMsg.EXCEED_LOG_SIZE_LIMIT);
                        }
                        if (!todayInfo.reportPagesInfo || !todayInfo.reportPagesInfo.pageSizes) {
                            todayInfo.reportPagesInfo = { pageSizes: [0] };
                        }
                        currentPageSizesArr = todayInfo.reportPagesInfo.pageSizes;
                        currentPageIndex = currentPageSizesArr.length - 1;
                        currentPageSize = currentPageSizesArr[currentPageIndex];
                        needNewPage = currentPageSize > 0 && currentPageSize + logSize > DEFAULT_SINGLE_PAGE_MAX_SIZE;
                        nextPageSizesArr = (function () {
                            var arrCopy = currentPageSizesArr.slice();
                            if (needNewPage) {
                                arrCopy.push(logSize);
                            }
                            else {
                                arrCopy[currentPageIndex] += logSize;
                            }
                            return arrCopy;
                        })();
                        logItem = (_b = {},
                            _b[LOG_DETAIL_REPORTNAME_INDEX] = this.logReportNameFormatter(today, needNewPage ? currentPageIndex + 1 : currentPageIndex),
                            _b[LOG_DETAIL_CREATETIME_INDEX] = +now,
                            _b.logSize = logSize,
                            _b.logString = logString,
                            _b);
                        updatedTodayInfo = (_c = {},
                            _c[LOG_DAY_TABLE_PRIMARY_KEY] = today,
                            _c.totalSize = todayInfo.totalSize + logSize,
                            _c.reportPagesInfo = {
                                pageSizes: nextPageSizesArr,
                            },
                            _c);
                        durationBeforeExpired = DEFAULT_LOG_DURATION - (+new Date() - getStartOfDay(new Date()));
                        return [4 /*yield*/, this.DB.addItems([
                                {
                                    tableName: LOG_DAY_TABLE_NAME,
                                    item: updatedTodayInfo,
                                    itemDuration: durationBeforeExpired,
                                },
                                {
                                    tableName: LOG_DETAIL_TABLE_NAME,
                                    item: logItem,
                                    itemDuration: durationBeforeExpired,
                                },
                            ])];
                    case 2:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Delete reported pages of logDay, in case that new pages are added after last report.
     */
    LoganDB.prototype.incrementalDelete = function (logDay, reportedPageIndexes) {
        return __awaiter(this, void 0, void 0, function () {
            var dayInfo, currentPageSizesArr_1, currentTotalSize, totalReportedSize, pageSizesArrayWithNewPage, resetReportedPageSizes, updatedDayInfo, durationBeforeExpired, _i, reportedPageIndexes_1, pageIndex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getLogDayInfo(logDay)];
                    case 1:
                        dayInfo = _a.sent();
                        if (!(dayInfo && dayInfo.reportPagesInfo && dayInfo.reportPagesInfo.pageSizes instanceof Array)) return [3 /*break*/, 6];
                        currentPageSizesArr_1 = dayInfo.reportPagesInfo.pageSizes;
                        currentTotalSize = dayInfo.totalSize;
                        totalReportedSize = currentPageSizesArr_1.reduce(function (accSize, currentSize, indexOfPage) {
                            if (reportedPageIndexes.indexOf(indexOfPage) >= 0) {
                                return accSize + currentSize;
                            }
                            else {
                                return accSize;
                            }
                        }, 0);
                        pageSizesArrayWithNewPage = (function addNewPageIfLastPageIsReported() {
                            // Add a new page with 0 page size if the last page is reported.
                            if (reportedPageIndexes.indexOf(currentPageSizesArr_1.length - 1) >= 0) {
                                return currentPageSizesArr_1.concat([0]);
                            }
                            else {
                                return currentPageSizesArr_1;
                            }
                        })();
                        resetReportedPageSizes = pageSizesArrayWithNewPage.reduce(function (accSizesArray, currentSize, index) {
                            if (reportedPageIndexes.indexOf(index) >= 0) {
                                return accSizesArray.concat([0]); // Reset to 0 if this page is reported.
                            }
                            else {
                                return accSizesArray.concat([currentSize]);
                            }
                        }, []);
                        updatedDayInfo = __assign(__assign({}, dayInfo), { reportPagesInfo: {
                                pageSizes: resetReportedPageSizes,
                            }, totalSize: Math.max(currentTotalSize - totalReportedSize, 0) });
                        durationBeforeExpired = DEFAULT_LOG_DURATION -
                            (+new Date() - getStartOfDay(new Date())) -
                            (getStartOfDay(new Date()) - dayFormat2Date(logDay).getTime());
                        return [4 /*yield*/, this.DB.addItems([
                                {
                                    tableName: LOG_DAY_TABLE_NAME,
                                    item: updatedDayInfo,
                                    itemDuration: durationBeforeExpired,
                                },
                            ])
                            // Delete logs of reported pages by iterating reportedPageIndexes.
                        ];
                    case 2:
                        _a.sent();
                        _i = 0, reportedPageIndexes_1 = reportedPageIndexes;
                        _a.label = 3;
                    case 3:
                        if (!(_i < reportedPageIndexes_1.length)) return [3 /*break*/, 6];
                        pageIndex = reportedPageIndexes_1[_i];
                        return [4 /*yield*/, this.DB.deleteItemsInRange([
                                {
                                    tableName: LOG_DETAIL_TABLE_NAME,
                                    indexRange: {
                                        indexName: LOG_DETAIL_REPORTNAME_INDEX,
                                        onlyIndex: this.logReportNameFormatter(logDay, pageIndex),
                                    },
                                },
                            ])];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    LoganDB.idbIsSupported = idbIsSupported;
    LoganDB.deleteDB = deleteDB;
    return LoganDB;
}());
export default LoganDB;
//# sourceMappingURL=logan-db.js.map