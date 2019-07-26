import { WebPlugin } from '@capacitor/core';
import { AppIndexOptions, BranchPlugin, CreditHistoryOptions, InitOptions } from './definitions';
export declare class BranchPluginWeb extends WebPlugin implements BranchPlugin {
    constructor();
    load(): Promise<void>;
    init(options: {
        key: string;
        options?: InitOptions;
    }): Promise<any>;
    autoAppIndex(options: {
        options: AppIndexOptions;
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
    logCustomEvent(options: {
        name: string;
        data?: {
            [key: string]: any;
        };
        contentItems?: {
            [key: string]: any;
        }[];
    }): Promise<void>;
}
declare const BranchIO: BranchPluginWeb;
export { BranchIO };
