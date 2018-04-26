//
//  RNDJSelectionModel.h
//  RNDraftJs
//
//  Created by Andrew Beck on 10/26/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "RNDJBaseModel.h"
#import "RNDJDraftJsIndex.h"

@interface RNDJSelectionModel : RNDJBaseModel

@property(readonly) BOOL hasFocus;

@property(readonly) NSString* startKey;
@property(readonly) NSUInteger startOffsetIndex;

@property(readonly) NSString* endKey;
@property(readonly) NSUInteger endOffsetIndex;

- (RNDJDraftJsIndex*) startIndex;
- (RNDJDraftJsIndex*) endIndex;

@end
