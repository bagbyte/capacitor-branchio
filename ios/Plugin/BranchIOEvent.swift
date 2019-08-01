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
    
     let standardEvents: Array<String> = [
         BranchStandardEvent.addToCart.rawValue,
         BranchStandardEvent.addToWishlist.rawValue,
         BranchStandardEvent.viewCart.rawValue,
         BranchStandardEvent.initiatePurchase.rawValue,
         BranchStandardEvent.addPaymentInfo.rawValue,
         BranchStandardEvent.purchase.rawValue,
         BranchStandardEvent.spendCredits.rawValue,
         BranchStandardEvent.search.rawValue,
         BranchStandardEvent.viewItem.rawValue,
         BranchStandardEvent.viewItems.rawValue,
         BranchStandardEvent.rate.rawValue,
         BranchStandardEvent.share.rawValue,
         BranchStandardEvent.completeRegistration.rawValue,
         BranchStandardEvent.completeTutorial.rawValue,
         BranchStandardEvent.achieveLevel.rawValue,
         BranchStandardEvent.unlockAchievement.rawValue,
         BranchStandardEvent.invite.rawValue,
         BranchStandardEvent.login.rawValue,
         BranchStandardEvent.reserve.rawValue,
         BranchStandardEvent.subscribe.rawValue,
         BranchStandardEvent.startTrial.rawValue,
         BranchStandardEvent.clickAd.rawValue,
         BranchStandardEvent.viewAd.rawValue,
     ]
    
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
        
        let serverURL: String = standardEvents.contains(_eventName)
            ? String.init(format: "%@/%@", preferenceHelper.branchAPIURL, "v2/event/standard")
            : String.init(format: "%@/%@", preferenceHelper.branchAPIURL, "v2/event/custom")
        
        let request = BranchEventRequest.init(serverURL: URL.init(string: serverURL)!, eventDictionary: eventDictionary as? [AnyHashable: Any] ?? [:], completion: callback)
        return request
    }
}
