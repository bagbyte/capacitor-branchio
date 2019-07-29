declare module "@capacitor/core" {
    interface PluginRegistry {
        BranchIO: BranchPlugin;
    }
}
export interface InitOptions {
    branch_match_id?: string;
    branch_view_id?: string;
    no_journeys?: boolean;
    disable_entry_animation?: boolean;
    disable_exit_animation?: boolean;
    open_app?: boolean;
    nonce?: string;
    tracking_disabled?: boolean;
}
export interface CreditHistoryOptions {
    length?: number;
    begin_after_id?: string;
    bucket?: string;
}
export interface BranchPlugin {
    init(options: {
        key: string;
        options?: InitOptions;
    }): Promise<any>;
    disableTracking(options: {
        value: boolean;
    }): Promise<any>;
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
