import { WebPlugin } from '@capacitor/core';
import { BranchPlugin, ContentItem, CreditHistoryOptions, EventData, EventName, InitOptions } from './definitions';
export declare class BranchPluginWeb extends WebPlugin implements BranchPlugin {
    constructor();
    load(): Promise<void>;
    init(options: {
        key: string;
        options?: InitOptions;
    }): Promise<any>;
    disableTracking(options: {
        value: boolean;
    }): Promise<void>;
    setIdentity(options: {
        id: string;
    }): Promise<any>;
    logout(): Promise<any>;
    redeemRewards(options: {
        amount: number;
        bucket?: string;
    }): Promise<any>;
    creditHistory(options: {
        options?: CreditHistoryOptions;
    }): Promise<any>;
    trackPageView(options: {
        data?: EventData;
        content_items?: ContentItem[];
    }): Promise<void>;
    logEvent(options: {
        name: EventName;
        data?: EventData;
        content_items?: ContentItem[];
    }): Promise<void>;
}
declare const BranchIO: BranchPluginWeb;
export { BranchIO };
