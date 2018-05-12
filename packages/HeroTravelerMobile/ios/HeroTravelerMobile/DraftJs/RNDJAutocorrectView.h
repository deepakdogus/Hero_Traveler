//
//  RNDJAutocorrectView.h
//  HeroTravelerMobile
//
//  Created by Andrew Beck on 12/7/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>
#import "RNDJDraftJsIndex.h"

typedef void (^CancelAutoCorrectBlock)(NSString*);

@interface AutocompleteViewInfo: NSObject

- (NSString*) stringRepresentation;
- (NSString*) previousStringRepresentation;

@property(readonly) CGPoint point;
@property(readonly, strong) NSString* existingText;
@property(readonly, strong) NSString* textSuggestion;
@property(readonly) NSRange range;
@property(readonly, strong) RNDJDraftJsIndex* start;
@property(readonly, strong) RNDJDraftJsIndex* end;

- (instancetype) initWithPoint:(CGPoint)point existingText:(NSString *)existingText inRange:(NSRange)range start:(RNDJDraftJsIndex*)start end:(RNDJDraftJsIndex*)end textSuggestion:(NSString*)textSuggestion;

@end

@interface RNDJAutocorrectView : UIView

@property (nonatomic, strong) AutocompleteViewInfo* autocomplete;
@property (nonatomic, copy) RCTDirectEventBlock onReplaceRangeRequest;
@property(readonly, strong) CancelAutoCorrectBlock cancelAutocorrectBlock;

@property(readonly, assign) NSUInteger previousCount;

+ (RNDJAutocorrectView*) make:(AutocompleteViewInfo*)info inside:(UIView*)view cancelBlock:(CancelAutoCorrectBlock)cancelAutocorrectBlock withContentOffset:(UIEdgeInsets)contentInset withPreviousCount:(NSUInteger)previousCount;

- (void) dispatch;

@end
