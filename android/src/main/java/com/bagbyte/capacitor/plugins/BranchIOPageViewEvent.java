package com.bagbyte.capacitor.plugins;

import org.json.JSONObject;

import java.util.ArrayList;

public class BranchIOPageViewEvent extends BranchIOEvent {
    private static final String EVENT_NAME = "View";

    /**
     * Constructor.
     */
    public BranchIOPageViewEvent() throws NoSuchFieldException, IllegalAccessException  {
        super(EVENT_NAME);

        this._isStandardEvent = true;
    }
}
