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

export interface EventData {

}

export interface ContentItem {

}

export type EventName = 'ADD_TO_CART'
    | 'ADD_TO_WISHLIST'
    | 'VIEW_CART'
    | 'INITIATE_PURCHASE'
    | 'ADD_PAYMENT_INFO'
    | 'PURCHASE'
    | 'SPEND_CREDITS'
    | 'SEARCH'
    | 'VIEW_ITEM'
    | 'VIEW_ITEMS'
    | 'RATE'
    | 'SHARE'
    | 'COMPLETE_REGISTRATION'
    | 'COMPLETE_TUTORIAL'
    | 'ACHIEVE_LEVEL'
    | 'UNLOCK_ACHIEVEMENT'
    | 'INVITE'
    | 'LOGIN'
    | 'RESERVE'
    | 'SUBSCRIBE'
    | 'START_TRIAL'
    | 'CLICK_AD'
    | 'VIEW_AD'

export interface BranchPlugin {
  // General
  init(options: { key: string, options?: InitOptions }): Promise<any>;
  disableTracking(options: { value: boolean }): Promise<any>;

  // Track users
  setIdentity(options: { id: string }): Promise<any>;
  logout(): Promise<any>;

  // Referrals
  redeemRewards(options: { amount: number, bucket?: string }): Promise<any>;
  creditHistory(options: { options?: CreditHistoryOptions }): Promise<any>;

  // Events
  trackPageView(options: { data?: { [key: string]: any }, content_items?: { [key: string]: any }[]}): Promise<void>;
  logEvent(options: { name: EventName, data?: { [key: string]: any }, content_items?: { [key: string]: any }[]}): Promise<void>;
}
