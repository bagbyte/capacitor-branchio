var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var branch = require('branch-sdk');
// @ts-ignore
import config from '../../../../../capacitor.config.json';
import { WebPlugin } from '@capacitor/core';
var BranchPluginWeb = /** @class */ (function (_super) {
    __extends(BranchPluginWeb, _super);
    function BranchPluginWeb() {
        var _this = _super.call(this, {
            name: 'BranchIO',
            platforms: ['web']
        }) || this;
        _this.CONFIG_KEY_TEST_MODE = "test";
        _this.CONFIG_KEY_TRACKING_DISABLED = "tracking_disabled";
        _this.CONFIG_KEY_VERBOSE = "verbose";
        _this.CONFIG_KEY_KEYS = "keys";
        _this.testMode = true;
        _this.trackingDisabled = false;
        _this.verbose = false;
        return _this;
    }
    BranchPluginWeb.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.testMode = this.getConfig(this.CONFIG_KEY_TEST_MODE, this.testMode);
                        this.trackingDisabled = this.getConfig(this.CONFIG_KEY_TRACKING_DISABLED, this.trackingDisabled);
                        this.verbose = this.getConfig(this.CONFIG_KEY_VERBOSE, this.verbose);
                        this.key = this.getBranchKey();
                        return [4 /*yield*/, this.initBranch({ key: this.key, options: { tracking_disabled: this.trackingDisabled } })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BranchPluginWeb.prototype.getConfig = function (key, defaultValue) {
        if (this.config.name in config.plugins && config.plugins[this.config.name] != null) {
            if (key in config.plugins[this.config.name]) {
                return config.plugins[this.config.name][key];
            }
        }
        return defaultValue;
    };
    BranchPluginWeb.prototype.getBranchKey = function () {
        var keys = this.getConfig(this.CONFIG_KEY_KEYS, {});
        var environment = this.testMode ? 'test' : 'live';
        if (!(environment in keys) || !keys[environment]) {
            throw Error(this.config.name + " plugin cannot be loaded, Branch " + environment + " key is missing");
        }
        return keys[environment];
    };
    BranchPluginWeb.prototype.invokeAPI = function (pluginMethod, apiMethod) {
        var params = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            params[_i - 2] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.log(pluginMethod + " invoked");
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        branch[apiMethod](params, function (err, data) {
                            if (err) {
                                _this.log(pluginMethod + " failed - " + err.message);
                                reject(err);
                            }
                            else {
                                _this.log(pluginMethod + " succeeded - " + data);
                                resolve({ result: data });
                            }
                        });
                    })];
            });
        });
    };
    BranchPluginWeb.prototype.log = function (message) {
        if (this.verbose) {
            console.log(this.config.name + " - " + message);
        }
    };
    // General
    BranchPluginWeb.prototype.initBranch = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.invokeAPI('initBranch', 'init', options.key, options.options)];
            });
        });
    };
    BranchPluginWeb.prototype.disableTracking = function (options) {
        this.log('disableTracking invoked');
        branch.disableTracking(options.value);
    };
    // Track users
    BranchPluginWeb.prototype.setIdentity = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.invokeAPI('setIdentity', 'setIdentity', options.id)];
            });
        });
    };
    BranchPluginWeb.prototype.logout = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.invokeAPI('logout', 'logout')];
            });
        });
    };
    // Referrals
    BranchPluginWeb.prototype.redeemRewards = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.invokeAPI('redeemRewards', 'redeemRewards', options.amount, options.bucket)];
            });
        });
    };
    BranchPluginWeb.prototype.creditHistory = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.invokeAPI('creditHistory', 'creditHistory', options.options)];
            });
        });
    };
    // Events
    BranchPluginWeb.prototype.logEvent = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.invokeAPI('logEvent', 'logEvent', options.name, options.data, options.content_items)];
            });
        });
    };
    BranchPluginWeb.prototype.trackPageView = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.invokeAPI('trackPageView', 'logEvent', 'VIEW_ITEM', options.data, options.content_items)];
            });
        });
    };
    return BranchPluginWeb;
}(WebPlugin));
export { BranchPluginWeb };
var BranchIO = new BranchPluginWeb();
export { BranchIO };
import { registerWebPlugin } from '@capacitor/core';
registerWebPlugin(BranchIO);
//# sourceMappingURL=web.js.map