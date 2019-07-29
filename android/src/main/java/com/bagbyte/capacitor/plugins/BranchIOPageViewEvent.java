package com.bagbyte.capacitor.plugins;

import android.content.Context;

import io.branch.referral.Branch;

public class BranchIOPageViewEvent extends BranchIOEvent {
    private static final String EVENT_NAME = "pageview";

    /**
     * Constructor.
     */
    public BranchIOPageViewEvent() throws NoSuchFieldException, IllegalAccessException  {
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
            Branch.getInstance().handleNewRequest(new ServerRequestLogEvent(context, reqPath, callback));
            isReqQueued = true;
        }
        return isReqQueued;
    }
}
