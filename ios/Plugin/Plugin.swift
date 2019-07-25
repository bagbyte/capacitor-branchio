import Foundation
import Capacitor
import Branch

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitor.ionicframework.com/docs/plugins/ios
 */
@objc(BranchIO)
public class BranchIO: CAPPlugin {
    let defaultHistoryListLenght = 100

    var testMode = true
    var trackingDisabled = false
    var verbose = false

    public override func load() {
        testMode = getConfigValue("test") as? Bool ?? testMode
        trackingDisabled = getConfigValue("tracking_disabled") as? Bool ?? trackingDisabled
        verbose = getConfigValue("verbose") as? Bool ?? verbose

        self.log("Loading plugin")
        self.log("Test mode: \(testMode)")
        self.log("Tracking disabled: \(trackingDisabled)")
        self.log("Verbose: \(verbose)")

        Branch.setUseTestBranchKey(testMode)
        Branch.setTrackingDisabled(trackingDisabled)
        
        NotificationCenter.default.addObserver(self, selector: #selector(handleDidFinishLaunching(_ :)), name: Notification.Name("UIApplicationDidFinishLaunchingNotification"), object: nil);

        NotificationCenter.default.addObserver(self, selector: #selector(handleDidReceiveRemoteNotification(_ :)), name: Notification.Name("UIApplicationDidReceiveRemoteNotification"), object: nil);

        NotificationCenter.default.addObserver(self, selector: #selector(handleOpenUrl(_ :)), name: Notification.Name(CAPNotifications.URLOpen.name()), object: nil);

        NotificationCenter.default.addObserver(self, selector: #selector(handleContinueActivity(_ :)), name: Notification.Name(CAPNotifications.ContinueActivity.name()), object: nil);
    }

    private func log(_ message: String) {
        if (verbose) {
            print("BranchIO - \(message)")
        }
    }

    @objc func handleDidFinishLaunching(_ notification: NSNotification) {
        self.log("handleDidFinishLaunching invoked")

        if let userInfo = notification.userInfo as? Dictionary<String,Any> {
            if let launchOptions = userInfo["UIApplicationLaunchOptionsLocationKey"] as? [UIApplicationLaunchOptionsKey: Any] {
                Branch.getInstance().initSession(launchOptions: launchOptions) { (params, error) in
                    print(params as? [String: AnyObject] ?? {})
                }
            }
        }
    }

    @objc func handleOpenUrl(_ notification: Notification) {
        self.log("handleOpenUrl invoked")

        guard let object = notification.object as? [String: Any] else {
            self.log("handleOpenUrl - no object found");
            return;
        }

        guard let url = object["url"] as? URL else {
            self.log("handleOpenUrl - no url found");
            return;
        }

        guard let options = object["options"] as? [UIApplication.OpenURLOptionsKey : Any] else {
            self.log("handleOpenUrl - no options found");
            return;
        }

        self.log("handleOpenUrl - invoked with object \(object)")
        self.log("handleOpenUrl - invoked with url \(url)")
        self.log("handleOpenUrl - invoked with options \(options)")

        Branch.getInstance().application(UIApplication.shared, open: url, options: options)
    }

    @objc func handleContinueActivity(_ notification: NSNotification) {
        self.log("handleContinueActivity invoked")

        guard let userActivity = notification.object as? NSUserActivity else {
            self.log("handleContinueActivity - no object found");
            return;
        }

        Branch.getInstance().continue(userActivity)
    }

    @objc func handleDidReceiveRemoteNotification(_ notification: NSNotification) {
        self.log("handleDidReceiveRemoteNotification invoked")

        guard let userInfo = notification.object as? [AnyHashable : Any] else {
            self.log("handleDidReceiveRemoteNotification - no object found");
            return;
        }

        Branch.getInstance().handlePushNotification(userInfo)
    }

    @objc func autoAppIndex(_ call: CAPPluginCall) {
        self.log("autoAppIndex invoked")

        call.success()
    }

    @objc func disableTracking(_ call: CAPPluginCall) {
        self.log("disableTracking invoked")

        guard let value = call.getBool("value") else {
            self.log("disableTracking - no value found")

            call.error("No value specified for disableTracking")
            return;
        }

        Branch.setTrackingDisabled(value)
        call.success()
    }

    @objc func setIdentity(_ call: CAPPluginCall) {
        self.log("setIdentity invoked")

        guard let id = call.getString("id") else {
            self.log("setIdentity - no id found")

            call.error("No user id specified")
            return;
        }

        Branch.getInstance().setIdentity(id)
        call.success()
    }

    @objc func logout(_ call: CAPPluginCall) {
        self.log("logout invoked")

        Branch.getInstance().logout()
        call.success()
    }

    @objc func redeemRewards(_ call: CAPPluginCall) {
        self.log("redeemRewards invoked")

        guard let amount = call.getInt("amount") else {
            self.log("redeemRewards - no amount found")

            call.error("No amount specified for redeemRewards")
            return;
        }

        let callback: callbackWithStatus = {(changed, error) in
            if (error != nil) {
                self.log("redeemRewards - \(error!.localizedDescription)")

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
    }

    @objc func creditHistory(_ call: CAPPluginCall) {
        self.log("creditHistory invoked")

        let callback: callbackWithList = {(creditHistory, error) in
            if (error != nil) {
                self.log("creditHistory - \(error!.localizedDescription)")

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
        self.log("logCustomEvent invoked")

        guard let name = call.getString("name") else {
            self.log("logCustomEvent - no name found")

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
