import Foundation
import Capacitor
import Branch

typealias BranchGenericCallback = (Any?, Error?) -> ();

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitor.ionicframework.com/docs/plugins/ios
 */
@objc(BranchIO)
public class BranchIO: CAPPlugin {
    let pluginTag = "BranchIO"
    let defaultHistoryListLenght = 100
    
    let configKeyTestMode = "test"
    let configTrackingDisabled = "tracking_disabled"
    let configVerbose = "verbose"
    
    var testMode = true
    var trackingDisabled = false
    var verbose = false
    
    // Plugin setup
    public override func load() {
        testMode = getConfigValue(configKeyTestMode) as? Bool ?? testMode
        trackingDisabled = getConfigValue(configTrackingDisabled) as? Bool ?? trackingDisabled
        verbose = getConfigValue(configVerbose) as? Bool ?? verbose
        
        log("Loading \(pluginTag) plugin")
        log("Config \(configKeyTestMode): \(testMode)")
        log("Config \(configTrackingDisabled): \(trackingDisabled)")
        log("Config \(configVerbose): \(verbose)")
        
        Branch.setUseTestBranchKey(testMode)
        Branch.setTrackingDisabled(trackingDisabled)
        
        NotificationCenter.default.addObserver(self, selector: #selector(handleDidFinishLaunching(_ :)), name: Notification.Name("UIApplicationDidFinishLaunchingNotification"), object: nil);
        
        NotificationCenter.default.addObserver(self, selector: #selector(handleDidReceiveRemoteNotification(_ :)), name: Notification.Name("UIApplicationDidReceiveRemoteNotification"), object: nil);
        
        NotificationCenter.default.addObserver(self, selector: #selector(handleOpenUrl(_ :)), name: Notification.Name(CAPNotifications.URLOpen.name()), object: nil);
        
        NotificationCenter.default.addObserver(self, selector: #selector(handleContinueActivity(_ :)), name: Notification.Name(CAPNotifications.ContinueActivity.name()), object: nil);
    }
    
    // iOS events handling
    @objc func handleDidFinishLaunching(_ notification: NSNotification) {
        log("\(#function) invoked")
        
        if let userInfo = notification.userInfo as? Dictionary<String,Any> {
            if let launchOptions = userInfo["UIApplicationLaunchOptionsLocationKey"] as? [UIApplicationLaunchOptionsKey: Any] {
                Branch.getInstance().initSession(launchOptions: launchOptions) { (params, error) in
                    print(params as? [String: AnyObject] ?? {})
                }
            }
        }
    }
    
    @objc func handleOpenUrl(_ notification: Notification) {
        log("\(#function) invoked")
        
        guard let object = notification.object as? [String: Any] else {
            log("\(#function) - no 'object' found");
            return;
        }
        
        guard let url = object["url"] as? URL else {
            log("\(#function) - no 'url' found");
            return;
        }
        
        guard let options = object["options"] as? [UIApplication.OpenURLOptionsKey : Any] else {
            log("\(#function) - no 'options' found");
            return;
        }
        
        log("\(#function) - invoked with 'object' \(object)")
        log("\(#function) - invoked with 'url' \(url)")
        log("\(#function) - invoked with 'options' \(options)")
        
        Branch.getInstance().application(UIApplication.shared, open: url, options: options)
    }
    
    @objc func handleContinueActivity(_ notification: NSNotification) {
        log("\(#function) invoked")
        
        guard let userActivity = notification.object as? NSUserActivity else {
            log("\(#function) - no 'object' found");
            return;
        }
        
        Branch.getInstance().continue(userActivity)
    }
    
    @objc func handleDidReceiveRemoteNotification(_ notification: NSNotification) {
        log("\(#function) invoked")
        
        guard let userInfo = notification.object as? [AnyHashable : Any] else {
            log("\(#function) - no 'object' found");
            return;
        }
        
        Branch.getInstance().handlePushNotification(userInfo)
    }
    
    // Private methods
    private func log(_ message: String) {
        if (verbose) {
            print("\(pluginTag) - \(message)")
        }
    }
    
    private func branchCallback(_ call: CAPPluginCall, method: String = #function) -> BranchGenericCallback {
        return { (data: Any?, error: Error?) in
            self.handleBranchResult(method: method, call: call, data: data, error: error);
        }
    }
    
    private func handleBranchResult(method: String, call: CAPPluginCall, data: Any?, error: Error?) {
        if let error = error {
            log("\(method) failed - \(error.localizedDescription)")
            
            call.reject(error.localizedDescription)
            return
        }
        
        log("\(method) succeeded")
        
        if let data = data {
            call.success(["result" : data])
        } else {
            call.success()
        }
    }
    
    // Plugin methods
    @objc func disableTracking(_ call: CAPPluginCall) {
        let methodName = #function
        
        log("\(methodName) invoked")
        
        guard let value = call.getBool("value") else {
            log("\(methodName) - no 'value' found")
            
            call.error("No 'value' specified for \(methodName)")
            return;
        }
        
        Branch.setTrackingDisabled(value)
        call.success()
    }
    
    @objc func setIdentity(_ call: CAPPluginCall) {
        let methodName = #function
        
        log("\(methodName) invoked")
        
        guard let id = call.getString("id") else {
            log("\(methodName) - no 'id' found")
            
            call.error("No 'id' specified")
            return;
        }
        
        Branch.getInstance()?.setIdentity(id, withCallback: branchCallback(call))
    }
    
    @objc func logout(_ call: CAPPluginCall) {
        let methodName = #function
        
        log("\(methodName) invoked")
        
        Branch.getInstance()?.logout(callback: branchCallback(call))
    }
    
    @objc func redeemRewards(_ call: CAPPluginCall) {
        let methodName = #function
        
        log("\(methodName) invoked")
        
        guard let amount = call.getInt("amount") else {
            log("\(methodName) - no 'amount' found")
            
            call.error("No 'amount' specified for \(methodName)")
            return;
        }
        
        if let bucket = call.getString("bucket") {
            Branch.getInstance().redeemRewards(amount, forBucket: bucket, callback: branchCallback(call))
        } else {
            Branch.getInstance().redeemRewards(amount, callback: branchCallback(call))
        }
    }
    
    @objc func creditHistory(_ call: CAPPluginCall) {
        let methodName = #function
        
        log("\(methodName) invoked")
        
        if let options = call.getObject("options") {
            if let bucket = options["bucket"] as? String {
                if let after = options["begin_after_id"] as? String {
                    Branch.getInstance().getCreditHistory(forBucket: bucket, after: after, number: options["length"] as? Int ?? defaultHistoryListLenght, order: .mostRecentFirst, andCallback: branchCallback(call))
                } else {
                    Branch.getInstance().getCreditHistory(forBucket: bucket, andCallback: branchCallback(call))
                }
            } else {
                if let after = options["begin_after_id"] as? String {
                    Branch.getInstance().getCreditHistory(after: after, number: options["length"] as? Int ?? defaultHistoryListLenght, order: .mostRecentFirst, andCallback: branchCallback(call))
                } else {
                    Branch.getInstance().getCreditHistory(callback: branchCallback(call))
                }
            }
        } else {
            Branch.getInstance().getCreditHistory(callback: branchCallback(call))
        }
    }
    
    private func updateEventObject(event: BranchEvent, data: Dictionary<String,Any>?, contentItems: Array<Dictionary<String,Any>>?, method: String = #function) {
        event.adType = .none
        
        if let data = data {
            for (key, value) in data {
                switch key {
                case "transaction_id":
                    event.transactionID = (value as! String);
                case "currency":
                    event.currency = BNCCurrency.init(rawValue: (value as! String).uppercased());
                case "revenue":
                    event.revenue = NSDecimalNumber.init(string: "\(value)");
                case "shipping":
                    event.shipping = NSDecimalNumber.init(string: "\(value)");
                case "tax":
                    event.tax = NSDecimalNumber.init(string: "\(value)");
                case "coupon":
                    event.coupon = (value as! String);
                case "affiliation":
                    event.affiliation = (value as! String);
                case "description":
                    event.eventDescription = (value as! String);
                case "search_query":
                    event.searchQuery = (value as! String);
                default:
                    event.customData.setValue("\(value)", forKey: key)
                }
            }
        }
        
        if let contentItems = contentItems {
            for contentItem in contentItems {
                event.contentItems.add(BranchUniversalObject(dictionary: contentItem))
            }
        }
    }
    
    @objc func logEvent(_ call: CAPPluginCall) {
        let methodName = #function
        
        log("\(methodName) invoked")
        
        guard let name = call.getString("name") else {
            log("\(methodName) - no 'name' found")
            
            call.error("No 'name' specified for \(methodName)")
            return;
        }
        
        let event = BranchIOEvent(name: name.uppercased())
        
        updateEventObject(event: event, data: call.getObject("data"), contentItems: call.getArray("content_items", [String:Any].self))
        
        event.logEventWithCallback(callback: branchCallback(call))
    }
    
    @objc func trackPageView(_ call: CAPPluginCall) {
        let methodName = #function
        
        log("\(methodName) invoked")
        
        let event = BranchIOPageViewEvent(name: "PAGE_VIEW")
        
        updateEventObject(event: event, data: call.getObject("data"), contentItems: call.getArray("content_items", [String:Any].self))
        
        event.logEventWithCallback(callback: branchCallback(call))
    }
}
