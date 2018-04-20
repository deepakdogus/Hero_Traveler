//
//  RNDJSelectionModel.m
//  RNDraftJs
//
//  Created by Andrew Beck on 10/26/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "RNDJSelectionModel.h"

@implementation RNDJSelectionModel

REGISTER_BOOL(hasFocus)

REGISTER_STRING(startKey)
REGISTER_UINTEGER(startOffset)
REGISTER_STRING(endKey)
REGISTER_UINTEGER(endOffset)

- (RNDJDraftJsIndex*) startIndex
{
  return [[RNDJDraftJsIndex alloc] initWithKey:self.startKey offset:self.startOffset];
}

- (RNDJDraftJsIndex*) endIndex
{
  return [[RNDJDraftJsIndex alloc] initWithKey:self.endKey offset:self.endOffset];
}

@end
