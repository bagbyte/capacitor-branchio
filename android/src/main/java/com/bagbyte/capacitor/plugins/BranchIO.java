package com.bagbyte.capacitor.plugins;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Iterator;

import io.branch.indexing.BranchUniversalObject;
import io.branch.referral.Branch;
import io.branch.referral.BranchError;

@NativePlugin()
public class BranchIO extends Plugin {
    private static final String PLUGIN_TAG = "BranchIO";
    private static final Integer DEFAULT_HISTORY_LIST_LENGTH = 100;

    private static final String CONFIG_TEST_MODE = "test";
    private static final String CONFIG_TRACKING_DISABLED = "tracking_disabled";
    private static final String CONFIG_VERBOSE = "verbose";

    private Boolean testMode = true;
    private Boolean trackingDisabled = false;
    private Boolean verbose = false;

    private Branch branchInstance;

    public void load() {
        this.log("Loading " + PLUGIN_TAG + " plugin");

        loadConfig();

        if (this.testMode) {
            Branch.enableTestMode();
        } else {
            Branch.disableTestMode();
        }
    }

    private void loadConfig() {
        Object testConfig = getConfigValue(CONFIG_TEST_MODE);

        if (testConfig != null) {
            testMode = ((Boolean) testConfig);
        }

        Object trackingDisabledConfig = getConfigValue(CONFIG_TRACKING_DISABLED);

        if (trackingDisabledConfig != null) {
            trackingDisabled = ((Boolean) trackingDisabledConfig);
        }

        Object verboseConfig = getConfigValue(CONFIG_VERBOSE);

        if (verboseConfig != null) {
            verbose = ((Boolean) verboseConfig);
        }

        this.log(CONFIG_TEST_MODE + ": " + testMode);
        this.log(CONFIG_TRACKING_DISABLED + ": " + trackingDisabled);
        this.log(CONFIG_VERBOSE + ": " + verbose);
    }

    @Override
    protected void handleOnStart() {
        branchInstance = Branch.getAutoInstance(this.getActivity().getApplication());
        branchInstance.disableTracking(trackingDisabled);

        branchInstance.initSession(new Branch.BranchReferralInitListener() {
            @Override
            public void onInitFinished(JSONObject referringParams, BranchError error) {
                if (error != null) {
                    log("onInitFinished - " + error.getMessage());
                } else {
                    log("onInitFinished invoked with " + referringParams.toString());

                    // Retrieve deeplink keys from 'referringParams' and evaluate the values to determine where to route the user
                    // Check '+clicked_branch_link' before deciding whether to use your Branch routing logic
                }
            }

        }, getActivity().getIntent().getData(), getActivity());
    }

    private void log(String message) {
        if (this.verbose) {
            System.out.println(PLUGIN_TAG + " - " + message);
        }
    }

    private void callback(String method, PluginCall call, Object data, BranchError error) {
        if (error != null) {
            log(method + " - " + error.getMessage());

            call.reject(error.getMessage());
        } else {
            log(method + " - Succeeded");

            if (data != null) {
                JSObject result = new JSObject();
                result.put("result", data);
                call.success(result);
            } else {
                call.success();
            }
        }
    }

    @PluginMethod()
    public void autoAppIndex(final PluginCall call) {
        this.log("autoAppIndex method not implemented");

        call.success();
    }

    @PluginMethod()
    public void disableTracking(final PluginCall call) {
        this.log("disableTracking invoked");

        if (!call.hasOption("value")) {
            this.log("disableTracking - no value found");

            call.reject("No value specified for disableTracking");
            return;
        }

        branchInstance.disableTracking(call.getBoolean("value"));

        call.success();
    }

    @PluginMethod()
    public void setIdentity(final PluginCall call) {
        this.log("setIdentity invoked");

        if (!call.hasOption("id")) {
            this.log("setIdentity - no id found");

            call.reject("No id specified for setIdentity");
            return;
        }

        log("setIdentity ID: " + call.getString("id"));

        branchInstance.setIdentity(call.getString("id"), new Branch.BranchReferralInitListener() {
            @Override
            public void onInitFinished(JSONObject referringParams, BranchError error) {
                callback("setIdentity", call, referringParams, error);
            }
        });
    }

