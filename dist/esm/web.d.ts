import { WebPlugin } from '@capacitor/core';
import { BranchPlugin, ContentItem, CreditHistoryOptions, EventData, EventName, InitOptions, Result } from './definitions';
export declare class BranchPluginWeb extends WebPlugin implements BranchPlugin {
    private CONFIG_KEY_TEST_MODE;
    private CONFIG_KEY_TRACKING_DISABLED;
    private CONFIG_KEY_VERBOSE;
    private CONFIG_KEY_KEYS;
    private key;
    private testMode;
    private trackingDisabled;
    private verbose;
    constructor();
    load(): Promise<void>;
    private getConfig;
    private getBranchKey;
    private invokeAPI;
    private log;
    initBranch(options: {
        key: string;
        options?: InitOptions;
    }): Promise<Result<any>>;
    disableTracking(options: {
        value: boolean;
    }): void;
    setIdentity(options: {
        id: string;
    }): Promise<Result<any>>;
    logout(): Promise<Result<boolean>>;
    redeemRewards(options: {
        amount: number;
        bucket?: string;
    }): Promise<Result<boolean>>;
    creditHistory(options: {
        options?: CreditHistoryOptions;
    }): Promise<Result<any[]>>;
    logEvent(options: {
        name: EventName;
        data?: EventData;
        content_items?: ContentItem[];
    }): Promise<Result<any>>;
    trackPageView(options: {
        data?: EventData;
        content_items?: ContentItem[];
    }): Promise<Result<any>>;
}
declare const BranchIO: BranchPluginWeb;
export { BranchIO };
