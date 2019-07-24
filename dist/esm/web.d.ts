import 'branch-sdk';
import { WebPlugin } from '@capacitor/core';
import { AppIndexOptions, BranchWebPlugin, CreditHistoryOptions, InitOptions } from './definitions';
export declare class BranchPluginWeb extends WebPlugin implements BranchWebPlugin {
    constructor();
    init(key: string, options?: InitOptions): Promise<any>;
    autoAppIndex(options: AppIndexOptions): Promise<any>;
    disableTracking(value: boolean): Promise<any>;
    setIdentity(id: string): Promise<any>;
    logout(): Promise<any>;
    redeemRewards(amount: number, bucket?: string): Promise<any>;
    creditHistory(options?: CreditHistoryOptions): Promise<any>;
    logEvent(name: string, eventData?: {
        [key: string]: any;
    }, eCommerceItems?: {
        [key: string]: any;
    }[]): Promise<void>;
}
declare const BranchPlugin: BranchPluginWeb;
export { BranchPlugin };