    @PluginMethod()
    public void logout(final PluginCall call) {
        this.log("logout invoked");

        branchInstance.logout(new Branch.LogoutStatusListener() {
            @Override
            public void onLogoutFinished(boolean loggedOut, BranchError error) {
                callback("logout", call, loggedOut, error);
            }
        });
    }

    @PluginMethod()
    public void redeemRewards(final PluginCall call) {
        this.log("redeemRewards invoked");

        if (!call.hasOption("amount")) {
            this.log("redeemRewards - no amount found");

            call.reject("No amount specified for redeemRewards");
            return;
        }

        int amount = call.getInt("amount");

        Branch.BranchReferralStateChangedListener callback = new Branch.BranchReferralStateChangedListener() {
            @Override
            public void onStateChanged(boolean changed, BranchError error) {
                callback("redeemRewards", call, changed, error);
            }
        };

        if (call.hasOption("bucket")) {
            branchInstance.redeemRewards(call.getString("bucket"), amount, callback);
        } else {
            branchInstance.redeemRewards(amount, callback);
        }
    }

    @PluginMethod()
    public void creditHistory(final PluginCall call) {
        this.log("creditHistory invoked");

        Branch.BranchListResponseListener callback = new Branch.BranchListResponseListener() {
            @Override
            public void onReceivingResponse(JSONArray list, BranchError error) {
                callback("creditHistory", call, list, error);
            }
        };

        if (call.hasOption("options")) {
            JSObject options = call.getObject("options");
            branchInstance.getCreditHistory(
                    options.getString("bucket"),
                    options.getString("begin_after_id"),
                    options.getInteger("length", DEFAULT_HISTORY_LIST_LENGTH),
                    Branch.CreditHistoryOrder.kMostRecentFirst,
                    callback);
        } else {
            branchInstance.getCreditHistory(callback);
        }
    }

    private void updateEventObject(BranchIOEvent event, JSONObject data, JSArray contentItems) {
        if (data != null) {
            Iterator<String> keys = data.keys();

            while (keys.hasNext()) {
                String key = keys.next();

                try {
                    event.addProperty(key, data.get(key));
                } catch (JSONException e) {
                    log("logCustomEvent - error while trying to extract '" + key + "' from data. " + e.getLocalizedMessage());
                }
            }
        }

        if (contentItems != null) {
            for (int i = 0; i < contentItems.length(); ++i) {
                try {
                    event.addContentItems(BranchUniversalObject.createInstance(contentItems.getJSONObject(i)));
                } catch (JSONException e) {
                    log("logCustomEvent - error while trying to get content item on position " + i +  ". " + e.getLocalizedMessage());
                }
            }
        }

    }

    @PluginMethod()
    public void logCustomEvent(final PluginCall call) {
        this.log("logCustomEvent invoked");

        if (!call.hasOption("name")) {
            this.log("logCustomEvent - no name found");

            call.reject("No event name specified for logCustomEvent");
            return;
        }

        try {
            BranchIOEvent event = new BranchIOEvent(call.getString("name"));

            this.updateEventObject(event, call.getObject("data"), call.getArray("content_items"));

            BranchIOEvent.BranchIOLogEventListener callback = new BranchIOEvent.BranchIOLogEventListener() {
                @Override
                public void onStateChanged(JSONObject response, BranchError error) {
                    callback("logCustomEvent", call, response, error);
                }
            };

            event.logEvent(this.getContext(), callback);
        } catch (Exception e) {
            call.reject(e.getLocalizedMessage(), e);
        }
    }

    @PluginMethod()
    public void trackPageview(final PluginCall call) {
        this.log("trackPageview invoked");

        try {
            BranchIOPageViewEvent event = new BranchIOPageViewEvent();

            this.updateEventObject(event, call.getObject("data"), call.getArray("content_items"));

            BranchIOEvent.BranchIOLogEventListener callback = new BranchIOEvent.BranchIOLogEventListener() {
                @Override
                public void onStateChanged(JSONObject response, BranchError error) {
                    callback("trackPageview", call, response, error);
                }
            };

            event.logEvent(this.getContext(), callback);
        } catch (Exception e) {
            call.reject(e.getLocalizedMessage(), e);
        }
    }
}
