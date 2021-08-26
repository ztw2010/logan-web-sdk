/**
 * ResultMsg is used for logan-web to show failure reasons or report results.
 */
export var ResultMsg;
(function (ResultMsg) {
    ResultMsg["DB_NOT_SUPPORT"] = "IndexedDB is not supported";
    ResultMsg["NO_LOG"] = "No log exists";
    ResultMsg["REPORT_LOG_SUCC"] = "Report succ";
    ResultMsg["REPORT_LOG_FAIL"] = "Report fail";
    ResultMsg["EXCEED_TRY_TIMES"] = "Exceed try times";
    ResultMsg["EXCEED_LOG_SIZE_LIMIT"] = "Exceed log size day limit";
})(ResultMsg || (ResultMsg = {}));
/**
 * logan-web now supports two kinds of log mode. PLAIN mode is used for log() method. And RSA mode is used for logWithEncryption() method.
 *
 * PLAIN mode means that log saved in DB will only be encoded by base64, almost plaintext and can be easily obtained by local user.
 *
 * RSA mode means that logs will be hybrid encrypted before saved and it is very difficult to be cracked after then.
 *
 */
export var LogEncryptMode;
(function (LogEncryptMode) {
    LogEncryptMode[LogEncryptMode["PLAIN"] = 0] = "PLAIN";
    LogEncryptMode[LogEncryptMode["RSA"] = 1] = "RSA";
})(LogEncryptMode || (LogEncryptMode = {}));
//# sourceMappingURL=interface.js.map