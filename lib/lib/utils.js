export var K_BYTE = 1024;
export var M_BYTE = 1024 * K_BYTE;
export function sizeOf(str) {
    var total = 0;
    for (var i = 0, len = str.length; i < len; i++) {
        var charCode = str.charCodeAt(i);
        if (charCode <= 0x007f) {
            total += 1;
        }
        else if (charCode <= 0x07ff) {
            total += 2;
        }
        else if (charCode <= 0xffff) {
            total += 3;
        }
        else {
            total += 4;
        }
    }
    return total;
}
export function isValidDay(day) {
    if (typeof day !== 'string') {
        return false;
    }
    else {
        var dayParts = day.split('-');
        var M = parseInt(dayParts[1]);
        var D = parseInt(dayParts[2]);
        return M > 0 && M <= 12 && D > 0 && D <= 31 && new Date(day).toString() !== 'Invalid Date';
    }
}
export function dateFormat2Day(date) {
    var Y = date.getFullYear();
    var M = date.getMonth() + 1;
    var D = date.getDate();
    return Y + "-" + (M < 10 ? '0' + M : M) + "-" + (D < 10 ? '0' + D : D);
}
export function getStartOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}
export function dayFormat2Date(day) {
    var _a = (day.match(/(\d+)/g) || []).map(function (n) { return parseInt(n); }), year = _a[0], month = _a[1], date = _a[2];
    if (year < 1000) {
        throw new Error("Invalid dayString: " + day);
    }
    return new Date(year, month - 1, date);
}
export var ONE_DAY_TIME_SPAN = 24 * 60 * 60 * 1000;
//# sourceMappingURL=utils.js.map