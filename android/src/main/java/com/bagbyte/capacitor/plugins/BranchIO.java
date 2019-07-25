package com.bagbyte.capacitor.plugins;

import com.getcapacitor.Config;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;

import io.branch.indexing.BranchUniversalObject;
import io.branch.referral.Branch;
import io.branch.referral.BranchError;
import io.branch.referral.util.BranchEvent;

@NativePlugin()
public class BranchIO extends Plugin {
    private static final String PLUGIN_TAG = "BranchIO";
    private static final String CONFIG_KEY_PREFIX = "plugins." + PLUGIN_TAG + ".";
    private static final Integer DEFAULT_HISTORY_LIST_LENGTH = 100;

    private Boolean testMode = true;
    private Boolean trackingDisabled = true;
    private Boolean verbose = true;

    public void load() {
        this.testMode = Config.getBoolean(CONFIG_KEY_PREFIX + "test", this.testMode);
        this.trackingDisabled = Config.getBoolean(CONFIG_KEY_PREFIX + "tracking_disabled", this.trackingDisabled);
        this.verbose = Config.getBoolean(CONFIG_KEY_PREFIX + "verbose", this.verbose);

        this.log("Loading plugin");
        this.log("Test mode: " + testMode);
        this.log("Tracking disabled: " + trackingDisabled);
        this.log("Verbose: " + verbose);

        if (this.testMode) {
            Branch.enableTestMode();
        } else {
            Branch.disableTestMode();
        }

        Branch.getInstance().disableTracking(trackingDisabled);

        Branch.getAutoInstance(this.getActivity());
        /*
        Branch.getInstance().initSession(new Branch.BranchReferralInitListener() {
            @Override
            public void onInitFinished(JSONObject referringParams, BranchError error) {
                if (error == null) {
                    log("onInitFinished - " + referringParams.toString());
                    // Retrieve deeplink keys from 'referringParams' and evaluate the values to determine where to route the user
                    // Check '+clicked_branch_link' before deciding whether to use your Branch routing logic
                } else {
                    log("onInitFinished - " + error.getMessage());
                }
            }
        }, this.getActivity().getIntent().getData(), this.getActivity());
        */
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

        Branch.getInstance().disableTracking(call.getBoolean("value"));

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

        Branch.getInstance().setIdentity(call.getString("id"), new Branch.BranchReferralInitListener() {
            @Override
            public void onInitFinished(JSONObject referringParams, BranchError error) {
                callback("setIdentity", call, referringParams, error);
            }
        });
    }

    @PluginMethod()
    public void logout(final PluginCall call) {
        this.log("logout invoked");

        Branch.getInstance().logout(new Branch.LogoutStatusListener() {
            @Override
            public void onLogoutFinished(boolean loggedOut, BranchError error) {
                callback("logout", call, loggedOut, error);
            }
        });

        call.success();
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
            Branch.getInstance().redeemRewards(call.getString("bucket"), amount, callback);
        } else {
            Branch.getInstance().redeemRewards(amount, callback);
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
            Branch.getInstance().getCreditHistory(
                    options.getString("bucket"),
                    options.getString("begin_after_id"),
                    options.getInteger("length", DEFAULT_HISTORY_LIST_LENGTH),
                    Branch.CreditHistoryOrder.kMostRecentFirst,
                    callback);
        } else {
            Branch.getInstance().getCreditHistory(callback);
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

        BranchEvent event = new BranchEvent(call.getString("name"));

        try {
            if (call.hasOption("data")) {
                JSObject data = call.getObject("data");

                if (data != null && data.names().length() > 0) {
                    for (int i = 0; i < data.names().length(); i++) {
                        event.addCustomDataProperty(data.names().getString(i), data.get(data.names().getString(i)).toString());
                    }
                }
            }

            if (call.hasOption("contentItems")) {
                JSArray data = call.getArray("contentItems");

                if (data != null && data.length() > 0) {
                    List<BranchUniversalObject> contentItems = data.toList();

                    event.addContentItems(contentItems);
                }
            }
        } catch (JSONException e) {
            call.reject(e.getLocalizedMessage(), e);
        }

        event.logEvent(this.getContext());

        call.success();
    }
}
