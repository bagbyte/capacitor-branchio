const branch = require('branch-sdk');

// @ts-ignore
import config from '../../../../../capacitor.config.json';

import { WebPlugin } from '@capacitor/core';
import {
  BranchPlugin,
  ContentItem,
  CreditHistoryOptions,
  EventData,
  EventName,
  InitOptions,
  Result,
} from './definitions';

interface KeysObject {
  test?: string;
  live?: string;
}

export class BranchPluginWeb extends WebPlugin implements BranchPlugin {
  private CONFIG_KEY_TEST_MODE = "test";
  private CONFIG_KEY_TRACKING_DISABLED = "tracking_disabled";
  private CONFIG_KEY_VERBOSE = "verbose";
  private CONFIG_KEY_KEYS = "keys";

  private key: string;

  private testMode = true;
  private trackingDisabled = false;
  private verbose = false;

  constructor() {
    super({
      name: 'BranchIO',
      platforms: ['web']
    });
  }

  async load() {
    this.testMode = this.getConfig(this.CONFIG_KEY_TEST_MODE, this.testMode);
    this.trackingDisabled = this.getConfig(this.CONFIG_KEY_TRACKING_DISABLED, this.trackingDisabled);
    this.verbose = this.getConfig(this.CONFIG_KEY_VERBOSE, this.verbose);
    this.key = this.getBranchKey();

    await this.initBranch({ key: this.key, options: { tracking_disabled: this.trackingDisabled }});
  }

  private getConfig<T>(key: string, defaultValue: T): T {
    if (this.config.name in config.plugins && config.plugins[this.config.name] != null) {
      if (key in config.plugins[this.config.name]) {
        return config.plugins[this.config.name][key] as T;
      }
    }

    return defaultValue;
  }

  private getBranchKey(): string {
    const keys: KeysObject = this.getConfig(this.CONFIG_KEY_KEYS, {});

    const environment = this.testMode ? 'test' : 'live';

    if (!(environment in keys) || !keys[environment]) {
      throw Error(`${this.config.name} plugin cannot be loaded, Branch ${environment} key is missing`);
    }

    return keys[environment];
  }

  private async invokeAPI<T>(pluginMethod: string, apiMethod: string, ...params: any): Promise<Result<T>> {
    this.log(`${pluginMethod} invoked`);

    return new Promise((resolve, reject) => {
      branch[apiMethod](params, (err: Error, data: T) => {
        if (err) {
          this.log(`${pluginMethod} failed - ${err.message}`);

          reject(err);
        } else {
          this.log(`${pluginMethod} succeeded - ${data}`);

          resolve({ result: data });
        }
      });
    });
  }

  private log(message: string) {
    if (this.verbose) {
      console.log(`${this.config.name} - ${message}`);
    }
  }

  // General
  async initBranch(options: { key: string, options?: InitOptions}): Promise<Result<any>> {
    return this.invokeAPI('initBranch', 'init', options.key, options.options);
  }

  disableTracking(options: { value: boolean }): void {
    this.log('disableTracking invoked');

    branch.disableTracking(options.value);
  }

  // Track users
  async setIdentity(options: { id: string }): Promise<Result<any>> {
    return this.invokeAPI('setIdentity', 'setIdentity', options.id);
  }

  async logout(): Promise<Result<boolean>> {
    return this.invokeAPI('logout', 'logout');
  }

  // Referrals
  async redeemRewards(options: { amount: number, bucket?: string}): Promise<Result<boolean>> {
    return this.invokeAPI('redeemRewards', 'redeemRewards', options.amount, options.bucket);
  }

  async creditHistory(options: { options?: CreditHistoryOptions }): Promise<Result<any[]>> {
    return this.invokeAPI('creditHistory', 'creditHistory', options.options);
  }

  // Events
  async logEvent(options: { name: EventName, data?: EventData, content_items?: ContentItem[] }): Promise<Result<any>> {
    return this.invokeAPI('logEvent', 'logEvent', options.name, options.data, options.content_items);
  }

  async trackPageView(options: { data?: EventData, content_items?: ContentItem[] }): Promise<Result<any>> {
    return this.invokeAPI('trackPageView', 'logEvent', 'VIEW_ITEM', options.data, options.content_items);
  }
}

const BranchIO = new BranchPluginWeb();

export { BranchIO };

import { registerWebPlugin } from '@capacitor/core';
registerWebPlugin(BranchIO);
