import Foundation
import Capacitor
import Branch

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitor.ionicframework.com/docs/plugins/ios
 */
@objc(BranchPlugin)
public class BranchPlugin: CAPPlugin {
    let defaultHistoryListLenght = 50
    
    var testMode = true
    var trackingDisabled = false
    
    public override func load() {
        testMode = getConfigValue("test") as? Bool ?? testMode
        testMode = getConfigValue("tracking_disabled") as? Bool ?? trackingDisabled
        
        Branch.setUseTestBranchKey(testMode)
        Branch.setTrackingDisabled(trackingDisabled)
        
        NotificationCenter.default.addObserver(self, selector: #selector(handleDidFinishLaunching(_ :)), name: Notification.Name("UIApplicationDidFinishLaunchingNotification"), object: nil);
        
        NotificationCenter.default.addObserver(self, selector: #selector(handleDidReceiveRemoteNotification(_ :)), name: Notification.Name("UIApplicationDidReceiveRemoteNotification"), object: nil);
        
        NotificationCenter.default.addObserver(self, selector: #selector(handleOpenUrl(_ :)), name: Notification.Name(CAPNotifications.URLOpen.name()), object: nil);
        
        NotificationCenter.default.addObserver(self, selector: #selector(handleContinueActivity(_ :)), name: Notification.Name(CAPNotifications.ContinueActivity.name()), object: nil);
    }
    
    @objc func handleDidFinishLaunching(_ notification: NSNotification) {
        print("handleDidFinishLaunching")
        if let userInfo = notification.userInfo as? Dictionary<String,Any> {
            if let launchOptions = userInfo["UIApplicationLaunchOptionsLocationKey"] as? [UIApplicationLaunchOptionsKey: Any] {
                print("UIApplicationLaunchOptionsLocationKey")
                
                Branch.getInstance().initSession(launchOptions: launchOptions) { (params, error) in
                    print(params as? [String: AnyObject] ?? {})
                }
            }
        }
    }
    
    @objc func handleOpenUrl(_ notification: Notification) {
        print("handleOpenUrl")
        
        guard let object = notification.object as? [String: Any] else {
            print("There is no object on handleOpenUrl");
            return;
        }
        
        guard let url = object["url"] as? URL else {
            print("There is no url on handleOpenUrl");
            return;
        }
        
        guard let options = object["options"] as? [UIApplication.OpenURLOptionsKey : Any] else {
            print("There is no options on handleOpenUrl");
            return;
        }
        
        print("ApplicationOpenUrl with object \(object)")
        print("ApplicationOpenUrl with url \(url)")
        print("ApplicationOpenUrl with options \(options)")
        
        Branch.getInstance().application(UIApplication.shared, open: url, options: options)
    }
    
    @objc func handleContinueActivity(_ notification: NSNotification) {
        print("handleContinueActivity")
        
        guard let object = notification.object as? [String: Any] else {
            print("There is no object on handleContinueActivity");
            return;
        }
        
        print("Object in handleContinueActivity: \(object)")
/*
        if let userInfo = notification.userInfo as? Dictionary<String,Any> {
            if let launchOptions = userInfo["UIApplicationLaunchOptionsLocationKey"] as? [UIApplicationLaunchOptionsKey: Any] {
                print("UIApplicationLaunchOptionsLocationKey")
                
                Branch.getInstance().initSession(launchOptions: launchOptions) { (params, error) in
                    print(params as? [String: AnyObject] ?? {})
                }
            }
        }
 */
    }
    
    @objc func handleDidReceiveRemoteNotification(_ notification: NSNotification) {
        print("handleDidReceiveRemoteNotification")
        
        guard let object = notification.object as? [String: Any] else {
            print("There is no object on handleContinueActivity");
            return;
        }
        
        print("Object in handleContinueActivity: \(object)")
    }
    
    @objc func autoAppIndex(_ call: CAPPluginCall) {
        call.success()
    }
    
    @objc func disableTracking(_ call: CAPPluginCall) {
        guard let value = call.getBool("value") else {
            call.error("No value specified for disableTracking")
            return;
        }

        Branch.setTrackingDisabled(value)
        call.success()
    }
    
    @objc func setIdentity(_ call: CAPPluginCall) {
        guard let id = call.getString("id") else {
            call.error("No user id specified")
            return;
        }
        
        Branch.getInstance().setIdentity(id)
        call.success()
    }
    
    @objc func logout(_ call: CAPPluginCall) {
        Branch.getInstance().logout()
        call.success()
    }
    
    @objc func redeemRewards(_ call: CAPPluginCall) {
        guard let amount = call.getInt("amount") else {
            call.error("No amount specified for redeemRewards")
            return;
        }
        
        let callback: callbackWithStatus = {(changed, error) in
            if (error != nil) {
                call.error(error!.localizedDescription)
                return;
            }
            
            call.success(["changed": changed])
        }
        
        if let bucket = call.getString("bucket") {
            Branch.getInstance().redeemRewards(amount, forBucket: bucket, callback: callback)
        } else {
            Branch.getInstance().redeemRewards(amount, callback: callback)
        }
        call.success()
    }
    
    @objc func creditHistory(_ call: CAPPluginCall) {
        let callback: callbackWithList = {(creditHistory, error) in
            if (error != nil) {
                call.error(error!.localizedDescription)
                return;
            }
            
            call.success(["list": creditHistory ?? {}])
        }
        
        if let options = call.getObject("options") {
            if let bucket = options["bucket"] as? String {
                if let after = options["begin_after_id"] as? String {
                    Branch.getInstance().getCreditHistory(forBucket: bucket, after: after, number: options["length"] as? Int ?? defaultHistoryListLenght, order: .mostRecentFirst, andCallback: callback)
                } else {
                    Branch.getInstance().getCreditHistory(forBucket: bucket, andCallback: callback)
                }
            } else {
                if let after = options["begin_after_id"] as? String {
                    Branch.getInstance().getCreditHistory(after: after, number: options["length"] as? Int ?? defaultHistoryListLenght, order: .mostRecentFirst, andCallback: callback)
                } else {
                    Branch.getInstance().getCreditHistory(callback: callback)
                }
            }
        } else {
            Branch.getInstance().getCreditHistory(callback: callback)
        }
    }
    
    @objc func logCustomEvent(_ call: CAPPluginCall) {
        guard let name = call.getString("name") else {
            call.error("No event name specified for logEvent")
            return;
        }
        
        let event = BranchEvent.customEvent(withName: name)
        
        if let data = call.getObject("data") {
            for (key, value) in data {
                event.customData[key] = value
            }
        }
/*
        if let contentItems = call.getArray("contentItems", [String:Any].self) {
            for contentItem in contentItems {
                let branchUniversalObject = BranchUniversalObject.init()
                
            }
        }
*/
        event.logEvent()
        call.success()
    }
}
