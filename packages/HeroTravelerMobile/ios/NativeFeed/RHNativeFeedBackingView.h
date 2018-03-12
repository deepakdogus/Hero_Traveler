//
//  RHNativeFeedBackingView.h
//  HeroTravelerMobile
//
//  Created by Andrew Beck on 3/11/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface RHNativeFeedBackingView : UIView

@property(nonatomic, strong) UIColor* backgroundColor;
@property(nonatomic, strong) UIColor* titleColor;
@property(nonatomic, strong) UIColor* separatorColor;

@property(nonatomic, assign) CGFloat leftInset;

@property(nonatomic, assign) CGFloat topBarHeight;
@property(nonatomic, assign) CGFloat topTitleTopInset;
@property(nonatomic, assign) CGFloat topTitleHeight;
@property(nonatomic, assign) CGFloat topTitleWidth;

@property(nonatomic, assign) CGFloat bottomBarHeight;
@property(nonatomic, assign) CGFloat bottomTopTitleTopInset;
@property(nonatomic, assign) CGFloat bottomTopTitleHeight;
@property(nonatomic, assign) CGFloat bottomTopTitleWidth;

@property(nonatomic, assign) CGFloat bottomMiddleSpacerHeight;
@property(nonatomic, assign) CGFloat bottomBottomTitleHeight;
@property(nonatomic, assign) CGFloat bottomBottomTitleWidth;

- (void) setHeights:(NSArray*)heights; // [NSNumber]
- (void) setSeparatorHeight:(CGFloat)separatorHeight;

@end
