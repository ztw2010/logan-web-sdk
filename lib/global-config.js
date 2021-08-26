var DEFAULT_TRY_TIMES = 3;
var Noop = function () {
    /* Noop */
};
var globalConfig = {
    logTryTimes: DEFAULT_TRY_TIMES,
    errorHandler: Noop,
    succHandler: Noop,
};
function validOrBackup(param, type, backup) {
    return typeof param === type ? param : backup;
}
export default {
    set: function (configOb) {
        globalConfig = {
            publicKey: validOrBackup(configOb.publicKey, 'string', undefined),
            logTryTimes: validOrBackup(configOb.logTryTimes, 'number', DEFAULT_TRY_TIMES),
            reportUrl: validOrBackup(configOb.reportUrl, 'string', undefined),
            dbName: validOrBackup(configOb.dbName, 'string', undefined),
            errorHandler: validOrBackup(configOb.errorHandler, 'function', Noop),
            succHandler: validOrBackup(configOb.succHandler, 'function', Noop),
        };
    },
    get: function (propertyKey) {
        return globalConfig[propertyKey];
    },
};
//# sourceMappingURL=global-config.js.map