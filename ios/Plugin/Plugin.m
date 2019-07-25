#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// Define the plugin using the CAP_PLUGIN Macro, and
// each method the plugin supports using the CAP_PLUGIN_METHOD macro.
CAP_PLUGIN(BranchPlugin, "BranchPlugin",
           CAP_PLUGIN_METHOD(init, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(disableTracking, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(setIdentity, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(logout, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(redeemRewards, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(creditHistory, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(logCustomEvent, CAPPluginReturnPromise);
)
