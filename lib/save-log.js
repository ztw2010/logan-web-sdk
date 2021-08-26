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
/* eslint-disable @typescript-eslint/ban-types */
import { LogEncryptMode, ResultMsg } from './interface';
import Config from './global-config';
import LoganDB from './lib/logan-db';
import LogManager from './log-manager';
import { invokeInQueue } from './logan-operation-queue';
import UTF8 from 'crypto-js/enc-utf8';
import Base64 from 'crypto-js/enc-base64';
import { encryptByRSA } from './lib/encryption';
var LoganDBInstance;
function base64Encode(text) {
    var textUtf8 = UTF8.parse(text);
    var textBase64 = textUtf8.toString(Base64);
    return textBase64;
}
export default function saveLog(logConfig) {
    return __awaiter(this, void 0, void 0, function () {
        var logStringOb_1, publicKey, cipherOb, logStringOb_2, e_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 9]);
                    if (!LogManager.canSave()) {
                        throw new Error(ResultMsg.EXCEED_TRY_TIMES);
                    }
                    if (!LoganDB.idbIsSupported()) {
                        throw new Error(ResultMsg.DB_NOT_SUPPORT);
                    }
                    if (!LoganDBInstance) {
                        LoganDBInstance = new LoganDB(Config.get('dbName'));
                    }
                    if (!(logConfig.encryptVersion === LogEncryptMode.PLAIN)) return [3 /*break*/, 2];
                    logStringOb_1 = {
                        l: base64Encode(logConfig.logContent),
                    };
                    return [4 /*yield*/, invokeInQueue(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, LoganDBInstance.addLog(JSON.stringify(logStringOb_1))];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 2:
                    if (!(logConfig.encryptVersion === LogEncryptMode.RSA)) return [3 /*break*/, 4];
                    publicKey = Config.get('publicKey');
                    cipherOb = encryptByRSA(logConfig.logContent, "" + publicKey);
                    logStringOb_2 = {
                        l: cipherOb.cipherText,
                        iv: cipherOb.iv,
                        k: cipherOb.secretKey,
                        v: LogEncryptMode.RSA,
                    };
                    return [4 /*yield*/, invokeInQueue(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, LoganDBInstance.addLog(JSON.stringify(logStringOb_2))];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4: throw new Error("encryptVersion " + logConfig.encryptVersion + " is not supported.");
                case 5: return [4 /*yield*/, Config.get('succHandler')(logConfig)];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 7:
                    e_1 = _a.sent();
                    LogManager.errorTrigger();
                    return [4 /*yield*/, Config.get('errorHandler')(e_1)];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=save-log.js.map