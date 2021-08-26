/* eslint-disable @typescript-eslint/ban-types */
var NOOP = function () {
    /* Noop */
};
export default function (opts) {
    var useXDomainRequest = 'XDomainRequest' in window;
    var req = useXDomainRequest ? new window.XDomainRequest() : new XMLHttpRequest();
    req.open(opts.type || 'GET', opts.url, true);
    req.success = opts.success || NOOP;
    req.fail = opts.fail || NOOP;
    req.withCredentials = opts.withCredentials;
    if (useXDomainRequest) {
        req.onload = opts.success || NOOP;
        req.onerror = opts.fail || NOOP;
        req.onprogress = NOOP;
    }
    else {
        req.onreadystatechange = function () {
            if (req.readyState === 4) {
                var status_1 = req.status;
                if (status_1 >= 200) {
                    opts.success && opts.success(req.responseText);
                }
                else {
                    opts.fail && opts.fail("Request failed, status: " + status_1 + ", responseText: " + req.responseText);
                }
            }
        };
    }
    if (opts.type === 'POST') {
        if (opts.headers && !useXDomainRequest) {
            for (var key in opts.headers) {
                req.setRequestHeader(key, opts.headers[key]);
            }
        }
        req.send(opts.data);
    }
    else {
        req.send();
    }
    return req;
}
//# sourceMappingURL=xhr.js.map