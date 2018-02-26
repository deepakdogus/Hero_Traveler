//
//  RHCustomScrollView.m
//  HeroTravelerMobile
//
//  Created by Andrew Beck on 2/26/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RHCustomScrollView.h"

@implementation RHCustomScrollView

- (BOOL) pointInside:(CGPoint)point withEvent:(UIEvent *)event
{
  BOOL isPointInside = NO;
  
  for (UIView* subview in self.subviews)
  {
    if (subview.userInteractionEnabled && !subview.hidden && subview.alpha > 0.01f)
    {
      CGPoint pointInView = [subview convertPoint:point fromView:self];
      isPointInside = isPointInside || [subview pointInside:pointInView withEvent:event];
    }
  }

  return isPointInside;
}

@end
