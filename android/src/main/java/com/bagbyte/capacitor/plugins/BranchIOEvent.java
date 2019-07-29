package com.bagbyte.capacitor.plugins;

import android.content.Context;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Field;
import java.util.Iterator;
import java.util.List;

import io.branch.indexing.BranchUniversalObject;
import io.branch.referral.Branch;
import io.branch.referral.BranchError;
import io.branch.referral.Defines;
import io.branch.referral.ServerRequest;
import io.branch.referral.ServerResponse;
import io.branch.referral.util.AdType;
import io.branch.referral.util.BranchEvent;
import io.branch.referral.util.CurrencyType;

public class BranchIOEvent extends BranchEvent {
    private String _eventName;
    private boolean _isStandardEvent;

    /**
     * Constructor.
     * This constructor can be used for free-form Events or Branch Standard Events.
     * Event names that match Standard Events will be treated as Standard Events.
     * @param eventName Event Name.
     */
    BranchIOEvent(String eventName) throws NoSuchFieldException, IllegalAccessException {
        super(eventName);

        this._eventName = eventName;
        this._isStandardEvent = this.getSuperProperty("isStandardEvent");

        this.setAdType(AdType.NATIVE);
    }

    private JSONObject getStandardProperties() throws NoSuchFieldException, IllegalAccessException {
        return this.getSuperProperty("standardProperties");
    }

    private JSONObject getCustomProperties() throws NoSuchFieldException, IllegalAccessException {
        return this.getSuperProperty("customProperties");
    }

    private List<BranchUniversalObject> getBuoList() throws NoSuchFieldException, IllegalAccessException {
        return castList(this.getSuperProperty("buoList"));
    }

    @SuppressWarnings("unchecked")
    private <T> T getSuperProperty(String propertyName) throws NoSuchFieldException, IllegalAccessException {
        Field field = BranchEvent.class.getDeclaredField(propertyName);
        field.setAccessible(true);

        return ((T) field.get(this));
    }

    @SuppressWarnings("unchecked")
    private static <T extends List<?>> T castList(Object obj) {
        return (T) obj;
    }

    public void addProperty(String name, Object value) {
        if (name.equals(Defines.Jsonkey.TransactionID.getKey())) {
            this.setTransactionID(value.toString());
        } else if (name.equals(Defines.Jsonkey.Currency.getKey())) {
            this.setCurrency(CurrencyType.getValue(value.toString()));
        } else if (name.equals(Defines.Jsonkey.Revenue.getKey())) {
            this.setRevenue(Double.valueOf(value.toString()));
        } else if (name.equals(Defines.Jsonkey.Shipping.getKey())) {
            this.setShipping(Double.valueOf(value.toString()));
        } else if (name.equals(Defines.Jsonkey.Tax.getKey())) {
            this.setTax(Double.valueOf(value.toString()));
        } else if (name.equals(Defines.Jsonkey.Coupon.getKey())) {
            this.setCoupon(value.toString());
        } else if (name.equals(Defines.Jsonkey.Affiliation.getKey())) {
            this.setAffiliation(value.toString());
        } else if (name.equals(Defines.Jsonkey.Description.getKey())) {
            this.setDescription(value.toString());
        } else if (name.equals(Defines.Jsonkey.SearchQuery.getKey())) {
            this.setSearchQuery(value.toString());
        } else {
            this.addCustomDataProperty(name, value.toString());
        }
    }

    public interface BranchIOLogEventListener {
        void onStateChanged(JSONObject response, BranchError error);
    }

    /**
     * Logs this BranchEvent to Branch for tracking and analytics
     *
     * @param context Current context
     * @param callback Callback
     * @return {@code true} if the event is logged to Branch
     */
    public boolean logEvent(Context context, BranchIOLogEventListener callback) throws NoSuchFieldException, IllegalAccessException {
        boolean isReqQueued = false;
        String reqPath = this._isStandardEvent ? Defines.RequestPath.TrackStandardEvent.getPath() : Defines.RequestPath.TrackCustomEvent.getPath();
        if (Branch.getInstance() != null) {
            Branch.getInstance().handleNewRequest(new ServerRequestLogEvent(context, reqPath, callback));
            isReqQueued = true;
        }
        return isReqQueued;
    }

    protected class ServerRequestLogEvent extends ServerRequest {
        private BranchIOLogEventListener callback;

        ServerRequestLogEvent(Context context, String requestPath, BranchIOLogEventListener callback) throws NoSuchFieldException, IllegalAccessException {
            super(context, requestPath);

            this.callback = callback;

            JSONObject reqBody = new JSONObject();
            try {
                reqBody.put(Defines.Jsonkey.Name.getKey(), _eventName);
                if (getCustomProperties().length() > 0) {
                    reqBody.put(Defines.Jsonkey.CustomData.getKey(), getCustomProperties());
                }

                if (getStandardProperties().length() > 0) {
                    reqBody.put(Defines.Jsonkey.EventData.getKey(), getStandardProperties());
                }
                if (getBuoList().size() > 0) {
                    JSONArray contentItemsArray = new JSONArray();
                    reqBody.put(Defines.Jsonkey.ContentItems.getKey(), contentItemsArray);
                    for (BranchUniversalObject buo : getBuoList()) {
                        contentItemsArray.put(buo.convertToJson());
                    }
                }
                setPost(reqBody);
            } catch (JSONException e) {
                e.printStackTrace();
            }
            updateEnvironment(context, reqBody);
        }

        @Override
        public boolean handleErrors(Context context) {
            return false;
        }

        @Override
        public void onRequestSucceeded(ServerResponse response, Branch branch) {
            callback.onStateChanged(response.getObject(), null);
        }

        @Override
        public void handleFailure(int statusCode, String causeMsg) {
            callback.onStateChanged(null, new BranchError(causeMsg, 0));
        }

        @Override
        public boolean isGetRequest() {
            return false;
        }

        @Override
        public void clearCallbacks() {
        }

        @Override
        public BRANCH_API_VERSION getBranchRemoteAPIVersion() {
            return BRANCH_API_VERSION.V2; //This is a v2 event
        }

        @Override
        protected boolean shouldUpdateLimitFacebookTracking() {
            return true;
        }

        public boolean shouldRetryOnFail() {
            return true; // Branch event need to be retried on failure.
        }
    }
}
