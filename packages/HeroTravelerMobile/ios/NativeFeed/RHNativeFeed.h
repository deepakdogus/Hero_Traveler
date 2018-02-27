//
//  RHNativeFeed.h
//  HeroTravelerMobile
//
//  Created by Andrew Beck on 2/24/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTComponent.h>
#import <React/RCTView.h>

@interface RHNativeFeed : RCTView <UIScrollViewDelegate>

- (instancetype)initWithEventDispatcher:(RCTEventDispatcher *)eventDispatcher;
- (void) recalculateBackingView;

@property(nonatomic, assign) NSInteger minCellIndex;
@property(nonatomic, assign) NSInteger maxCellIndex;
@property(nonatomic, assign) NSInteger playingCellIndex;

@property(nonatomic, assign) CGFloat cellHeight;
@property(nonatomic, assign) CGFloat cellSeparatorHeight;
@property(nonatomic, assign) NSInteger numPreloadBehindCells;
@property(nonatomic, assign) NSInteger numPreloadAheadCells;
@property(nonatomic, assign) NSInteger numCells;

@property(nonatomic, copy) RCTDirectEventBlock onVisibleCellsChanged;

@property (nonatomic, assign) BOOL DEPRECATED_sendUpdatedChildFrames;
@property (nonatomic, assign) NSTimeInterval scrollEventThrottle;

@property (nonatomic, copy) RCTDirectEventBlock onScrollBeginDrag;
@property (nonatomic, copy) RCTDirectEventBlock onScroll;
@property (nonatomic, copy) RCTDirectEventBlock onScrollEndDrag;
@property (nonatomic, copy) RCTDirectEventBlock onMomentumScrollBegin;
@property (nonatomic, copy) RCTDirectEventBlock onMomentumScrollEnd;

@end
