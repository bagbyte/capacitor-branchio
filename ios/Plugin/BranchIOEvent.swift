//
//  BranchIOEvent.swift
//  Plugin
//
//  Created by Sabino Papagna on 30.07.19.
//  Copyright © 2019 Max Lynch. All rights reserved.
//

import Branch

typealias BranchEventRequestCallback = ([AnyHashable: Any]?, Error?) -> ();

public class BranchIOEvent: BranchEvent {
    var _eventName: String
    /*
     let standardEvents: Array<BranchStandardEvent> = [
     .addToCart,
     .addToWishlist,
     .viewCart,
     .initiatePurchase,
     .addPaymentInfo,
     .purchase,
     .spendCredits,
     .search,
     .viewItem,
     .viewItems,
     .rate,
     .share,
     .completeRegistration,
     .completeTutorial,
     .achieveLevel,
     .unlockAchievement,
     .invite,
     .login,
     .reserve,
     .subscribe,
     .startTrial,
     .clickAd,
     .viewAd,
     ]
     */
    public override init(name: String) {
        self._eventName = name;
        super.init(name: name)
    }
    
    func logEventWithCallback(callback: @escaping BranchEventRequestCallback) {
        let eventDictionary = buildEventDictionary()
        
        let request = buildRequest(eventDictionary, callback)
        Branch.getInstance()?.sendServerRequestWithoutSession(request)
    }
    
    private func buildEventDictionary() -> NSDictionary {
        let eventDictionary = NSMutableDictionary()
        eventDictionary["name"] = _eventName
        
        let propertyDictionary = self.dictionary()
        if (propertyDictionary.count > 0) {
            eventDictionary["event_data"] = propertyDictionary
        }
        
        if let eventData = eventDictionary["event_data"] as? NSMutableDictionary {
            eventDictionary["custom_data"] = eventData["custom_data"]
            eventData["custom_data"] = nil
        }
        
        let contentItemDictionaries = NSMutableArray()
        for contentItem in contentItems {
            let dictionary = (contentItem as! BranchUniversalObject).dictionary()
            if (dictionary.count > 0) {
                contentItemDictionaries.add(dictionary)
            }
        }
        
        if (contentItemDictionaries.count > 0) {
            eventDictionary["content_items"] = contentItemDictionaries
        }
        
        return eventDictionary
    }
    
    func buildRequest(_ eventDictionary: NSDictionary, _ callback: BranchEventRequestCallback?) -> BranchEventRequest {
        let preferenceHelper = BNCPreferenceHelper()
        
        let standardEvent: BranchStandardEvent? = BranchStandardEvent(rawValue: _eventName)
        let serverURL: String = (standardEvent != nil)
            ? String.init(format: "%@/%@", preferenceHelper.branchAPIURL, "v2/event/standard")
            : String.init(format: "%@/%@", preferenceHelper.branchAPIURL, "v2/event/custom")
        
        let request = BranchEventRequest.init(serverURL: URL.init(string: serverURL)!, eventDictionary: eventDictionary as? [AnyHashable: Any] ?? [:], completion: callback)
        return request
    }
}
