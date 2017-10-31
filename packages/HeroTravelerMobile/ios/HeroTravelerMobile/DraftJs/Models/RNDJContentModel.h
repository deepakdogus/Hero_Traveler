//
//  RNDJContentModel.h
//  RNDraftJs
//
//  Created by Andrew Beck on 10/25/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "RNDJBaseModel.h"
#import "RNDJBlockModel.h"
#import "RNDJEntityModel.h"

@interface RNDJContentModel : RNDJBaseModel

@property(readonly) NSArray* blocks;
@property(readonly) NSDictionary* entityMap;

@end
