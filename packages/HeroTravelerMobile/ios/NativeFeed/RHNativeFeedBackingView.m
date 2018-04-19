//
//  RHNativeFeedBackingView.m
//  HeroTravelerMobile
//
//  Created by Andrew Beck on 3/11/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RHNativeFeedBackingView.h"

@implementation RHNativeFeedBackingView
{
  NSArray* _heights;
  CGFloat _separatorHeight;
}

- (instancetype) initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame])
  {
    [self setup];
  }
  
  return self;
}

- (instancetype) init
{
  if (self = [super init])
  {
    [self setup];
  }
  
  return self;
}

- (void) setup
{
  _heights = @[];
  _separatorHeight = 0.f;
  
  _backgroundColor = [UIColor whiteColor];
  _titleColor = [UIColor colorWithWhite:0.935f alpha:1.f]; //[UIColor lightGrayColor];
  _separatorColor = [UIColor colorWithWhite:0.929411f alpha:1.f];

  _leftInset = 15.f;

  _topBarHeight = 66.f;
  _topTitleTopInset = 17.f;
  _topTitleHeight = 32.f;
  _topTitleWidth = 120.f;
  
  _bottomBarHeight = 87.f;
  _bottomTopTitleTopInset = 10.f;
  _bottomTopTitleHeight = 23.f;
  _bottomTopTitleWidth = 140.f;
  
  _bottomMiddleSpacerHeight = 15.f;
  _bottomBottomTitleHeight = 19.f;
  _bottomBottomTitleWidth = 80.f;
}

- (void) setHeights:(NSArray*)heights
{
  if (_heights.count == heights.count)
  {
    BOOL isEqual = YES;
    for (int i = 0; i < _heights.count; i++)
    {
      if ([heights[i] floatValue] != [_heights[i] floatValue])
      {
        isEqual = NO;
        break;
      }
    }

    if (isEqual)
    {
      return;
    }
  }
  
  _heights = heights;
  [self setNeedsDisplay];
}

- (void) setSeparatorHeight:(CGFloat)separatorHeight
{
  if (fabs(_separatorHeight - separatorHeight) < 1.f)
  {
    return;
  }

  _separatorHeight = separatorHeight;
  [self setNeedsDisplay];
}

+ (UIImage*) backingImageSized:(CGSize)size withSeperator:(CGFloat)separatorSize
{
  static NSMutableDictionary* imagesBySize = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    imagesBySize = [NSMutableDictionary dictionary];
  });
  
  NSString* key = [NSString stringWithFormat:@"%d_%d_%d", (int) floor(size.width), (int) floor(size.height), (int) floor(separatorSize)];
  UIImage* backingImage = [imagesBySize objectForKey:key];
  if (backingImage)
  {
    return backingImage;
  }
  
  backingImage = [RHNativeFeedBackingView makeImageForSize:size withSeperator:separatorSize];
  [imagesBySize setObject:backingImage forKey:key];
  return backingImage;
}

