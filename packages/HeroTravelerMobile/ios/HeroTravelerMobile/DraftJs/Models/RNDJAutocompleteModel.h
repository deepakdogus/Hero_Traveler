//
//  RNDJAutocompleteModel.h
//  HeroTravelerMobile
//
//  Created by Andrew Beck on 12/6/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "RNDJBaseModel.h"

@interface RNDJAutocompleteModel : RNDJBaseModel

@property(readonly) BOOL enabled;

@property(readonly) NSString* blockKey;
@property(readonly) NSUInteger startOffset;
@property(readonly) NSUInteger endOffset;

@end
