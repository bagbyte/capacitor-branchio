var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const branch = require('branch-sdk');
import { WebPlugin } from '@capacitor/core';
export class BranchPluginWeb extends WebPlugin {
    constructor() {
        super({
            name: 'BranchPlugin',
            platforms: ['web']
        });
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    // General
    init(key, options) {
        return __awaiter(this, void 0, void 0, function* () {
            branch.init(key, options);
        });
    }
    autoAppIndex(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                branch.autoAppIndex(options, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(data);
                    }
                });
            });
        });
    }
    disableTracking(value) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                branch.disableTracking(value, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(data);
                    }
                });
            });
        });
    }
    // Track users
    setIdentity(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                branch.setIdentity(id, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(data);
                    }
                });
            });
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                branch.logout((err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(data);
                    }
                });
            });
        });
    }
    // Referrals
    redeemRewards(amount, bucket) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                branch.redeemRewards(amount, bucket, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(data);
                    }
                });
            });
        });
    }
    creditHistory(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                branch.creditHistory(options, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(data);
                    }
                });
            });
        });
    }
    // Events
    logCustomEvent(name, data, contentItems) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                branch.logEvent(name, data, contentItems, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(data);
                    }
                });
            });
        });
    }
}
const BranchPlugin = new BranchPluginWeb();
export { BranchPlugin };
import { registerWebPlugin } from '@capacitor/core';
registerWebPlugin(BranchPlugin);
//# sourceMappingURL=web.js.map