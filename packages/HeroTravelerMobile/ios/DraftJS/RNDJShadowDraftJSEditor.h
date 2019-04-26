//
//  RNDJShadowDraftJSEditor.h
//  RNDraftJs
//
//  Created by Andrew Beck on 10/23/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <React/RCTShadowView.h>
#import <React/RCTTextDecorationLineType.h>
#import "RNDJContentModel.h"
#import "RNDJSelectionModel.h"
#import "RNDJDraftJsIndex.h"
#import "RNDJAutocompleteModel.h"
#import <RCTText/RCTBaseTextShadowView.h>

typedef NS_ENUM(NSInteger, RCTSizeComparison)
{
  RCTSizeTooLarge,
  RCTSizeTooSmall,
  RCTSizeWithinRange,
};

extern NSString *const RNDJDraftJsIsHighlightedAttributeName;
extern NSString *const RNDJDraftJsReactTagAttributeName;
extern NSString *const RNDJSingleCursorPositionAttributeName;
extern NSString *const RNDJDraftJsIndexAttributeName;
extern NSString *const RNDJDraftJsAutocompleteAttributeName;

@interface RNDJShadowDraftJSEditor : RCTBaseTextShadowView
{
  RNDJContentModel* contentModel;
  RNDJSelectionModel* selectionModel;
  RNDJAutocompleteModel* autocompleteModel;
  NSDictionary* _content;
}

- (instancetype)initWithBridge:(RCTBridge *)bridge;

@property (nonatomic, copy) NSDictionary *content;
@property (nonatomic, copy) NSDictionary *selection;
@property (nonatomic, copy) NSDictionary *blockFontTypes;
@property (nonatomic, copy) NSDictionary *inlineStyleFontTypes;
@property (nonatomic, copy) NSDictionary *autocomplete;

@property (nonatomic, assign) CGFloat defaultAtomicWidth;
@property (nonatomic, assign) CGFloat defaultAtomicHeight;

@property (nonatomic, assign) BOOL showAutocomplete;
@property (nonatomic, assign) int autocompleteStart;
@property (nonatomic, assign) int autoCompleteEnd;

@property (nonatomic, copy) NSString *placeholderText;

@property (nonatomic, assign) CGFloat paragraphSpacing;

- (void)uiManagerWillPerformMounting;

@end
