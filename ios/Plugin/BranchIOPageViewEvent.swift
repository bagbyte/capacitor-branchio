//
//  BranchIOPageViewEvent.swift
//  Plugin
//
//  Created by Sabino Papagna on 30.07.19.
//  Copyright © 2019 Max Lynch. All rights reserved.
//

import Branch

public class BranchIOPageViewEvent: BranchIOEvent {
    let EVENT_NAME = "PAGE_VIEW"
    
    public override init(name: String) {
        super.init(name: EVENT_NAME)
        _eventName = EVENT_NAME
    }
    
    override func buildRequest(_ eventDictionary: NSDictionary, _ callback: BranchEventRequestCallback?) -> BranchEventRequest {
        let preferenceHelper = BNCPreferenceHelper()
        
        let serverURL: String = String.init(format: "%@/%@", preferenceHelper.branchAPIURL, "v1/pageview")
        
        let request = BranchEventRequest.init(serverURL: URL.init(string: serverURL)!, eventDictionary: eventDictionary as? [AnyHashable: Any] ?? [:], completion: callback)
        return request
    }
}
