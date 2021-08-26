import { idbIsSupported, deleteDB } from 'idb-managed';
declare const LOG_DETAIL_REPORTNAME_INDEX = "logReportName";
declare const LOG_DETAIL_CREATETIME_INDEX = "logCreateTime";
export declare const LOG_DAY_TABLE_PRIMARY_KEY = "logDay";
export declare type FormattedLogReportName = string;
declare type TimeStamp = number;
interface LogReportNameParsedOb {
    logDay: string;
    pageIndex: number;
}
interface LoganLogItem {
    [LOG_DETAIL_REPORTNAME_INDEX]: string;
    [LOG_DETAIL_CREATETIME_INDEX]: TimeStamp;
    logSize: number;
    logString: string;
}
export interface LoganLogDayItem {
    [LOG_DAY_TABLE_PRIMARY_KEY]: string;
    totalSize: number;
    reportPagesInfo: {
        pageSizes: number[];
    };
}
export default class LoganDB {
    static idbIsSupported: typeof idbIsSupported;
    static deleteDB: typeof deleteDB;
    private DB;
    constructor(dbName?: string);
    /**
     * @param logDay
     * @param pageIndex start from 0
     */
    logReportNameFormatter(logDay: string, pageIndex: number): FormattedLogReportName;
    logReportNameParser(reportName: FormattedLogReportName): LogReportNameParsedOb;
    getLogDayInfo(logDay: string): Promise<LoganLogDayItem | null>;
    getLogDaysInfo(fromLogDay: string, toLogDay: string): Promise<LoganLogDayItem[]>;
    getLogsByReportName(reportName: FormattedLogReportName): Promise<LoganLogItem[]>;
    addLog(logString: string): Promise<void>;
    /**
     * Delete reported pages of logDay, in case that new pages are added after last report.
     */
    incrementalDelete(logDay: string, reportedPageIndexes: number[]): Promise<void>;
}
export {};
