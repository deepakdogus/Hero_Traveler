//
//  RNDJDraftJSEditor.m
//  RNDraftJs
//
//  Created by Andrew Beck on 10/22/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "RNDJDraftJSEditor.h"

#import <MobileCoreServices/UTCoreTypes.h>

#import <React/RCTUtils.h>
#import <React/UIView+React.h>

#import "RNDJShadowDraftJSEditor.h"
#import "RNDJDraftJsIndex.h"

#import <IQKeyboardManager/IQKeyboardManager.h>

static void collectNonTextDescendants(RNDJDraftJSEditor *view, NSMutableArray *nonTextDescendants)
{
  for (UIView *child in view.reactSubviews) {
    if ([child isKindOfClass:[RNDJDraftJSEditor class]]) {
      collectNonTextDescendants((RNDJDraftJSEditor *)child, nonTextDescendants);
    } else if (!CGRectEqualToRect(child.frame, CGRectZero)) {
      [nonTextDescendants addObject:child];
    }
  }
}

@implementation RNDJDraftJSEditor
{
  NSTextStorage *_textStorage;
  CAShapeLayer *_highlightLayer;
  UILongPressGestureRecognizer *_longPressGestureRecognizer;

#if DEBUG_TOUCHES
  UIView* debugTouchesView;
  UILabel* positionLabel;

  NSLayoutConstraint* debugTouchesToTop;
  NSLayoutConstraint* debugTouchesToLeft;
#endif
  
  BOOL wasInView;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if ((self = [super initWithFrame:frame])) {
    _textStorage = [NSTextStorage new];
    self.isAccessibilityElement = YES;
    self.accessibilityTraits |= UIAccessibilityTraitStaticText;
    
    self.opaque = NO;
    self.contentMode = UIViewContentModeRedraw;
    
    self.autocapitalizationType = UITextAutocapitalizationTypeNone;
    self.autocorrectionType = UITextAutocorrectionTypeNo;
    self.spellCheckingType = UITextSpellCheckingTypeNo;
    
    UITapGestureRecognizer* tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tap:)];
    [self addGestureRecognizer:tapGesture];
    
    UILongPressGestureRecognizer* longPressGesture = [[UILongPressGestureRecognizer alloc] initWithTarget:self action:@selector(handleLongPress:)];
    [self addGestureRecognizer:longPressGesture];
    
//    UIPanGestureRecognizer* panGesture = [[UIPanGestureRecognizer alloc] initWithTarget:self action:@selector(pan:)];
//    [self addGestureRecognizer:panGesture];
//    [longPressGesture requireGestureRecognizerToFail:tapGesture];
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardWillShow:) name:UIKeyboardWillShowNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardDidShow:) name:UIKeyboardDidShowNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardWillHide:) name:UIKeyboardWillHideNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardDidHide:) name:UIKeyboardDidHideNotification object:nil];

