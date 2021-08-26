interface XHROpts {
    url: string;
    type: 'GET' | 'POST' | string;
    withCredentials: boolean;
    success?: Function;
    fail?: Function;
    headers?: any;
    data?: any;
}
export default function (opts: XHROpts): XMLHttpRequest;
export {};
