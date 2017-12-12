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

typedef NS_ENUM(NSInteger, RCTSizeComparison)
{
  RCTSizeTooLarge,
  RCTSizeTooSmall,
  RCTSizeWithinRange,
};

extern NSString *const RCTIsHighlightedAttributeName;
extern NSString *const RCTReactTagAttributeName;
extern NSString *const RNDJSingleCursorPositionAttributeName;
extern NSString *const RNDJDraftJsIndexAttributeName;
extern NSString *const RNDJDraftJsAutocompleteAttributeName;

@interface RNDJShadowDraftJSEditor : RCTShadowView
{
  RNDJContentModel* contentModel;
  RNDJSelectionModel* selectionModel;
  RNDJAutocompleteModel* autocompleteModel;
  NSDictionary* _content;
}

@property (nonatomic, copy) NSDictionary *content;
@property (nonatomic, copy) NSDictionary *selection;
@property (nonatomic, copy) NSDictionary *blockFontTypes;
@property (nonatomic, copy) NSDictionary *inlineStyleFontTypes;
@property (nonatomic, copy) NSDictionary *autocomplete;

@property (nonatomic, assign) CGFloat defaultAtomicWidth;
@property (nonatomic, assign) CGFloat defaultAtomicHeight;


@property (nonatomic, copy) NSString *fontFamily;
@property (nonatomic, assign) CGFloat fontSize;
@property (nonatomic, copy) NSString *fontWeight;
@property (nonatomic, copy) NSString *fontStyle;
@property (nonatomic, copy) NSArray *fontVariant;
@property (nonatomic, assign) CGFloat letterSpacing;
@property (nonatomic, strong) UIColor *color;
@property (nonatomic, assign) CGFloat opacity;
@property (nonatomic, assign) NSTextAlignment textAlign;
@property (nonatomic, assign) CGFloat lineHeight;
@property (nonatomic, assign) NSUnderlineStyle textDecorationStyle;
@property (nonatomic, assign) RCTTextDecorationLineType textDecorationLine;
@property (nonatomic, strong) UIColor *textDecorationColor;
@property (nonatomic, assign) CGSize textShadowOffset;
@property (nonatomic, assign) CGFloat textShadowRadius;
@property (nonatomic, strong) UIColor *textShadowColor;

@property (nonatomic, assign) BOOL showAutocomplete;
@property (nonatomic, assign) int autocompleteStart;
@property (nonatomic, assign) int autoCompleteEnd;

@property (nonatomic, assign) BOOL selectable;
@property (nonatomic, assign) CGFloat fontSizeMultiplier;
@property (nonatomic, assign) BOOL allowFontScaling;

@property (nonatomic, copy) NSString *placeholderText;

@property (nonatomic, assign) CGFloat paragraphSpacing;

- (void)recomputeText;

@end

