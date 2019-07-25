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

export interface AppIndexOptions {
  iosAppId?: string;
  iosURL?: string,
  androidPackageName?: string;
  androidURL?: string;
  data?: { [key: string]: any };
}

export interface CreditHistoryOptions {
  length?: number;
  begin_after_id?: string;
  bucket?: string;
}

export interface BranchPlugin {
  // General
  init(key: string, options?: InitOptions): Promise<any>;
  autoAppIndex(options: AppIndexOptions): Promise<any>;
  disableTracking(value: boolean): Promise<any>;

  // Track users
  setIdentity(id: string): Promise<any>;
  logout(): Promise<any>;

  // Referrals
  redeemRewards(amount: number, bucket?: string): Promise<any>;
  creditHistory(options?: CreditHistoryOptions): Promise<any>;

  // Events
  logCustomEvent(name: string, data?: { [key: string]: any }, contentItems?: { [key: string]: any }[]): Promise<void>;
}