#if DEBUG_TOUCHES
    debugTouchesView = [UIView new];
    debugTouchesView.backgroundColor = [UIColor redColor];
    debugTouchesView.translatesAutoresizingMaskIntoConstraints = NO;
    [self addSubview:debugTouchesView];
    
    debugTouchesToTop = [NSLayoutConstraint constraintWithItem:debugTouchesView
                                                     attribute:NSLayoutAttributeTop
                                                     relatedBy:NSLayoutRelationEqual
                                                        toItem:self
                                                     attribute:NSLayoutAttributeTop multiplier:1 constant:0];

    debugTouchesToLeft = [NSLayoutConstraint constraintWithItem:debugTouchesView
                                                     attribute:NSLayoutAttributeLeft
                                                     relatedBy:NSLayoutRelationEqual
                                                        toItem:self
                                                     attribute:NSLayoutAttributeLeft multiplier:1 constant:0];

    [self addConstraint:debugTouchesToTop];
    [self addConstraint:debugTouchesToLeft];
    [debugTouchesView addConstraint:[NSLayoutConstraint constraintWithItem:debugTouchesView
                                                                 attribute:NSLayoutAttributeHeight
                                                                 relatedBy:NSLayoutRelationEqual
                                                                    toItem:nil
                                                                 attribute:NSLayoutAttributeNotAnAttribute multiplier:1 constant:2]];
    [debugTouchesView addConstraint:[NSLayoutConstraint constraintWithItem:debugTouchesView
                                                                 attribute:NSLayoutAttributeWidth
                                                                 relatedBy:NSLayoutRelationEqual
                                                                    toItem:nil
                                                                 attribute:NSLayoutAttributeNotAnAttribute multiplier:1 constant:2]];
    
    positionLabel = [UILabel new];
    positionLabel.translatesAutoresizingMaskIntoConstraints = NO;
    [self addSubview:positionLabel];
    
    [self addConstraint:[NSLayoutConstraint constraintWithItem:positionLabel
                                                     attribute:NSLayoutAttributeBottom
                                                     relatedBy:NSLayoutRelationEqual
                                                        toItem:debugTouchesView
                                                     attribute:NSLayoutAttributeTop
                                                    multiplier:1 constant:0]];
    [self addConstraint:[NSLayoutConstraint constraintWithItem:positionLabel
                                                     attribute:NSLayoutAttributeCenterX
                                                     relatedBy:NSLayoutRelationEqual
                                                        toItem:debugTouchesView
                                                     attribute:NSLayoutAttributeCenterX multiplier:1 constant:0]];

#endif

  }
  return self;
}

- (void) didMoveToSuperview
{
  [super didMoveToSuperview];
  
  static int numEditorsOpen = 0;
  
  if (wasInView && [self superview] == nil) {
    numEditorsOpen--;

    if (numEditorsOpen <= 0) {
      [IQKeyboardManager sharedManager].enable = YES;
      numEditorsOpen = 0;
    }
    wasInView = NO;
  } else if (!wasInView && [self superview] != nil) {
    if (numEditorsOpen <= 0) {
      [IQKeyboardManager sharedManager].enable = NO;
      numEditorsOpen = 1;
    } else {
      numEditorsOpen++;
    }
    wasInView = YES;
  }
}

