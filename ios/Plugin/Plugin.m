#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// Define the plugin using the CAP_PLUGIN Macro, and
// each method the plugin supports using the CAP_PLUGIN_METHOD macro.
CAP_PLUGIN(BranchIO, "BranchIO",
           CAP_PLUGIN_METHOD(disableTracking, CAPPluginReturnNone);
           CAP_PLUGIN_METHOD(setIdentity, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(logout, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(redeemRewards, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(creditHistory, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(logEvent, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(trackPageView, CAPPluginReturnPromise);
)
