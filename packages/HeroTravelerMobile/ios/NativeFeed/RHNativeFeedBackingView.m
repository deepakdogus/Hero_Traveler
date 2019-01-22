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
  
  _backgroundColor = [UIColor redColor];
  _titleColor = [UIColor orangeColor]; //[UIColor lightGrayColor];
  _separatorColor = [UIColor greenColor];

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
  
  UIColor* _backgroundColor = [UIColor redColor];
  UIColor* _itemCellImageColor = [UIColor greenColor];
  UIColor* _itemTitleViewImageColor = [UIColor blueColor];
  UIColor* _titlesColor = [UIColor whiteColor];

  CGFloat _itemTopInset = 20.f;
  CGFloat _itemSideInsets = 13.5f;
  CGFloat _itemCornerRadius = 5.f;
  
  CGFloat _bottomTitleBackingSize = 146.5f;
  
  CGFloat _locationTitleTopInset = 15.f;
  CGFloat _locationTitleLeftInset = 15.f;
  CGFloat _locationTitleWidth = 150.f;
  CGFloat _locationTitleHeight = 15.f;
  
  CGFloat _postTitleTopInset = 40.f;
  CGFloat _postTitleLeftInset = 15.f;
  CGFloat _postTitleWidth = 200.f;
  CGFloat _postTitleHeight = 40.f;
  
  CGFloat _profileCircleTopInset = 109.5f;
  CGFloat _profileCircleLeftInset = 15.f;
  CGFloat _profileCircleSize = 32.f;
  
  CGFloat _profileNameTopInset = 109.5f;
  CGFloat _profileNameLeftInset = 62.f;
  CGFloat _profileNameWidth = 75.f;
  CGFloat _profileNameHeight = 14.f;

  CGRect rect = CGRectMake(0, 0, size.width, size.height);
  
  CGContextRef context = UIGraphicsGetCurrentContext();

  [_backgroundColor setFill];
  CGContextFillRect(context, rect);

  [_itemCellImageColor setFill];
  CGRect itemCellRect = CGRectMake(rect.origin.x + _itemSideInsets,
                                   rect.origin.y + _itemTopInset,
                                   rect.size.width - (_itemSideInsets * 2.f),
                                   rect.size.height - _itemTopInset);

  UIBezierPath* path = [UIBezierPath bezierPathWithRoundedRect:itemCellRect cornerRadius:_itemCornerRadius];
  CGContextAddPath(context, path.CGPath);
  CGContextFillPath(context);
  CGContextClosePath(context);
  

  [_itemTitleViewImageColor setFill];
  CGRect titleCellRect = CGRectMake(itemCellRect.origin.x,
                                     itemCellRect.origin.y + itemCellRect.size.height - _bottomTitleBackingSize,
                                     itemCellRect.size.width,
                                     _bottomTitleBackingSize);
  CGContextFillRect(context, titleCellRect);
//  UIBezierPath* path2 = [UIBezierPath bezierPathWithRoundedRect:itemCellRect cornerRadius:_itemCornerRadius];
//  CGContextAddPath(context, path2.CGPath);
//  CGContextFillPath(context);
//  CGContextClosePath(context);
//
//  CGRect cornerCoverRect = CGRectMake(titleCellRect.origin.x,
//                                      titleCellRect.origin.y - 20.f,
//                                      titleCellRect.size.width,
//                                      40.f);
//  [_itemCellImageColor setFill];
//  CGContextFillRect(context, cornerCoverRect);
  
  [_titlesColor setFill];
  
  CGRect locationRect = CGRectMake(titleCellRect.origin.x + _locationTitleLeftInset,
                                   titleCellRect.origin.y + _locationTitleTopInset,
                                   _locationTitleWidth,
                                   _locationTitleHeight);
  CGContextFillRect(context, locationRect);

  CGRect postTitleRect = CGRectMake(titleCellRect.origin.x + _postTitleLeftInset,
                                   titleCellRect.origin.y + _postTitleTopInset,
                                   _postTitleWidth,
                                   _postTitleHeight);
  CGContextFillRect(context, postTitleRect);

  CGRect profileNameRect = CGRectMake(titleCellRect.origin.x + _profileNameLeftInset,
                                    titleCellRect.origin.y + _profileNameTopInset,
                                    _profileNameWidth,
                                    _profileNameHeight);
  CGContextFillRect(context, profileNameRect);

  CGRect profileCircleRect = CGRectMake(titleCellRect.origin.x + _profileCircleLeftInset,
                                      titleCellRect.origin.y + _profileCircleTopInset,
                                      _profileCircleSize,
                                      _profileCircleSize);
  CGContextFillEllipseInRect(context, profileCircleRect);

  UIImage* ret = UIGraphicsGetImageFromCurrentImageContext();  // UIImage returned.
  UIGraphicsEndImageContext();
  return ret;
}


@end
