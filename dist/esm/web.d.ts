import { WebPlugin } from '@capacitor/core';
import { BranchPlugin, CreditHistoryOptions, InitOptions } from './definitions';
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
        data?: {
            [key: string]: any;
        };
        content_items?: {
            [key: string]: any;
        }[];
    }): Promise<void>;
    logEvent(options: {
        name: string;
        data?: {
            [key: string]: any;
        };
        content_items?: {
            [key: string]: any;
        }[];
    }): Promise<void>;
}
declare const BranchIO: BranchPluginWeb;
export { BranchIO };
