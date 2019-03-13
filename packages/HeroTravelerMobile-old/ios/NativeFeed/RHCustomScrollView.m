//
//  RHCustomScrollView.m
//  HeroTravelerMobile
//
//  Created by Andrew Beck on 2/26/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RHCustomScrollView.h"
#import <React/RCTUIManager.h>
#import "RHNativeFeed.h"

@interface RHCustomScrollView()

@end

@implementation RHCustomScrollView

- (instancetype)initWithFrame:(CGRect)frame
{
  if ((self = [super initWithFrame:frame])) {
    [self.panGestureRecognizer addTarget:self action:@selector(handleCustomPan:)];
  }
  return self;
}

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

- (BOOL)touchesShouldCancelInContentView:(__unused UIView *)view
{
  //TODO: shouldn't this call super if _shouldDisableScrollInteraction returns NO?
  return ![self _shouldDisableScrollInteraction];
}

- (void) touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
  [super touchesBegan:touches withEvent:event];
}

- (void) touchesCancelled:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
  [super touchesCancelled:touches withEvent:event];
}

- (void)touchesEnded:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
  [super touchesEnded:touches withEvent:event];
}

- (BOOL)_shouldDisableScrollInteraction
{
  // Since this may be called on every pan, we need to make sure to only climb
  // the hierarchy on rare occasions.
  UIView *JSResponder = [RCTUIManager JSResponder];
  if (JSResponder && JSResponder != self.superview) {
    BOOL superviewHasResponder = [self isDescendantOfView:JSResponder];
    return superviewHasResponder;
  }
  return NO;
}

- (void)handleCustomPan:(__unused UIPanGestureRecognizer *)sender
{
  if ([self _shouldDisableScrollInteraction] && ![[RCTUIManager JSResponder] isKindOfClass:[RHNativeFeed class]]) {
    self.panGestureRecognizer.enabled = NO;
    self.panGestureRecognizer.enabled = YES;
    // TODO: If mid bounce, animate the scroll view to a non-bounced position
    // while disabling (but only if `stopScrollInteractionIfJSHasResponder` was
    // called *during* a `pan`). Currently, it will just snap into place which
    // is not so bad either.
    // Another approach:
    // self.scrollEnabled = NO;
    // self.scrollEnabled = YES;
  }
}

@end
