package com.bagbyte.capacitor.plugins;

import android.content.Context;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Field;
import java.util.List;

import io.branch.indexing.BranchUniversalObject;
import io.branch.referral.Branch;
import io.branch.referral.Defines;
import io.branch.referral.ServerRequest;
import io.branch.referral.ServerResponse;
import io.branch.referral.util.BRANCH_STANDARD_EVENT;
import io.branch.referral.util.BranchEvent;

public class BranchIOEvent extends BranchEvent {
    protected boolean _isStandardEvent;
    private String _eventName;

    /**
     * Constructor.
     * @param branchStandardEvent Branch Standard Event
     */
    public BranchIOEvent(BRANCH_STANDARD_EVENT branchStandardEvent) throws NoSuchFieldException, IllegalAccessException {
        this(branchStandardEvent.getName());
    }

    /**
     * Constructor.
     * This constructor can be used for free-form Events or Branch Standard Events.
     * Event names that match Standard Events will be treated as Standard Events.
     * @param eventName Event Name.
     */
    public BranchIOEvent(String eventName) throws NoSuchFieldException, IllegalAccessException {
        super(eventName);

        this._eventName = eventName;

        Field field = BranchEvent.class.getDeclaredField("isStandardEvent");
        field.setAccessible(true);
        this._isStandardEvent = field.getBoolean(this);
    }

    private JSONObject getStandardProperties() throws NoSuchFieldException, IllegalAccessException {
        Field field = BranchEvent.class.getDeclaredField("standardProperties");
        field.setAccessible(true);

        return ((JSONObject) field.get(this));
    }

    private JSONObject getCustomProperties() throws NoSuchFieldException, IllegalAccessException {
        Field field = BranchEvent.class.getDeclaredField("customProperties");
        field.setAccessible(true);

        return ((JSONObject) field.get(this));
    }

    private List<BranchUniversalObject> getBuoList() throws NoSuchFieldException, IllegalAccessException {
        Field field = BranchEvent.class.getDeclaredField("buoList");
        field.setAccessible(true);

        return cast(field.get(this));
    }

    @SuppressWarnings("unchecked")
    public static <T extends List<?>> T cast(Object obj) {
        return (T) obj;
    }

    public interface BranchIOLogEventListener {
        void onStateChanged(ServerResponse response, String errorMsg);
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

    private class ServerRequestLogEvent extends ServerRequest {
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
            callback.onStateChanged(response, null);
        }

        @Override
        public void handleFailure(int statusCode, String causeMsg) {
            callback.onStateChanged(null, causeMsg);
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
