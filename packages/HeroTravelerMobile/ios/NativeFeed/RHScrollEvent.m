//
//  RHScrollEvent.m
//  HeroTravelerMobile
//
//  Created by Andrew Beck on 2/27/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RHScrollEvent.h"
#import <React/RCTAssert.h>

@implementation RHScrollEvent
{
  CGPoint _scrollViewContentOffset;
  UIEdgeInsets _scrollViewContentInset;
  CGSize _scrollViewContentSize;
  CGRect _scrollViewFrame;
  CGFloat _scrollViewZoomScale;
  NSDictionary *_userData;
  uint16_t _coalescingKey;
}

@synthesize viewTag = _viewTag;
@synthesize eventName = _eventName;

- (instancetype)initWithEventName:(NSString *)eventName
                         reactTag:(NSNumber *)reactTag
          scrollViewContentOffset:(CGPoint)scrollViewContentOffset
           scrollViewContentInset:(UIEdgeInsets)scrollViewContentInset
            scrollViewContentSize:(CGSize)scrollViewContentSize
                  scrollViewFrame:(CGRect)scrollViewFrame
              scrollViewZoomScale:(CGFloat)scrollViewZoomScale
                         userData:(NSDictionary *)userData
                    coalescingKey:(uint16_t)coalescingKey
{
  RCTAssertParam(reactTag);
  
  if ((self = [super init])) {
    _eventName = [eventName copy];
    _viewTag = reactTag;
    _scrollViewContentOffset = scrollViewContentOffset;
    _scrollViewContentInset = scrollViewContentInset;
    _scrollViewContentSize = scrollViewContentSize;
    _scrollViewFrame = scrollViewFrame;
    _scrollViewZoomScale = scrollViewZoomScale;
    _userData = userData;
    _coalescingKey = coalescingKey;
  }
  return self;
}

RCT_NOT_IMPLEMENTED(- (instancetype)init)

- (uint16_t)coalescingKey
{
  return _coalescingKey;
}

- (NSDictionary *)body
{
  NSDictionary *body = @{
                         @"contentOffset": @{
                             @"x": @(_scrollViewContentOffset.x),
                             @"y": @(_scrollViewContentOffset.y)
                             },
                         @"contentInset": @{
                             @"top": @(_scrollViewContentInset.top),
                             @"left": @(_scrollViewContentInset.left),
                             @"bottom": @(_scrollViewContentInset.bottom),
                             @"right": @(_scrollViewContentInset.right)
                             },
                         @"contentSize": @{
                             @"width": @(_scrollViewContentSize.width),
                             @"height": @(_scrollViewContentSize.height)
                             },
                         @"layoutMeasurement": @{
                             @"width": @(_scrollViewFrame.size.width),
                             @"height": @(_scrollViewFrame.size.height)
                             },
                         @"zoomScale": @(_scrollViewZoomScale ?: 1),
                         };
  
  if (_userData) {
    NSMutableDictionary *mutableBody = [body mutableCopy];
    [mutableBody addEntriesFromDictionary:_userData];
    body = mutableBody;
  }
  
  return body;
}

- (BOOL)canCoalesce
{
  return YES;
}

- (RHScrollEvent *)coalesceWithEvent:(RHScrollEvent *)newEvent
{
  NSArray<NSDictionary *> *updatedChildFrames = [_userData[@"updatedChildFrames"] arrayByAddingObjectsFromArray:newEvent->_userData[@"updatedChildFrames"]];
  if (updatedChildFrames) {
    NSMutableDictionary *userData = [newEvent->_userData mutableCopy];
    userData[@"updatedChildFrames"] = updatedChildFrames;
    newEvent->_userData = userData;
  }
  
  return newEvent;
}

+ (NSString *)moduleDotMethod
{
  return @"RCTEventEmitter.receiveEvent";
}

- (NSArray *)arguments
{
  return @[self.viewTag, RCTNormalizeInputEventName(self.eventName), [self body]];
}

@end
