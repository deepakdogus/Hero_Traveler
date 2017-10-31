//
//  RNDJStyle.h
//  RNDraftJs
//
//  Created by Andrew Beck on 10/26/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "RNDJShadowDraftJSEditor.h"
#import <React/RCTTextDecorationLineType.h>

@interface RNDJStyle : NSObject

@property (nonatomic, copy) NSString *fontFamily;
@property (nonatomic, copy) NSNumber *fontSize;
@property (nonatomic, copy) NSString *fontWeight;
@property (nonatomic, copy) NSString *fontStyle;
@property (nonatomic, copy) NSArray *fontVariant;
@property (nonatomic, copy) NSNumber *letterSpacing;
@property (nonatomic, strong) UIColor *color;
@property (nonatomic, strong) UIColor *backgroundColor;
@property (nonatomic, copy) NSNumber *opacity;

@property (nonatomic, assign) BOOL wasTextAlignSet;
@property (nonatomic, assign) NSTextAlignment textAlign;

@property (nonatomic, copy) NSNumber *lineHeight;

@property (nonatomic, assign) BOOL wasTextDecorationStyleSet;
@property (nonatomic, assign) NSUnderlineStyle textDecorationStyle;
@property (nonatomic, assign) BOOL wasTextDecorationLineSet;
@property (nonatomic, assign) RCTTextDecorationLineType textDecorationLine;
@property (nonatomic, strong) UIColor *textDecorationColor;

@property (nonatomic, copy) NSNumber *textShadowOffsetWidth;
@property (nonatomic, copy) NSNumber *textShadowOffsetHeight;
@property (nonatomic, copy) NSNumber *textShadowRadius;
@property (nonatomic, strong) UIColor *textShadowColor;

@property (nonatomic, copy) NSNumber *allowFontScaling;

@property (nonatomic, copy) NSString *placeholderText;
@property (nonatomic, strong) RNDJStyle *placeholderStyle;

- (instancetype) initWithStyle:(RNDJStyle *)style;
- (instancetype) initWithDictionary:(NSDictionary *)dictionary;
- (instancetype) initWithShadowView:(RNDJShadowDraftJSEditor *)shadowView;

- (RNDJStyle *) applyStyle:(RNDJStyle *)otherStyle;

@end
