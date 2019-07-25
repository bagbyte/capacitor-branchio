import { WebPlugin } from '@capacitor/core';
import { AppIndexOptions, BranchPluginPlugin, CreditHistoryOptions, InitOptions } from './definitions';
export declare class BranchPluginWeb extends WebPlugin implements BranchPluginPlugin {
    constructor();
    load(): Promise<void>;
    init(key: string, options?: InitOptions): Promise<any>;
    autoAppIndex(options: AppIndexOptions): Promise<any>;
    disableTracking(value: boolean): Promise<any>;
    setIdentity(id: string): Promise<any>;
    logout(): Promise<any>;
    redeemRewards(amount: number, bucket?: string): Promise<any>;
    creditHistory(options?: CreditHistoryOptions): Promise<any>;
    logCustomEvent(name: string, data?: {
        [key: string]: any;
    }, contentItems?: {
        [key: string]: any;
    }[]): Promise<void>;
}
declare const BranchPlugin: BranchPluginWeb;
export { BranchPlugin };
