const branch = require('branch-sdk');

import { WebPlugin } from '@capacitor/core';
import { AppIndexOptions, BranchPlugin, CreditHistoryOptions, InitOptions } from './definitions';

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
  async init(key: string, options?: InitOptions): Promise<any> {
    branch.init(key, options);
  }

  async autoAppIndex(options: AppIndexOptions): Promise<any>{
    return new Promise((resolve, reject) => {
      branch.autoAppIndex(options, (err: any, data: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  async disableTracking(value: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      branch.disableTracking(value, (err: any, data: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  // Track users
  async setIdentity(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      branch.setIdentity(id, (err: any, data: any) => {
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
  async redeemRewards(amount: number, bucket?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      branch.redeemRewards(amount, bucket, (err: any, data: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  async creditHistory(options?: CreditHistoryOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      branch.creditHistory(options, (err: any, data: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  // Events
  async logCustomEvent(name: string, data?: { [key: string]: any }, contentItems?: { [key: string]: any }[]): Promise<void> {
    return new Promise((resolve, reject) => {
      branch.logEvent(name, data, contentItems, (err: any, data: any) => {
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
