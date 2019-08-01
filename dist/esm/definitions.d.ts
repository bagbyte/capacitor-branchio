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
interface EventDataBase {
    transaction_id?: string;
    currency?: Currency;
    revenue?: number;
    shipping?: number;
    tax?: number;
    coupon?: string;
    affiliation?: string;
    description?: string;
    search_query?: string;
}
export declare type Currency = 'AED' | 'AFN' | 'ALL' | 'AMD' | 'ANG' | 'AOA' | 'ARS' | 'AUD' | 'AWG' | 'AZN' | 'BAM' | 'BBD' | 'BDT' | 'BGN' | 'BHD' | 'BIF' | 'BMD' | 'BND' | 'BOB' | 'BOV' | 'BRL' | 'BSD' | 'BTN' | 'BWP' | 'BYN' | 'BYR' | 'BZD' | 'CAD' | 'CDF' | 'CHE' | 'CHF' | 'CHW' | 'CLF' | 'CLP' | 'CNY' | 'COP' | 'COU' | 'CRC' | 'CUC' | 'CUP' | 'CVE' | 'CZK' | 'DJF' | 'DKK' | 'DOP' | 'DZD' | 'EGP' | 'ERN' | 'ETB' | 'EUR' | 'FJD' | 'FKP' | 'GBP' | 'GEL' | 'GHS' | 'GIP' | 'GMD' | 'GNF' | 'GTQ' | 'GYD' | 'HKD' | 'HNL' | 'HRK' | 'HTG' | 'HUF' | 'IDR' | 'ILS' | 'INR' | 'IQD' | 'IRR' | 'ISK' | 'JMD' | 'JOD' | 'JPY' | 'KES' | 'KGS' | 'KHR' | 'KMF' | 'KPW' | 'KRW' | 'KWD' | 'KYD' | 'KZT' | 'LAK' | 'LBP' | 'LKR' | 'LRD' | 'LSL' | 'LYD' | 'MAD' | 'MDL' | 'MGA' | 'MKD' | 'MMK' | 'MNT' | 'MOP' | 'MRO' | 'MUR' | 'MVR' | 'MWK' | 'MXN' | 'MXV' | 'MYR' | 'MZN' | 'NAD' | 'NGN' | 'NIO' | 'NOK' | 'NPR' | 'NZD' | 'OMR' | 'PAB' | 'PEN' | 'PGK' | 'PHP' | 'PKR' | 'PLN' | 'PYG' | 'QAR' | 'RON' | 'RSD' | 'RUB' | 'RWF' | 'SAR' | 'SBD' | 'SCR' | 'SDG' | 'SEK' | 'SGD' | 'SHP' | 'SLL' | 'SOS' | 'SRD' | 'SSP' | 'STD' | 'SYP' | 'SZL' | 'THB' | 'TJS' | 'TMT' | 'TND' | 'TOP' | 'TRY' | 'TTD' | 'TWD' | 'TZS' | 'UAH' | 'UGX' | 'USD' | 'USN' | 'UYI' | 'UYU' | 'UZS' | 'VEF' | 'VND' | 'VUV' | 'WST' | 'XAF' | 'XAG' | 'XAU' | 'XBA' | 'XBB' | 'XBC' | 'XBD' | 'XCD' | 'XDR' | 'XFU' | 'XOF' | 'XPD' | 'XPF' | 'XPT' | 'XSU' | 'XTS' | 'XUA' | 'XXX' | 'YER' | 'ZAR' | 'ZMW';
export declare type Condition = 'OTHER' | 'NEW' | 'GOOD' | 'FAIR' | 'POOR' | 'USED' | 'REFURBISHED' | 'EXCELLENT';
interface ContentItemBase {
    $og_title?: string;
    $canonical_identifier?: string;
    $canonical_url?: string;
    $og_description?: string;
    $og_image_url?: string;
    $exp_date?: number;
    $keywords?: string[];
    $publicly_indexable?: boolean;
    $locally_indexable?: boolean;
    $creation_timestamp?: number;
}
interface Metadata {
    $content_schema?: string;
    $quantity?: number;
    $price?: number;
    $currency?: Currency;
    $sku?: string;
    $product_name?: string;
    $product_brand?: string;
    $product_category?: string;
    $condition?: Condition;
    $product_variant?: string;
    $rating?: number;
    $rating_average?: number;
    $rating_count?: number;
    $rating_max?: number;
    $address_street?: string;
    $address_city?: string;
    $address_region?: string;
    $address_country?: string;
    $address_postal_code?: string;
    $latitude?: number;
    $longitude?: number;
    $image_captions?: string[];
}
export declare type ContentItem = ContentItemBase & Metadata & {
    [key: string]: string;
};
export declare type EventData = EventDataBase & {
    [key: string]: string;
};
export declare type EventName = 'ADD_TO_CART' | 'ADD_TO_WISHLIST' | 'VIEW_CART' | 'INITIATE_PURCHASE' | 'ADD_PAYMENT_INFO' | 'PURCHASE' | 'SPEND_CREDITS' | 'SEARCH' | 'VIEW_ITEM' | 'VIEW_ITEMS' | 'RATE' | 'SHARE' | 'COMPLETE_REGISTRATION' | 'COMPLETE_TUTORIAL' | 'ACHIEVE_LEVEL' | 'UNLOCK_ACHIEVEMENT' | 'INVITE' | 'LOGIN' | 'RESERVE' | 'SUBSCRIBE' | 'START_TRIAL' | 'CLICK_AD' | 'VIEW_AD';
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
        data?: EventData;
        content_items?: ContentItem[];
    }): Promise<void>;
    logEvent(options: {
        name: EventName;
        data?: EventData;
        content_items?: ContentItem[];
    }): Promise<void>;
}
export {};
