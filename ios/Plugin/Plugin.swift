import Foundation
import Capacitor
import Branch

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitor.ionicframework.com/docs/plugins/ios
 */
@objc(BranchPlugin)
public class BranchPlugin: CAPPlugin {
    var testMode = true
    
    public override func load() {
        testMode = getConfigValue("test") as? Bool ?? testMode
        
        Branch.setUseTestBranchKey(testMode)
        
        NotificationCenter.default.addObserver(self, selector: #selector(handleDidFinishLaunching(_ :)), name: Notification.Name("UIApplicationDidFinishLaunchingNotification"), object: nil);
        
        NotificationCenter.default.addObserver(self, selector: #selector(handleOpenUrl(_ :)), name: Notification.Name(CAPNotifications.URLOpen.name()), object: nil);
        
        NotificationCenter.default.addObserver(self, selector: #selector(handleContinueActivity(_ :)), name: Notification.Name(CAPNotifications.ContinueActivity.name()), object: nil);

        /*
        Branch.getInstance().initSession(launchOptions: launchOptions) { (params, error) in
            print(params as? [String: AnyObject] ?? {})
        }

        NotificationCenter.default.addObserver(self, selector: #selector(handleOpenUrl(_ :)), name: Notification.Name(CAPNotifications.URLOpen.name()), object: nil);

        NotificationCenter.default.addObserver(self, selector: #selector(didFinishLaunching(_ :)), name: Notification.Name(UIApplicationDidFinishLaunchingNotification), object: nil);
*/
        
    }
    
    @objc func handleDidFinishLaunching(_ notification: NSNotification) {
        print("handleDidFinishLaunching")
        if let userInfo = notification.userInfo as? Dictionary<String,Any> {
            if let launchOptions = userInfo["UIApplicationLaunchOptionsLocationKey"] as? [UIApplicationLaunchOptionsKey: Any] {
                print("UIApplicationLaunchOptionsLocationKey")
                
                Branch.getInstance()?.initSession(launchOptions: launchOptions) { (params, error) in
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
            print("There is no object on handleOpenUrl");
            return;
        }
        
        if let userInfo = notification.userInfo as? Dictionary<String,Any> {
            if let launchOptions = userInfo["UIApplicationLaunchOptionsLocationKey"] as? [UIApplicationLaunchOptionsKey: Any] {
                print("UIApplicationLaunchOptionsLocationKey")
                
                Branch.getInstance()?.initSession(launchOptions: launchOptions) { (params, error) in
                    print(params as? [String: AnyObject] ?? {})
                }
            }
        }
    }
    
    @objc func autoAppIndex(_ call: CAPPluginCall) {
        let value = call.getString("value") ?? ""
        call.success([
            "value": value
            ])
    }
    
    @objc func disableTracking(_ call: CAPPluginCall) {
        let value = call.getString("value") ?? ""
        call.success([
            "value": value
            ])
    }
}
