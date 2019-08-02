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
import io.branch.referral.util.BRANCH_STANDARD_EVENT;

@NativePlugin()
public class BranchIO extends Plugin {
    private static final String PLUGIN_TAG = "BranchIO";
    private static final Integer DEFAULT_HISTORY_LIST_LENGTH = 100;

    private static final String CONFIG_KEY_TEST_MODE = "test";
    private static final String CONFIG_KEY_TRACKING_DISABLED = "tracking_disabled";
    private static final String CONFIG_KEY_VERBOSE = "verbose";

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
        Object testConfig = getConfigValue(CONFIG_KEY_TEST_MODE);

        if (testConfig != null) {
            testMode = ((Boolean) testConfig);
        }

        Object trackingDisabledConfig = getConfigValue(CONFIG_KEY_TRACKING_DISABLED);

        if (trackingDisabledConfig != null) {
            trackingDisabled = ((Boolean) trackingDisabledConfig);
        }

        Object verboseConfig = getConfigValue(CONFIG_KEY_VERBOSE);

        if (verboseConfig != null) {
            verbose = ((Boolean) verboseConfig);
        }

        this.log("Config " + CONFIG_KEY_TEST_MODE + ": " + testMode);
        this.log("Config " + CONFIG_KEY_TRACKING_DISABLED + ": " + trackingDisabled);
        this.log("Config " + CONFIG_KEY_VERBOSE + ": " + verbose);
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

    private void handleBranchResult(String method, PluginCall call, Object data, BranchError error) {
        if (error != null) {
            log(method + " failed - " + error.getMessage());

            call.reject(error.getMessage());
            return;
        }

        log(method + " succeeded");

        if (data != null) {
            JSObject result = new JSObject();
            result.put("result", data);
            call.success(result);
        } else {
            call.success();
        }
    }

    @PluginMethod()
    public void initBranch(final PluginCall call) {
        JSObject result = new JSObject();
        result.put("result", null);
        call.success(result);
    }

    @PluginMethod()
    public void disableTracking(final PluginCall call) {
        final String methodName = call.getMethodName();

        this.log(methodName + " invoked");

        if (!call.hasOption("value")) {
            this.log(methodName + " - no 'value' found");

            call.reject("No 'value' specified for " + methodName);
            return;
        }

        branchInstance.disableTracking(call.getBoolean("value"));
    }

    @PluginMethod()
    public void setIdentity(final PluginCall call) {
        final String methodName = call.getMethodName();

        this.log(methodName + " invoked");

        if (!call.hasOption("id")) {
            this.log(methodName + " - no 'id' found");

            call.reject("No 'id' specified for " + methodName);
            return;
        }

        branchInstance.setIdentity(call.getString("id"), new Branch.BranchReferralInitListener() {
            @Override
            public void onInitFinished(JSONObject referringParams, BranchError error) {
                handleBranchResult(methodName, call, referringParams, error);
            }
        });
    }

    @PluginMethod()
    public void logout(final PluginCall call) {
        final String methodName = call.getMethodName();

        this.log(methodName + " invoked");

        branchInstance.logout(new Branch.LogoutStatusListener() {
            @Override
            public void onLogoutFinished(boolean loggedOut, BranchError error) {
                handleBranchResult(methodName, call, loggedOut, error);
            }
        });
    }

    @PluginMethod()
    public void redeemRewards(final PluginCall call) {
        final String methodName = call.getMethodName();

        this.log(methodName + " invoked");

        if (!call.hasOption("amount")) {
            this.log(methodName + " - no 'amount' found");

            call.reject("No amount specified for " + methodName);
            return;
        }

        int amount = call.getInt("amount");

        Branch.BranchReferralStateChangedListener callback = new Branch.BranchReferralStateChangedListener() {
            @Override
            public void onStateChanged(boolean changed, BranchError error) {
                handleBranchResult(methodName, call, changed, error);
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
        final String methodName = call.getMethodName();

        this.log(methodName + " invoked");

        Branch.BranchListResponseListener callback = new Branch.BranchListResponseListener() {
            @Override
            public void onReceivingResponse(JSONArray list, BranchError error) {
                handleBranchResult(methodName, call, list, error);
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

    private void updateEventObject(String methodName, BranchIOEvent event, JSONObject data, JSArray contentItems) {
        if (data != null) {
            Iterator<String> keys = data.keys();

            while (keys.hasNext()) {
                String key = keys.next();

                try {
                    event.addProperty(key, data.get(key));
                } catch (JSONException e) {
                    log(methodName + " - error while trying to extract '" + key + "' from data. " + e.getLocalizedMessage());
                }
            }
        }

        if (contentItems != null) {
            for (int i = 0; i < contentItems.length(); ++i) {
                try {
                    event.addContentItems(BranchUniversalObject.createInstance(contentItems.getJSONObject(i)));
                } catch (JSONException e) {
                    log(methodName + " - error while trying to get content item on position " + i +  ". " + e.getLocalizedMessage());
                }
            }
        }

    }

    private void logEvent(final String methodName, final String eventName, final PluginCall call) {
        try {
            BranchIOEvent event = new BranchIOEvent(eventName);

            this.updateEventObject(methodName, event, call.getObject("data"), call.getArray("content_items"));

            BranchIOEvent.BranchIOLogEventListener callback = new BranchIOEvent.BranchIOLogEventListener() {
                @Override
                public void onStateChanged(JSONObject response, BranchError error) {
                    handleBranchResult(methodName, call, response, error);
                }
            };

            event.logEvent(this.getContext(), callback);
        } catch (Exception e) {
            call.reject(e.getLocalizedMessage(), e);
        }
    }

    @PluginMethod()
    public void logEvent(final PluginCall call) {
        final String methodName = call.getMethodName();

        this.log(methodName + " invoked");

        if (!call.hasOption("name")) {
            this.log(methodName + " - no 'name' found");

            call.reject("No event name specified for " + methodName);
            return;
        }

        logEvent(methodName, call.getString("name").toUpperCase(), call);
    }

    @PluginMethod()
    public void trackPageView(final PluginCall call) {
        final String methodName = call.getMethodName();

        this.log(methodName + " invoked");

        logEvent(methodName, BRANCH_STANDARD_EVENT.VIEW_ITEM.getName(), call);
    }
}
