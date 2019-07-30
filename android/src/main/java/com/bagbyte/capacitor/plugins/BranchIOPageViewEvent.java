package com.bagbyte.capacitor.plugins;

import android.content.Context;

import io.branch.referral.Branch;

public class BranchIOPageViewEvent extends BranchIOEvent {
    private static final String EVENT_NAME = "PAGE_VIEW";

    /**
     * Constructor.
     */
    BranchIOPageViewEvent() throws NoSuchFieldException, IllegalAccessException  {
        super(EVENT_NAME);
    }

    /**
     * Logs this BranchEvent to Branch for tracking and analytics
     *
     * @param context Current context
     * @return {@code true} if the event is logged to Branch
     */
    public boolean logEvent(Context context, BranchIOLogEventListener callback) throws NoSuchFieldException, IllegalAccessException {
        boolean isReqQueued = false;
        String reqPath = "v1/pageview";
        if (Branch.getInstance() != null) {
            Branch.getInstance().handleNewRequest(new ServerRequestLogPageViewEvent(context, reqPath, callback));
            isReqQueued = true;
        }
        return isReqQueued;
    }

    protected class ServerRequestLogPageViewEvent extends ServerRequestLogEvent {
        ServerRequestLogPageViewEvent(Context context, String requestPath, BranchIOLogEventListener callback) throws NoSuchFieldException, IllegalAccessException {
            super(context, requestPath, callback);
        }

        @Override
        public BRANCH_API_VERSION getBranchRemoteAPIVersion() {
            return BRANCH_API_VERSION.V1; //This is a v2 event
        }
    }
}
