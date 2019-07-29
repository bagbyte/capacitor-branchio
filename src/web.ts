const branch = require('branch-sdk');

import { WebPlugin } from '@capacitor/core';
import { BranchPlugin, CreditHistoryOptions, InitOptions } from './definitions';

export class BranchPluginWeb extends WebPlugin implements BranchPlugin {
  constructor() {
    super({
      name: 'BranchIO',
      platforms: ['web']
    });
  }

  async load() {

  }

  // General
  async init(options: { key: string, options?: InitOptions}): Promise<any> {
    branch.init(options.key, options.options);
  }

  async disableTracking(options: { value: boolean }): Promise<void> {
    return new Promise((resolve, reject) => {
      branch.disableTracking(options.value, (err: any, data: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  // Track users
  async setIdentity(options: { id: string }): Promise<any> {
    return new Promise((resolve, reject) => {
      branch.setIdentity(options.id, (err: any, data: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  async logout(): Promise<any> {
    return new Promise((resolve, reject) => {
      branch.logout((err: any, data: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  // Referrals
  async redeemRewards(options: { amount: number, bucket?: string}): Promise<any> {
    return new Promise((resolve, reject) => {
      branch.redeemRewards(options.amount, options.bucket, (err: any, data: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  async creditHistory(options: { options?: CreditHistoryOptions }): Promise<any> {
    return new Promise((resolve, reject) => {
      branch.creditHistory(options.options, (err: any, data: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  // Events
  // @ts-ignore
  async trackPageView(options: { data?: { [key: string]: any }, content_items?: { [key: string]: any }[] }): Promise<void> {
    return Promise.resolve();
  }

  async logEvent(options: { name: string, data?: { [key: string]: any }, content_items?: { [key: string]: any }[] }): Promise<void> {
    return new Promise((resolve, reject) => {
      branch.logEvent(options.name, options.data, options.content_items, (err: any, data: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}

const BranchIO = new BranchPluginWeb();

export { BranchIO };

import { registerWebPlugin } from '@capacitor/core';
registerWebPlugin(BranchIO);
