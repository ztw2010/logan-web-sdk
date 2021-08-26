import Config from './global-config';
var logTryQuota = Config.get('logTryTimes');
function errorTrigger() {
    if (logTryQuota > 0) {
        logTryQuota--;
    }
}
function canSave() {
    return logTryQuota > 0;
}
function resetQuota() {
    logTryQuota = Config.get('logTryTimes');
}
export default {
    errorTrigger: errorTrigger,
    canSave: canSave,
    resetQuota: resetQuota,
};
//# sourceMappingURL=log-manager.js.map