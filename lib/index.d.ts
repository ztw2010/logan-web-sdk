import { ReportConfig, GlobalConfig, LogConfig } from './interface';
import { ResultMsg, ReportResult } from './interface';
/**
 * Set global settings for this single Logan instance. Usually you only need to call this once after Logan is imported. Each time this method is called, all previous global configs will be overwritten by current settings.
 *
 * @param globalConfig Global settings
 */
export declare function initConfig(globalConfig: GlobalConfig): void;
/**
 * Save one log locally.
 * @param content Log content.
 * @param logType Log type.
 */
export declare function log(content: string, logType: number): void;
/**
 * Save one confidential log locally. Before saving, the log content will be encrypted and it is very hard to crack after then.
 * @param content Log content.
 * @param logType Log type.
 */
export declare function logWithEncryption(content: string, logType: number): void;
/**
 * Save custom formatted log content locally.
 * @param {LogConfig} logConfig
 */
export declare function customLog(logConfig: LogConfig): void;
/**
 * Report local logs to the server side.
 *
 * @param reportConfig Config for this report.
 * @returns {Promise<ReportResult>} Reject with an Error if anything goes wrong during the report process. Resolve ReportResult if the process is successful.
 */
export declare function report(reportConfig: ReportConfig): Promise<ReportResult>;
declare const _default: {
    initConfig: typeof initConfig;
    log: typeof log;
    logWithEncryption: typeof logWithEncryption;
    report: typeof report;
    customLog: typeof customLog;
    ResultMsg: typeof ResultMsg;
};
export default _default;