+ (UIImage*) makeImageForSize:(CGSize)size withSeperator:(CGFloat)separatorSize
{
  CGSize fullSize = CGSizeMake(size.width, size.height+separatorSize);
  
  UIGraphicsBeginImageContextWithOptions(fullSize, NO, [UIScreen mainScreen].scale);
  
  UIColor* _backgroundColor = [UIColor whiteColor];
  UIColor* _titleColor = [UIColor colorWithWhite:0.935f alpha:1.f]; //[UIColor lightGrayColor];
  UIColor* _separatorColor = [UIColor colorWithWhite:0.929411f alpha:1.f];
  
  CGFloat _leftInset = 15.f;
  
  CGFloat _topBarHeight = 66.f;
  CGFloat _topTitleTopInset = 17.f;
  CGFloat _topTitleHeight = 32.f;
  CGFloat _topTitleWidth = 120.f;
  
  CGFloat _bottomBarHeight = 87.f;
  CGFloat _bottomTopTitleTopInset = 10.f;
  CGFloat _bottomTopTitleHeight = 23.f;
  CGFloat _bottomTopTitleWidth = 140.f;
  
  CGFloat _bottomMiddleSpacerHeight = 15.f;
  CGFloat _bottomBottomTitleHeight = 19.f;
  CGFloat _bottomBottomTitleWidth = 80.f;
  
  CGRect rect = CGRectMake(0, 0, size.width, size.height);

  CGContextRef context = UIGraphicsGetCurrentContext();

  [_backgroundColor setFill];
  CGContextFillRect(context, rect);
  
  [_titleColor setFill];
  CGRect middleViewRect = CGRectMake(rect.origin.x,
                                     rect.origin.y+_topBarHeight,
                                     rect.size.width,
                                     rect.size.height-_topBarHeight-_bottomBarHeight);
  CGContextFillRect(context, middleViewRect);
  
  CGRect topTitleRect = CGRectMake(rect.origin.x+_leftInset,
                                   rect.origin.y+_topTitleTopInset,
                                   _topTitleWidth,
                                   _topTitleHeight);
  CGContextFillRect(context, topTitleRect);
  
  CGFloat topOfBottomBar = rect.origin.y+rect.size.height-_bottomBarHeight;
  
  CGRect bottomTopTitleRect = CGRectMake(rect.origin.x+_leftInset,
                                         topOfBottomBar+_bottomTopTitleTopInset,
                                         _bottomTopTitleWidth,
                                         _bottomTopTitleHeight);
  CGContextFillRect(context, bottomTopTitleRect);
  
  CGRect bottomBottomTitleRect = CGRectMake(rect.origin.x+_leftInset,
                                            topOfBottomBar+_bottomTopTitleTopInset+_bottomTopTitleHeight+_bottomMiddleSpacerHeight,
                                            _bottomBottomTitleWidth,
                                            _bottomBottomTitleHeight);
  CGContextFillRect(context, bottomBottomTitleRect);
  
  CGRect sepeatorRect = CGRectMake(rect.origin.x,
                                   rect.origin.y + size.height,
                                   size.width,
                                   separatorSize);
  [_separatorColor setFill];
  CGContextFillRect(context, sepeatorRect);

  UIImage* ret = UIGraphicsGetImageFromCurrentImageContext();  // UIImage returned.
  UIGraphicsEndImageContext();
  return ret;
}

- (void) drawRect:(CGRect)rect
{
  [_separatorColor setFill];
  [[UIBezierPath bezierPathWithRect:rect] fill];

  CGFloat yOffset = 0.f;

  for (NSNumber* cellHeightObj in _heights)
  {
    CGFloat cellHeight = [cellHeightObj floatValue];

    CGRect cellRect = CGRectMake(rect.origin.x,
                                 rect.origin.y+yOffset,
                                 rect.size.width,
                                 cellHeight);
    [self drawCellTemplate:cellRect];

    yOffset += cellHeight + _separatorHeight;
  }
}

- (void) drawCellTemplate:(CGRect)rect
{
  CGContextRef context = UIGraphicsGetCurrentContext();
  
  [_backgroundColor setFill];
  CGContextFillRect(context, rect);
  
  [_titleColor setFill];
  CGRect middleViewRect = CGRectMake(rect.origin.x,
                                     rect.origin.y+_topBarHeight,
                                     rect.size.width,
                                     rect.size.height-_topBarHeight-_bottomBarHeight);
  CGContextFillRect(context, middleViewRect);
  
  CGRect topTitleRect = CGRectMake(rect.origin.x+_leftInset,
                                   rect.origin.y+_topTitleTopInset,
                                   _topTitleWidth,
                                   _topTitleHeight);
  CGContextFillRect(context, topTitleRect);
  
  CGFloat topOfBottomBar = rect.origin.y+rect.size.height-_bottomBarHeight;
  
  CGRect bottomTopTitleRect = CGRectMake(rect.origin.x+_leftInset,
                                         topOfBottomBar+_bottomTopTitleTopInset,
                                         _bottomTopTitleWidth,
                                         _bottomTopTitleHeight);
  CGContextFillRect(context, bottomTopTitleRect);
  
  CGRect bottomBottomTitleRect = CGRectMake(rect.origin.x+_leftInset,
                                            topOfBottomBar+_bottomTopTitleTopInset+_bottomTopTitleHeight+_bottomMiddleSpacerHeight,
                                            _bottomBottomTitleWidth,
                                            _bottomBottomTitleHeight);
  CGContextFillRect(context, bottomBottomTitleRect);
}

@end