- (void) dealloc
{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (UIView*) getViewJustInsideScrollViewFor:(UIView*)view
{
  UIView* superview = [view superview];
  
  if (!superview) {
    return nil;
  }
  
  if ([superview isKindOfClass:[UIScrollView class]]) {
    return view;
  }
  
  return [self getViewJustInsideScrollViewFor:superview];
}

- (void) scrollToCursorIfNeeded
{
  if (!_hasFocus) {
    return;
  }

  UIView* view = [self getViewJustInsideScrollViewFor:self];
  if (!view) {
    return;
  }
  
  UIScrollView* scrollView = (UIScrollView*) [view superview];
  if (![scrollView isKindOfClass:[UIScrollView class]]) {
    NSLog(@"Something wrong with the scroll view finding logic...");
    return;
  }

  NSLayoutManager *layoutManager = [_textStorage.layoutManagers firstObject];
  NSTextContainer *textContainer = [layoutManager.textContainers firstObject];
  NSRange glyphRange = [layoutManager glyphRangeForTextContainer:textContainer];
  NSRange characterRange = [layoutManager characterRangeForGlyphRange:glyphRange actualGlyphRange:NULL];

  __block BOOL didFind = false;
  
  [layoutManager.textStorage enumerateAttribute:RNDJSingleCursorPositionAttributeName inRange:characterRange options:0 usingBlock:^(NSNumber *value, NSRange range, BOOL *_) {
    if (!value.boolValue) {
      return;
    }
    
    [layoutManager enumerateEnclosingRectsForGlyphRange:range withinSelectedGlyphRange:range inTextContainer:textContainer usingBlock:^(CGRect enclosingRect, __unused BOOL *__) {
      
      if (didFind) {
        NSLog(@"Somehow found two things that match!");
        return;
      }
      CGRect cursorRect = CGRectMake(
                                     enclosingRect.origin.x + _contentInset.left,
                                     enclosingRect.origin.y + _contentInset.top - 30,
                                     2,
                                     enclosingRect.size.height + _contentInset.top + _contentInset.bottom - 60);
      
      CGRect cursorInScrollView = [view convertRect:cursorRect fromView:self];
      CGFloat cursorInScrollViewBottom = cursorInScrollView.origin.y + cursorInScrollView.size.height;
      
      CGFloat scrollViewHeight = scrollView.bounds.size.height - 182 - 50 - 80;

      CGFloat currentYOffset = scrollView.contentOffset.y + 80;
      CGFloat currentYMax = currentYOffset + scrollViewHeight;
      
      if (cursorInScrollView.origin.y < currentYOffset) {
        [scrollView setContentOffset:CGPointMake(0, cursorInScrollView.origin.y - 80) animated:YES];
      } else if (cursorInScrollViewBottom > currentYMax) {
        [scrollView setContentOffset:CGPointMake(0, cursorInScrollViewBottom - scrollViewHeight) animated:YES];
      }

      didFind = true;
    }];
  }];
}

- (void)keyboardWillShow:(NSNotification*)aNotification
{
  
}

- (void)keyboardDidShow:(NSNotification*)aNotification
{
  [self scrollToCursorIfNeeded];
}

- (void)keyboardWillHide:(NSNotification*)aNotification
{
  
}

- (void)keyboardDidHide:(NSNotification*)aNotification
{
  
}

- (RNDJDraftJsIndex*) draftJsIndexForPointInView:(CGPoint)point
{
  point.y -= _contentInset.top;
  point.x -= _contentInset.left;
  
#if DEBUG_TOUCHES
  debugTouchesToLeft.constant = point.x;
  debugTouchesToTop.constant = point.y;
#endif

  CGFloat fraction;
  NSLayoutManager *layoutManager = _textStorage.layoutManagers.firstObject;
  NSTextContainer *textContainer = layoutManager.textContainers.firstObject;
  NSUInteger characterIndex = [layoutManager characterIndexForPoint:point
                                                    inTextContainer:textContainer
                           fractionOfDistanceBetweenInsertionPoints:&fraction];

  // If the point is not before (fraction == 0.0) the first character and not
  // after (fraction == 1.0) the last character, then the attribute is valid.
  characterIndex = MIN(_textStorage.length, characterIndex);
  characterIndex = MAX(0, characterIndex);

  RNDJDraftJsIndex* closestDraftJsIndex = _textStorage.length > 0 ? [_textStorage attribute:RNDJDraftJsIndexAttributeName atIndex:characterIndex effectiveRange:NULL] : nil;;

#if DEBUG_TOUCHES
  if (closestDraftJsIndex) {
    positionLabel.text = [NSString stringWithFormat:@"%@: %@", closestDraftJsIndex.key, @(closestDraftJsIndex.offset)];
  } else {
    positionLabel.text = @"x";
  }
#endif

  return closestDraftJsIndex;
}

- (void) tap:(UIGestureRecognizer*)gesture
{
  CGPoint tapPostion = [gesture locationInView:self];
//  tapPostion.x -= _contentInset.left;
//  tapPostion.y -= _contentInset.top;
  
  if (!_hasFocus) {
    _hasFocus = YES;
    [self becomeFirstResponder];

    switch (gesture.state) {
      case UIGestureRecognizerStateRecognized:
      {
        RNDJDraftJsIndex* selectedIndex = [self draftJsIndexForPointInView:tapPostion];
        if (selectedIndex) {
          [self requestSetSelection:selectedIndex];
        } else {
          [self requestHasFocus:YES];
        }
      }
      default:
        break;
    }
  } else {
    RNDJDraftJsIndex* selectedIndex = [self draftJsIndexForPointInView:tapPostion];
    [self requestSetSelection:selectedIndex];
  }
}

- (void)pan:(UILongPressGestureRecognizer *)gesture
{
  CGPoint tapPostion = [gesture locationInView:self];
//  tapPostion.x -= _contentInset.left;
//  tapPostion.y -= _contentInset.top;
  
  if (_hasFocus) {
    RNDJDraftJsIndex* selectedIndex = [self draftJsIndexForPointInView:tapPostion];
    [self requestSetSelection:selectedIndex];
  }
}

- (void)handleLongPress:(UILongPressGestureRecognizer *)gesture
{
  CGPoint tapPostion = [gesture locationInView:self];
//  tapPostion.x -= _contentInset.left;
//  tapPostion.y -= _contentInset.top;

  if (_hasFocus) {
    RNDJDraftJsIndex* selectedIndex = [self draftJsIndexForPointInView:tapPostion];
    [self requestSetSelection:selectedIndex];
  }
  
  //  if (self.isFirstResponder) {
  //
  //  } else {
  //#if !TARGET_OS_TV
  //    UIMenuController *menuController = [UIMenuController sharedMenuController];
  //
  //    if (menuController.isMenuVisible) {
  //      return;
  //    }
  //
  //    if (!self.isFirstResponder) {
  //      [self becomeFirstResponder];
  //    }
  //
  //    [menuController setTargetRect:self.bounds inView:self];
  //    [menuController setMenuVisible:YES animated:YES];
  //#endif
  //  }
}

- (NSString *)description
{
  NSString *superDescription = super.description;
  NSRange semicolonRange = [superDescription rangeOfString:@";"];
  NSString *replacement = [NSString stringWithFormat:@"; reactTag: %@; text: %@", self.reactTag, self.textStorage.string];
  return [superDescription stringByReplacingCharactersInRange:semicolonRange withString:replacement];
}

- (void)setSelectable:(BOOL)selectable
{
  if (_selectable == selectable) {
    return;
  }
  
  _selectable = selectable;
}

- (void)reactSetFrame:(CGRect)frame
{
  // Text looks super weird if its frame is animated.
  // This disables the frame animation, without affecting opacity, etc.
  [UIView performWithoutAnimation:^{
    [super reactSetFrame:frame];
  }];
}

- (void)reactSetInheritedBackgroundColor:(UIColor *)inheritedBackgroundColor
{
  self.backgroundColor = inheritedBackgroundColor;
}

- (void)didUpdateReactSubviews
{
  // Do nothing, as subviews are managed by `setTextStorage:` method
}

- (void)setTextStorage:(NSTextStorage *)textStorage
{
  if (_textStorage != textStorage) {
    _textStorage = textStorage;
    
    // Update subviews
    NSMutableArray *nonTextDescendants = [NSMutableArray new];
    collectNonTextDescendants(self, nonTextDescendants);
    NSArray *subviews = self.subviews;
    if (![subviews isEqualToArray:nonTextDescendants]) {
      for (UIView *child in subviews) {
#if DEBUG_TOUCHES
        if (child != positionLabel && child != debugTouchesView && ![nonTextDescendants containsObject:child]) {
#else
        if (![nonTextDescendants containsObject:child]) {
#endif
          [child removeFromSuperview];
        }
      }
      for (UIView *child in nonTextDescendants) {
        [self addSubview:child];
      }
    }
    
    [self setNeedsDisplay];
  }
}

- (void)drawRect:(CGRect)rect
{
  NSLayoutManager *layoutManager = [_textStorage.layoutManagers firstObject];
  NSTextContainer *textContainer = [layoutManager.textContainers firstObject];
  
  NSRange glyphRange = [layoutManager glyphRangeForTextContainer:textContainer];
  CGRect textFrame = self.textFrame;
  [layoutManager drawBackgroundForGlyphRange:glyphRange atPoint:textFrame.origin];
  [layoutManager drawGlyphsForGlyphRange:glyphRange atPoint:textFrame.origin];
  
  __block UIBezierPath *highlightPath = nil;
  NSRange characterRange = [layoutManager characterRangeForGlyphRange:glyphRange actualGlyphRange:NULL];
  [layoutManager.textStorage enumerateAttribute:RCTIsHighlightedAttributeName inRange:characterRange options:0 usingBlock:^(NSNumber *value, NSRange range, BOOL *_) {
    if (!value.boolValue) {
      return;
    }
    
    [layoutManager enumerateEnclosingRectsForGlyphRange:range withinSelectedGlyphRange:range inTextContainer:textContainer usingBlock:^(CGRect enclosingRect, __unused BOOL *__) {
      UIBezierPath *path = [UIBezierPath bezierPathWithRoundedRect:CGRectInset(enclosingRect, -2, -2) cornerRadius:2];
      if (highlightPath) {
        [highlightPath appendPath:path];
      } else {
        highlightPath = path;
      }
    }];
  }];
  
  [layoutManager.textStorage enumerateAttribute:RNDJSingleCursorPositionAttributeName inRange:characterRange options:0 usingBlock:^(NSNumber *value, NSRange range, BOOL *_) {
    if (!value.boolValue) {
      return;
    }
    
    [layoutManager enumerateEnclosingRectsForGlyphRange:range withinSelectedGlyphRange:range inTextContainer:textContainer usingBlock:^(CGRect enclosingRect, __unused BOOL *__) {
      
      CGRect cursorRect = CGRectMake(enclosingRect.origin.x, enclosingRect.origin.y, 2, enclosingRect.size.height);

      if (fabs(_lastCursorRect.origin.x - cursorRect.origin.x) > 1 || fabs(_lastCursorRect.origin.y - cursorRect.origin.y) > 1) {
        [self scrollToCursorIfNeeded];
      }
      _lastCursorRect = cursorRect;
      
      UIBezierPath *path = [UIBezierPath bezierPathWithRoundedRect:cursorRect
                                                      cornerRadius:1];
      if (highlightPath) {
        [highlightPath appendPath:path];
      } else {
        highlightPath = path;
      }
    }];
  }];

  CGFloat selectionOpacity = isnan(_selectionOpacity) ? 0.25 : _selectionOpacity;

  UIColor* selectionColor = [UIColor colorWithWhite:0 alpha:selectionOpacity];
  if (_selectionColor) {
    selectionColor = [_selectionColor colorWithAlphaComponent:CGColorGetAlpha(_selectionColor.CGColor) * selectionOpacity];
  }
  
  if (highlightPath) {
    if (!_highlightLayer) {
      _highlightLayer = [CAShapeLayer layer];
      _highlightLayer.fillColor = selectionColor.CGColor;
      [self.layer addSublayer:_highlightLayer];
    }
    _highlightLayer.position = (CGPoint){_contentInset.left, _contentInset.top};
    _highlightLayer.path = highlightPath.CGPath;
  } else {
    [_highlightLayer removeFromSuperlayer];
    _highlightLayer = nil;
  }
}

- (NSNumber *)reactTagAtPoint:(CGPoint)point
{
  NSNumber *reactTag = self.reactTag;
  
  CGFloat fraction;
  NSLayoutManager *layoutManager = _textStorage.layoutManagers.firstObject;
  NSTextContainer *textContainer = layoutManager.textContainers.firstObject;
  NSUInteger characterIndex = [layoutManager characterIndexForPoint:point
                                                    inTextContainer:textContainer
                           fractionOfDistanceBetweenInsertionPoints:&fraction];
  
  // If the point is not before (fraction == 0.0) the first character and not
  // after (fraction == 1.0) the last character, then the attribute is valid.
  if (_textStorage.length > 0 && (fraction > 0 || characterIndex > 0) && (fraction < 1 || characterIndex < _textStorage.length - 1)) {
    reactTag = [_textStorage attribute:RCTReactTagAttributeName atIndex:characterIndex effectiveRange:NULL];
  }
  return reactTag;
}

- (void)didMoveToWindow
{
  [super didMoveToWindow];
  
  if (!self.window) {
    self.layer.contents = nil;
    if (_highlightLayer) {
      [_highlightLayer removeFromSuperlayer];
      _highlightLayer = nil;
    }
  } else if (_textStorage.length) {
    [self setNeedsDisplay];
  }
}


#pragma mark - Accessibility

- (NSString *)accessibilityLabel
{
  return _textStorage.string;
}

#pragma mark - Context Menu

- (BOOL)canBecomeFirstResponder
{
  return _hasFocus;
}

- (void) requestHasFocus:(BOOL)hasFocus
{
  RCTDirectEventBlock onSelectionChangeRequest = _onSelectionChangeRequest;
  if (onSelectionChangeRequest) {
    onSelectionChangeRequest(@{@"hasFocus": @(hasFocus)});
  }
}

- (void) requestSetSelection:(RNDJDraftJsIndex*)index
{
  NSString* blockKey = _lastIndex.key;
  NSUInteger offset = _lastIndex.offset;
  
  if (index) {
    blockKey = index.key;
    offset = index.offset;
  }
  
  if (blockKey.length > 0) {
    RCTDirectEventBlock onSelectionChangeRequest = _onSelectionChangeRequest;
    if (onSelectionChangeRequest) {
      onSelectionChangeRequest(@{
                                 @"startKey": blockKey,
                                 @"startOffset": @(offset),
                                 @"endKey": blockKey,
                                 @"endOffset": @(offset),
                                 @"hasFocus": @YES,
                                 });
    }
  }
}

- (BOOL)becomeFirstResponder
{
  if (!_hasFocus) {
    return NO;
  }
  
  return [super becomeFirstResponder];
}

- (BOOL)resignFirstResponder
{
  BOOL result = [super resignFirstResponder];
  
  if (!_hasFocus) {
    return result;
  }
  [self requestHasFocus:NO];
  return result;
}

- (void) setHasFocus:(BOOL)hasFocus {
  _hasFocus = hasFocus;
  
  if (hasFocus && !self.isFirstResponder) {
    if (![self becomeFirstResponder]) {
      [self requestHasFocus:NO];
    }
  } else if (!hasFocus && self.isFirstResponder) {
    if (![self resignFirstResponder]) {
      [self requestHasFocus:YES];
    }
  }
}

- (BOOL)canPerformAction:(SEL)action withSender:(id)sender
{
  if (action == @selector(copy:)) {
    return YES;
  }
  
  return [super canPerformAction:action withSender:sender];
}

- (void)copy:(id)sender
{
#if !TARGET_OS_TV
  NSAttributedString *attributedString = _textStorage;
  
  NSMutableDictionary *item = [NSMutableDictionary new];
  
  NSData *rtf = [attributedString dataFromRange:NSMakeRange(0, attributedString.length)
                             documentAttributes:@{NSDocumentTypeDocumentAttribute: NSRTFDTextDocumentType}
                                          error:nil];
  
  if (rtf) {
    [item setObject:rtf forKey:(id)kUTTypeFlatRTFD];
  }
  
  [item setObject:attributedString.string forKey:(id)kUTTypeUTF8PlainText];
  
  UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
  pasteboard.items = @[item];
#endif
}

- (BOOL)hasText
{
  return _textStorage.length > 0;
}

- (void)insertText:(NSString *)text
{
  RCTDirectEventBlock onInsertTextRequest = self.onInsertTextRequest;
  RCTDirectEventBlock onNewlineRequest = self.onNewlineRequest;

  NSArray* textComponents = [text componentsSeparatedByString:@"\n"];
  NSUInteger numComponents = textComponents.count;
  for (int i=0; i<numComponents; i++) {
    NSString* textComponent = textComponents[i];
    
    if (textComponent.length > 0) {
      if (onInsertTextRequest)
      {
        onInsertTextRequest(@{@"text": textComponent});
      }
    }
    
    if (i < numComponents-1) {
      if (onNewlineRequest) {
        onNewlineRequest(@{});
      }
    }
  }
}

- (void)deleteBackward
{
  RCTDirectEventBlock onBackspaceRequest = self.onBackspaceRequest;
  if (onBackspaceRequest)
  {
    onBackspaceRequest(@{});
	}
}

@end

