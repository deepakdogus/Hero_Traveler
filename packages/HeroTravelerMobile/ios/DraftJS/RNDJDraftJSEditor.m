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

#import "IQKeyboardManager.h"

#import "ACMagnifyingGlass.h"

CGFloat selectNibSize = 8.f;
NSString* terminalPunctionationString = @".?!";

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

#define MAGNIFYING_GLASS_SHOW_DELAY 0.5

typedef enum AutoPeriodState {
  AutoPeriodStateNotReady,
  AutoPeriodStateEnteredCharacter,
  AutoPeriodStateEnteredFirstPeriod,
} AutoPeriodState;

@implementation RNDJDraftJSEditor
{
  NSTextStorage* _textStorage;
  CAShapeLayer* _highlightLayer;
  CAShapeLayer* _singleCursorLayer;
  CAShapeLayer* _autocompleteLayer;
  CAShapeLayer* _endDragLayer;
  CAShapeLayer* _startDragLayer;
  
  UIView* startDragView;
  UIView* endDragView;
  
  BOOL isDraggingRange;

  UILongPressGestureRecognizer* _longPressGestureRecognizer;

#if DEBUG_TOUCHES
  UIView* debugTouchesView;
  UILabel* positionLabel;

  NSLayoutConstraint* debugTouchesToTop;
  NSLayoutConstraint* debugTouchesToLeft;
#endif
  
  BOOL wasInView;
  BOOL shouldShowAutocomplete;
  
  ACMagnifyingGlass *magnifyingGlass;
  NSTimer *touchTimer;
  
  int magnifyingGlassRetainCount;
  
  NSDictionary* existingAutocompleteViews;
  
  NSSet* closedAutocorrects;
  
  BOOL isReadyToCapitalize;
  AutoPeriodState periodEnterState;
  CGRect _contentFrame;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if ((self = [super initWithFrame:frame])) {
    _textStorage = [NSTextStorage new];
    self.isAccessibilityElement = YES;
    self.accessibilityTraits |= UIAccessibilityTraitStaticText;
    
    periodEnterState = AutoPeriodStateNotReady;
    
    self.opaque = NO;
    self.contentMode = UIViewContentModeRedraw;
    
    self.autocapitalizationType = UITextAutocapitalizationTypeNone;
    self.autocorrectionType = UITextAutocorrectionTypeNo;
    self.spellCheckingType = UITextSpellCheckingTypeNo;
    
    existingAutocompleteViews = @{};
    
    startDragView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 0, 0)];
    startDragView.backgroundColor = [UIColor clearColor];
    startDragView.userInteractionEnabled = YES;
    [self addSubview:startDragView];
    endDragView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 0, 0)];
    endDragView.backgroundColor = [UIColor clearColor];
    endDragView.userInteractionEnabled = YES;
    [self addSubview:endDragView];
    
    UIPanGestureRecognizer* startPanGesture = [[UIPanGestureRecognizer alloc] initWithTarget:self action:@selector(dragStart:)];
    [startDragView addGestureRecognizer:startPanGesture];

    UIPanGestureRecognizer* endPanGesture = [[UIPanGestureRecognizer alloc] initWithTarget:self action:@selector(dragEnd:)];
    [endDragView addGestureRecognizer:endPanGesture];

    UITapGestureRecognizer* quadrupleTapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(quadrupleTap:)];
    quadrupleTapGesture.numberOfTapsRequired = 4;
    [self addGestureRecognizer:quadrupleTapGesture];

    UITapGestureRecognizer* tripleTapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tripleTap:)];
    tripleTapGesture.numberOfTapsRequired = 3;
    [tripleTapGesture requireGestureRecognizerToFail:quadrupleTapGesture];
    [self addGestureRecognizer:tripleTapGesture];

    UITapGestureRecognizer* doubleTapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(doubleTap:)];
    doubleTapGesture.numberOfTapsRequired = 2;
    [doubleTapGesture requireGestureRecognizerToFail:quadrupleTapGesture];
    [doubleTapGesture requireGestureRecognizerToFail:tripleTapGesture];
    [self addGestureRecognizer:doubleTapGesture];

    UITapGestureRecognizer* tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tap:)];
    tapGesture.numberOfTapsRequired = 1;
    [tapGesture requireGestureRecognizerToFail:quadrupleTapGesture];
    [tapGesture requireGestureRecognizerToFail:tripleTapGesture];
    [tapGesture requireGestureRecognizerToFail:doubleTapGesture];
    [self addGestureRecognizer:tapGesture];
    
    UILongPressGestureRecognizer* longPressGesture = [[UILongPressGestureRecognizer alloc] initWithTarget:self action:@selector(handleLongPress:)];
    [self addGestureRecognizer:longPressGesture];
    
    closedAutocorrects = [NSSet set];
    
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
    
    self.backgroundColor = [UIColor whiteColor];

    magnifyingGlass = [[ACMagnifyingGlass alloc] init];
    magnifyingGlass.viewToMagnify = self;

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

- (void) cancelAutocorrect:(NSString*)autocorrectKey
{
  NSMutableSet* mutableClosedAutocorrects = [NSMutableSet setWithSet:closedAutocorrects];
  [mutableClosedAutocorrects addObject:autocorrectKey];
  closedAutocorrects = [NSSet setWithSet:mutableClosedAutocorrects];
  [self setNeedsDisplay];
}

- (void) updateAutocompletes:(NSArray*)autocompletes
{
  NSMutableDictionary* oldAutocompleteViews = [NSMutableDictionary dictionaryWithDictionary:existingAutocompleteViews];
  
  NSMutableDictionary* newAutocompleteViews = [@{} mutableCopy];
  
  for (AutocompleteViewInfo* info in autocompletes) {
    NSString* infoString = [info stringRepresentation];
    
    if ([closedAutocorrects containsObject:infoString]) {
      continue;
    }
    
    UIView* view = [oldAutocompleteViews objectForKey:infoString];
    if (view) {
      [oldAutocompleteViews removeObjectForKey:infoString];
      [newAutocompleteViews setObject:view forKey:infoString];
    } else {
      __weak RNDJDraftJSEditor* weakSelf = self;
      
      NSUInteger previousCount = 0;

      RNDJAutocorrectView* previousView = [oldAutocompleteViews objectForKey:[info previousStringRepresentation]];
      if (previousView) {
        previousCount = previousView.previousCount + 1;
      }

      RNDJAutocorrectView* autocorrectView =
      [RNDJAutocorrectView make:info
                         inside:self.superview
                    cancelBlock:^(NSString* key) {
                      [weakSelf cancelAutocorrect:key];
                    }
              withContentOffset:_contentInset
              withPreviousCount:previousCount];
      
      if (previousCount >= 2)
      {
        [_autocompleteLayer removeFromSuperlayer];
        _autocompleteLayer = nil;
      }
      
      autocorrectView.onReplaceRangeRequest = _onReplaceRangeRequest;
      
      view = autocorrectView;
      if (view) {
        [newAutocompleteViews setObject:view forKey:infoString];
      }
    }
  }
  
  for (UIView* oldView in [oldAutocompleteViews allValues]) {
    [oldView removeFromSuperview];
  }
  
  existingAutocompleteViews = [NSDictionary dictionaryWithDictionary:newAutocompleteViews];

  NSMutableSet* mutableClosedAutocorrects = [NSMutableSet set];
  for (NSString* closedAutocorrectKey in closedAutocorrects) {
    if ([[existingAutocompleteViews allKeys] containsObject:closedAutocorrectKey]) {
      [mutableClosedAutocorrects addObject:closedAutocorrectKey];
    }
  }
}

- (void)keyboardWillShow:(NSNotification*)aNotification
{
  
}

- (void)keyboardDidShow:(NSNotification*)aNotification
{
  [self scrollToCursorIfNeeded];
  
//  for (UIWindow* window in [[UIApplication sharedApplication] windows]) {
//      [self searchForKeys:window];
//  }
}

- (void) searchForKeys:(UIView*)v
{
  if ([[v description] rangeOfString:@"UIKBKeyView"].location != NSNotFound)
  {
    NSLog(@"K: %@", v);
  }
  
  if ([[v description] hasPrefix:@"<UIKBKeyView"])
  {
    NSLog(@"K: %@", v);
  }
  
  for (UIView* subview in [v subviews])
  {
    [self searchForKeys:subview];
  }
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

- (void) handleDragState:(UIPanGestureRecognizer*)gesture
{
  switch (gesture.state) {
    case UIGestureRecognizerStateBegan:
      isDraggingRange = YES;
      break;
    case UIGestureRecognizerStateEnded:
    case UIGestureRecognizerStateCancelled:
    case UIGestureRecognizerStateFailed:
      isDraggingRange = NO;
      
      if (_highlightLayer.path)
      {
        CGRect selectionBounds = CGPathGetBoundingBox(_highlightLayer.path);
        UIMenuController* editMenu = [UIMenuController sharedMenuController];
        [editMenu setTargetRect:selectionBounds inView:self];
        [editMenu setMenuVisible:YES animated:YES];
      }
      break;
      
    default:
      break;
  }
}

- (void) dragStart:(UIPanGestureRecognizer*)gesture
{
  [self handleDragState:gesture];
  
  if (gesture.state == UIGestureRecognizerStateChanged)
  {
    CGPoint tapPostion = [gesture locationInView:self];
    RNDJDraftJsIndex* selectedBlock = [self draftJsIndexForPointInView:tapPostion];
    NSUInteger selectedIndex = [self blockKeyToIndex:selectedBlock.key];
    NSUInteger endIndex = [self blockKeyToIndex:_selectionEnd.key];
    
    if (selectedIndex < endIndex ||
        (selectedIndex == endIndex && selectedBlock.offset < _selectionEnd.offset))
    {
      [self requestSetSelectionFrom:selectedBlock.key
                             offset:selectedBlock.offset
                                 to:_selectionEnd.key
                             offset:_selectionEnd.offset];
    }
  }
  [self updateMagnifierFromGesture:gesture];
}

- (void) dragEnd:(UIPanGestureRecognizer*)gesture
{
  [self handleDragState:gesture];

  if (gesture.state == UIGestureRecognizerStateChanged)
  {
    CGPoint tapPostion = [gesture locationInView:self];
    RNDJDraftJsIndex* selectedBlock = [self draftJsIndexForPointInView:tapPostion];
    NSUInteger selectedIndex = [self blockKeyToIndex:selectedBlock.key];
    NSUInteger startIndex = [self blockKeyToIndex:_selectionStart.key];
    
    if (startIndex < selectedIndex ||
        (selectedIndex == startIndex && _selectionStart.offset < selectedBlock.offset))
    {
      [self requestSetSelectionFrom:_selectionStart.key
                             offset:_selectionStart.offset
                                 to:selectedBlock.key
                             offset:selectedBlock.offset];
    }
  }
  [self updateMagnifierFromGesture:gesture];
}

- (void) handlePositionSelect:(UIGestureRecognizer*)gesture
{
  CGPoint tapPostion = [gesture locationInView:self];
  
  if (!_hasFocus) {
    _hasFocus = YES;
    [self becomeFirstResponder];
    
    RNDJDraftJsIndex* selectedIndex = [self draftJsIndexForPointInView:tapPostion];
    if (selectedIndex) {
      [self requestSetSelection:selectedIndex];
    } else {
      [self requestHasFocus:YES];
    }

    if ([_firstIndex.key isEqualToString:_lastIndex.key] && _firstIndex.offset == 0 && _lastIndex.offset == NSUIntegerMax)
    {
      isReadyToCapitalize = YES;
    }
    else
    {
      isReadyToCapitalize = NO;
    }
    
    periodEnterState = AutoPeriodStateNotReady;
  } else {
    RNDJDraftJsIndex* selectedIndex = [self draftJsIndexForPointInView:tapPostion];
    [self requestSetSelection:selectedIndex];
    isReadyToCapitalize = NO;
  }
  
  [self updateMagnifierFromGesture:gesture];
}

- (void) tap:(UIGestureRecognizer*)gesture
{
  [self handlePositionSelect:gesture];
}

//RNDJDraftJsIndex* closestDraftJsIndex = _textStorage.length > 0 ? [_textStorage attribute:RNDJDraftJsIndexAttributeName atIndex:characterIndex effectiveRange:NULL] : nil;;
//[attributedString enumerateAttribute:RNDJDraftJsIndexAttributeName
//                             inRange:NSMakeRange(0, attributedString.length)
//                             options:0
//                          usingBlock:^(RNDJDraftJsIndex* index, NSRange range, BOOL* stop) {
//                            if (index && [index isEqual:_selectionStart]) {
//                              cursorIndex = range.location;
//                              foundCursor = YES;
//                              *stop = YES;
//                            }
//                          }];

- (void) selectWithGesture:(UIGestureRecognizer*)gesture matchingCharSet:(NSCharacterSet*)characterSet endInclusive:(BOOL)endInclusive
{
  if (gesture.state != UIGestureRecognizerStateRecognized)
  {
    return;
  }
  
  CGPoint tapPostion = [gesture locationInView:self];
  
  if (!_hasFocus) {
    _hasFocus = YES;
    [self becomeFirstResponder];
  }
  
  RNDJDraftJsIndex* selectedIndex = [self draftJsIndexForPointInView:tapPostion];
  
  __block NSInteger selectedStringPos = NSIntegerMax;
  [_textStorage enumerateAttribute:RNDJDraftJsIndexAttributeName
                           inRange:NSMakeRange(0, _textStorage.length)
                           options:0
                        usingBlock:^(RNDJDraftJsIndex* index, NSRange range, BOOL* stop) {
                          if (index && range.location < selectedStringPos && [index isEqual:selectedIndex]) {
                            selectedStringPos = range.location;
                            *stop = YES;
                          }
                        }];
  
  NSString* s = [_textStorage string];
  if (selectedStringPos >= s.length - 1 || [s characterAtIndex:selectedStringPos+1] == '\n')
  {
    selectedStringPos--;
  }
  
  if (selectedStringPos < 0 || selectedStringPos >= _textStorage.length)
  {
    [self updateMagnifierFromGesture:gesture];
    return;
  }
  
  
  if (s.length == 0)
  {
    [self updateMagnifierFromGesture:gesture];
    return;
  }
  
  NSInteger startPos = selectedStringPos;
  while (startPos >= 0 && ![characterSet characterIsMember:[s characterAtIndex:startPos]])
  {
    startPos--;
  }
  startPos++;
  
  NSInteger endPos = selectedStringPos;
  while (endPos < s.length && ![characterSet characterIsMember:[s characterAtIndex:endPos]])
  {
    endPos++;
  }
  if (!endInclusive || endPos == s.length)
  {
    endPos--;
  }
  
  
  
  RNDJDraftJsIndex* startDraftJsIndex = [_textStorage attribute:RNDJDraftJsIndexAttributeName atIndex:startPos effectiveRange:NULL];
  RNDJDraftJsIndex* endDraftJsIndex = [_textStorage attribute:RNDJDraftJsIndexAttributeName atIndex:endPos effectiveRange:NULL];
  
  if (startDraftJsIndex && endDraftJsIndex)
  {
    [self requestSetSelectionFrom:startDraftJsIndex to:endDraftJsIndex];
  }
  [self updateMagnifierFromGesture:gesture];
}

- (void) doubleTap:(UIGestureRecognizer*)gesture
{
  [self selectWithGesture:gesture matchingCharSet:[NSCharacterSet whitespaceAndNewlineCharacterSet] endInclusive:NO];
}

- (void) tripleTap:(UIGestureRecognizer*)gesture
{
  [self selectWithGesture:gesture matchingCharSet:[NSCharacterSet characterSetWithCharactersInString:@".\n"] endInclusive:YES];
}

- (void) quadrupleTap:(UIGestureRecognizer*)gesture
{
  [self requestSetSelectionFrom:_firstIndex to:_lastIndex];
}

- (NSUInteger) blockKeyToIndex:(NSString*)blockKey
{
  NSUInteger i = 0;
  for (RNDJBlockModel* block in _contentModel.blocks)
  {
    if ([block.key isEqualToString:blockKey])
    {
      return i;
    }
    i++;
  }

  return INT_MAX;
}

- (void)handleLongPress:(UILongPressGestureRecognizer *)gesture
{
  CGPoint tapPostion = [gesture locationInView:self];
  
  [self handlePositionSelect:gesture];
  
//  On end of long press, get rectangle of cursor position (go from selection point to text point, to text rectangle)
//  Maybe defer to next render??? since cursor is already selected there
//
//  How about "show menu" callback that gets passed back into editor JS
//
//  If tap happens, or long press, remove shared menu
//
//  Menu shows paste/Select/Select All originally, no "Copy"
//
//  Then show bars when multiple selection is working
//  If long press starts near one of the edges, use that to extend selection
  
  
  if (gesture.state == UIGestureRecognizerStateEnded)
  {
    UIMenuController* editMenu = [UIMenuController sharedMenuController];
    CGRect selectionRect = CGRectMake (tapPostion.x, tapPostion.y, 10, 2);
    [editMenu setTargetRect:selectionRect inView:self];
    [editMenu setMenuVisible:YES animated:YES];
    [self setMenuItems];
  }
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
          contentFrame:(CGRect)contentFrame
       descendantViews:(NSArray<UIView *> *)descendantViews
{
  _textStorage = textStorage;
  
  NSMutableArray* viewsToNotRemove = [NSMutableArray arrayWithArray:[existingAutocompleteViews allValues]];
  
  [viewsToNotRemove addObject:magnifyingGlass];
  [viewsToNotRemove addObject:startDragView];
  [viewsToNotRemove addObject:endDragView];
  
#if DEBUG_TOUCHES
  [viewsToNotRemove addObject:positionLabel];
  [viewsToNotRemove addObject:debugTouchesView];
#endif
  
  // Update subviews
  NSArray<UIView *> *nonTextDescendants = descendantViews;
  [viewsToNotRemove addObjectsFromArray:nonTextDescendants];
  
  for (UIView *child in self.subviews) {
    if (![viewsToNotRemove containsObject:child]) {
      [child removeFromSuperview];
    }
  }
  for (UIView *child in nonTextDescendants) {
    if (![self.subviews containsObject:child]) {
      [self addSubview:child];
    }
  }

  [self setNeedsDisplay];
}

- (void)drawRect:(CGRect)rect
{
  NSLayoutManager *layoutManager = [_textStorage.layoutManagers firstObject];
  NSTextContainer *textContainer = [layoutManager.textContainers firstObject];
  
  NSRange glyphRange = [layoutManager glyphRangeForTextContainer:textContainer];
  [layoutManager drawBackgroundForGlyphRange:glyphRange atPoint:_contentFrame.origin];
  [layoutManager drawGlyphsForGlyphRange:glyphRange atPoint:_contentFrame.origin];
  
  __block UIBezierPath *highlightPath = nil;
  __block UIBezierPath *startDragPath = nil;
  __block UIBezierPath *endDragPath = nil;
  startDragView.frame = CGRectMake(0, 0, 0, 0);
  endDragView.frame = CGRectMake(0, 0, 0, 0);

  NSRange characterRange = [layoutManager characterRangeForGlyphRange:glyphRange actualGlyphRange:NULL];
  [layoutManager.textStorage enumerateAttribute:RNDJDraftJsIsHighlightedAttributeName inRange:characterRange options:0 usingBlock:^(NSNumber *value, NSRange range, BOOL *_) {
    if (!value.boolValue) {
      return;
    }
    
    NSRange startRange = NSMakeRange(range.location, 1);
    [layoutManager
     enumerateEnclosingRectsForGlyphRange:startRange
     withinSelectedGlyphRange:startRange
     inTextContainer:textContainer
     usingBlock:^(CGRect enclosingRect, __unused BOOL *__) {
       enclosingRect = CGRectInset(enclosingRect, 0, -2);
       CGRect startRect = CGRectMake(enclosingRect.origin.x - 2,
                                     enclosingRect.origin.y,
                                     2,
                                     enclosingRect.size.height);
       startDragPath = [UIBezierPath bezierPathWithRoundedRect:startRect cornerRadius:1];
       [startDragPath appendPath:[UIBezierPath bezierPathWithOvalInRect:CGRectMake(startRect.origin.x+(startRect.size.width/2.f)-(selectNibSize/2.f),
                                                                                   startRect.origin.y-(selectNibSize/2.f),
                                                                                   selectNibSize, selectNibSize)]];

       CGRect interactableRect = CGRectInset(startRect, -15, -15);
       interactableRect = CGRectMake(interactableRect.origin.x + _contentInset.left,
                                     interactableRect.origin.y + _contentInset.top,
                                     interactableRect.size.width,
                                     interactableRect.size.height);
       startDragView.frame = interactableRect;
     }];
    
    NSRange endRange = NSMakeRange(range.location+range.length-1, 1);
    [layoutManager
     enumerateEnclosingRectsForGlyphRange:endRange
     withinSelectedGlyphRange:endRange
     inTextContainer:textContainer
     usingBlock:^(CGRect enclosingRect, __unused BOOL *__) {
       enclosingRect = CGRectInset(enclosingRect, 0, -2);
       CGRect endRect = CGRectMake(enclosingRect.origin.x + enclosingRect.size.width,
                                   enclosingRect.origin.y,
                                   2,
                                   enclosingRect.size.height);
       endDragPath = [UIBezierPath bezierPathWithRoundedRect:endRect cornerRadius:1];
       [endDragPath appendPath:[UIBezierPath bezierPathWithOvalInRect:CGRectMake(endRect.origin.x+(endRect.size.width/2.f)-(selectNibSize/2.f),
                                                                                 endRect.origin.y+endRect.size.height-(selectNibSize/2.f),
                                                                                 selectNibSize, selectNibSize)]];
       
       CGRect interactableRect = CGRectInset(endRect, -15, -15);
       interactableRect = CGRectMake(interactableRect.origin.x + _contentInset.left,
                                     interactableRect.origin.y + _contentInset.top,
                                     interactableRect.size.width,
                                     interactableRect.size.height);
       endDragView.frame = interactableRect;
     }];

    [layoutManager
     enumerateEnclosingRectsForGlyphRange:range
     withinSelectedGlyphRange:range
     inTextContainer:textContainer
     usingBlock:^(CGRect enclosingRect, __unused BOOL *__) {
       UIBezierPath *path = [UIBezierPath bezierPathWithRoundedRect:CGRectInset(enclosingRect, -2, -2) cornerRadius:2];
       if (highlightPath) {
         [highlightPath appendPath:path];
       } else {
         highlightPath = path;
       }
     }];
  }];

  if (highlightPath && !isDraggingRange)
  {
    CGRect selectionBounds = highlightPath.bounds;
    UIMenuController* editMenu = [UIMenuController sharedMenuController];
    [editMenu setTargetRect:selectionBounds inView:self];
    [editMenu setMenuVisible:YES animated:YES];
  }
  else
  {
    [[UIMenuController sharedMenuController] setMenuVisible:NO animated:YES];
  }

  NSMutableArray* autocompleteViewInfos = [@[] mutableCopy];
  __block UIBezierPath *autocompleteHighlightPath = nil;
  [layoutManager.textStorage enumerateAttribute:RNDJDraftJsAutocompleteAttributeName
                                        inRange:characterRange
                                        options:0
                                     usingBlock:^(SimpleAutocorrectInfo *info, NSRange range, BOOL *_)
   {
     if (info.existingText.length == 0 || !info.start || !info.end || info.textSuggestion.length == 0) {
       return;
     }

     __block CGPoint lastPoint = CGPointMake(-100, -100);
     
     __block UIBezierPath* newPath = nil;
     [layoutManager enumerateEnclosingRectsForGlyphRange:range withinSelectedGlyphRange:range inTextContainer:textContainer usingBlock:^(CGRect enclosingRect, __unused BOOL *__) {
       CGRect highlightRect = CGRectInset(enclosingRect, -2, -2);
       
       lastPoint = CGPointMake(highlightRect.origin.x, highlightRect.origin.y+highlightRect.size.height);
       
       newPath = [UIBezierPath bezierPathWithRoundedRect:highlightRect cornerRadius:0];
     }];
     
     if (lastPoint.x < -50 || lastPoint.y < -50) {
       return;
     }
     
     AutocompleteViewInfo* newInfo = [[AutocompleteViewInfo alloc]
                                      initWithPoint:lastPoint
                                      existingText:info.existingText
                                      inRange:range
                                      start:info.start
                                      end:info.end
                                      textSuggestion:info.textSuggestion];
     
     if ([closedAutocorrects containsObject:[newInfo stringRepresentation]]) {
       newInfo = nil;
       newPath = nil;
     }
     
     if (newInfo) {
       [autocompleteViewInfos addObject:newInfo];
     }
     
     if (newPath) {
       if (autocompleteHighlightPath) {
         [autocompleteHighlightPath appendPath:newPath];
       } else {
         autocompleteHighlightPath = newPath;
       }
     }
   }];

  dispatch_async(dispatch_get_main_queue(), ^{
    [self updateAutocompletes:autocompleteViewInfos];
  });


  __block UIBezierPath* cursorPath = nil;
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
      if (cursorPath) {
        [cursorPath appendPath:path];
      } else {
        cursorPath = path;
      }
    }];
  }];

  CGFloat selectionOpacity = isnan(_selectionOpacity) ? 0.25 : _selectionOpacity;

  UIColor* selectionColor = [UIColor colorWithWhite:0 alpha:selectionOpacity];
  if (_selectionColor) {
    selectionColor = [_selectionColor colorWithAlphaComponent:CGColorGetAlpha(_selectionColor.CGColor) * selectionOpacity];
  }
  
  if (cursorPath)
  {
    CGRect selectionBounds = cursorPath.bounds;
    UIMenuController* editMenu = [UIMenuController sharedMenuController];
    [editMenu setTargetRect:selectionBounds inView:self];
    [editMenu update];
  }
  
  if (highlightPath) {
    if (!_highlightLayer) {
      _highlightLayer = [CAShapeLayer layer];
      _highlightLayer.fillColor = selectionColor.CGColor;
      [self.layer insertSublayer:_highlightLayer atIndex:0];
    }
    _highlightLayer.position = (CGPoint){_contentInset.left, _contentInset.top};
    _highlightLayer.path = highlightPath.CGPath;
  } else {
    [_highlightLayer removeFromSuperlayer];
    _highlightLayer = nil;
  }
  
  CGFloat cursorOpacity = isnan(_cursorOpacity) ? 0.25 : _cursorOpacity;
  UIColor* cursorColor = [UIColor colorWithWhite:0 alpha:cursorOpacity];
  if (_cursorColor) {
    cursorColor = [_cursorColor colorWithAlphaComponent:CGColorGetAlpha(_cursorColor.CGColor) * cursorOpacity];
  }
  if (cursorPath) {
    if (!_singleCursorLayer) {
      _singleCursorLayer = [CAShapeLayer layer];
      _singleCursorLayer.fillColor = cursorColor.CGColor;
      [self.layer addSublayer:_singleCursorLayer];
    }
    _singleCursorLayer.position = (CGPoint){_contentInset.left, _contentInset.top};
    _singleCursorLayer.path = cursorPath.CGPath;
  } else {
    [_singleCursorLayer removeFromSuperlayer];
    _singleCursorLayer = nil;
  }

  if (startDragPath)
  {
    if (!_startDragLayer) {
      _startDragLayer = [CAShapeLayer layer];
      _startDragLayer.fillColor = cursorColor.CGColor;
      [self.layer addSublayer:_startDragLayer];
    }
    _startDragLayer.position = (CGPoint){_contentInset.left, _contentInset.top};
    _startDragLayer.path = startDragPath.CGPath;
  } else {
    [_startDragLayer removeFromSuperlayer];
    _startDragLayer = nil;
  }

  if (endDragPath)
  {
    if (!_endDragLayer) {
      _endDragLayer = [CAShapeLayer layer];
      _endDragLayer.fillColor = cursorColor.CGColor;
      [self.layer addSublayer:_endDragLayer];
    }
    _endDragLayer.position = (CGPoint){_contentInset.left, _contentInset.top};
    _endDragLayer.path = endDragPath.CGPath;
  } else {
    [_endDragLayer removeFromSuperlayer];
    _endDragLayer = nil;
  }
  
  if (autocompleteHighlightPath) {
    if (!_autocompleteLayer) {
      _autocompleteLayer = [CAShapeLayer layer];
      _autocompleteLayer.fillColor = [[UIColor alloc] initWithRed:0.11764 green:0.5647 blue:1 alpha:0.4f].CGColor;
      [self.layer addSublayer:_autocompleteLayer];
    }
    _autocompleteLayer.position = (CGPoint){_contentInset.left, _contentInset.top};
    _autocompleteLayer.path = autocompleteHighlightPath.CGPath;
  } else {
    [_autocompleteLayer removeFromSuperlayer];
    _autocompleteLayer = nil;
  }

  [self setMenuItems];
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
    reactTag = [_textStorage attribute:RNDJDraftJsReactTagAttributeName atIndex:characterIndex effectiveRange:NULL];
  }
  return reactTag;
}

- (void)didMoveToWindow
{
  [super didMoveToWindow];
  
  if (!self.window) {
    self.layer.contents = nil;

    [_highlightLayer removeFromSuperlayer];
    _highlightLayer = nil;

    [_singleCursorLayer removeFromSuperlayer];
    _singleCursorLayer = nil;

    [_endDragLayer removeFromSuperlayer];
    _endDragLayer = nil;

    [_startDragLayer removeFromSuperlayer];
    _startDragLayer = nil;
    
    [_autocompleteLayer removeFromSuperlayer];
    _autocompleteLayer = nil;
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

- (void) requestSetSelectionFrom:(RNDJDraftJsIndex*)startIndex to:(RNDJDraftJsIndex*)endIndex
{
  [self requestSetSelectionFrom:startIndex.key offset:startIndex.offset to:endIndex.key offset:endIndex.offset+1];
}

- (void) requestSetSelectionFrom:(NSString*)startKey offset:(NSUInteger)startOffset to:(NSString*)endKey offset:(NSUInteger)endOffset
{
  if (startKey.length > 0 && endKey.length > 0) {
    RCTDirectEventBlock onSelectionChangeRequest = _onSelectionChangeRequest;
    if (onSelectionChangeRequest) {
      onSelectionChangeRequest(@{
                                 @"startKey": startKey,
                                 @"startOffset": @(startOffset),
                                 @"endKey": endKey,
                                 @"endOffset": @(endOffset),
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
      shouldShowAutocomplete = NO;
    }
  } else if (!hasFocus && self.isFirstResponder) {
    if (![self resignFirstResponder]) {
      [self requestHasFocus:YES];
      shouldShowAutocomplete = NO;
    }
  }
}

- (void) setMenuItems
{
  [[UIMenuController sharedMenuController] update];
}

- (BOOL)canPerformAction:(SEL)action withSender:(id)sender
{
  if (action == @selector(copy:)) {
    return _selectionStart && _selectionEnd && ![_selectionStart isEqual:_selectionEnd];
  }
  if (action == @selector(select:)) {
    return [_selectionStart isEqual:_selectionEnd];
  }
  if (action == @selector(selectAll:)) {
    return _firstIndex && _lastIndex &&
    (!_selectionStart || !_selectionEnd || (
                                            _firstIndex && _lastIndex &&
                                            (![_selectionStart isEqual:_firstIndex] || ![_selectionEnd isEqual:_lastIndex])));
  }
  if (action == @selector(delete:)) {
    return _selectionStart && _selectionEnd && ![_selectionStart isEqual:_selectionEnd];
  }
  if (action == @selector(cut:)) {
    return _selectionStart && _selectionEnd && ![_selectionStart isEqual:_selectionEnd];
  }
  if (action == @selector(paste:)) {
    return [[UIPasteboard generalPasteboard] containsPasteboardTypes:@[(id)kUTTypeUTF8PlainText]];
  }

  return [super canPerformAction:action withSender:sender];
}

- (void)select:(id)sender
{
  __block BOOL foundCursor = NO;
  __block NSUInteger cursorIndex = 0;
  
  NSAttributedString* attributedString = _textStorage;
  
  [attributedString enumerateAttribute:RNDJDraftJsIndexAttributeName
                               inRange:NSMakeRange(0, attributedString.length)
                               options:0
                            usingBlock:^(RNDJDraftJsIndex* index, NSRange range, BOOL* stop) {
                              if (index && [index isEqual:_selectionStart]) {
                                cursorIndex = range.location;
                                foundCursor = YES;
                                *stop = YES;
                              }
                            }];
  
  if (!foundCursor) {
    return;
  }

  BOOL foundStart = NO;
  NSUInteger startIndex = 0;
  
  NSUInteger curIndex = cursorIndex;
  NSCharacterSet* set = [NSCharacterSet whitespaceAndNewlineCharacterSet];
  NSString* string = attributedString.string;

  while (!foundStart && curIndex < string.length)
  {
    unichar ch = [string characterAtIndex:curIndex];
    if ([set characterIsMember:ch])
    {
      foundStart = YES;
      startIndex = curIndex + 1;
      break;
    }
    
    curIndex--;
  }
  
  if (!foundStart) {
    startIndex = 0;
  }
  
  BOOL foundEnd = NO;
  NSUInteger endIndex = 0;
  
  curIndex = cursorIndex;
  while (!foundEnd && curIndex < string.length)
  {
    unichar ch = [string characterAtIndex:curIndex];
    if ([set characterIsMember:ch])
    {
      foundEnd = YES;
      endIndex = curIndex - 1;
      break;
    }
    
    curIndex++;
  }
  
  if (!foundEnd) {
    endIndex = string.length - 1;
  }
  
  if (startIndex < string.length && endIndex < string.length)
  {
    RNDJDraftJsIndex* start = [attributedString attribute:RNDJDraftJsIndexAttributeName atIndex:startIndex effectiveRange:nil];
    RNDJDraftJsIndex* end = [attributedString attribute:RNDJDraftJsIndexAttributeName atIndex:endIndex effectiveRange:nil];
    
    if (start && end) {
      [self requestSetSelectionFrom:start to:end];
    }
  }
}

- (void)cut:(id)sender
{
  [self copy:sender];
  [self delete:sender];
}

- (void)delete:(id)sender
{
  RCTDirectEventBlock onReplaceRangeRequest = _onReplaceRangeRequest;
  if (!_selectionStart || !_selectionEnd || !onReplaceRangeRequest || _selectionStart.key.length == 0 || _selectionEnd.key.length == 0)
  {
    return;
  }

  onReplaceRangeRequest(@{
                          @"startKey": _selectionStart.key,
                          @"startOffset": @(_selectionStart.offset),
                          @"endKey": _selectionEnd.key,
                          @"endOffset": @(_selectionEnd.offset),
                          @"word": @"",
                          });
}

- (void)paste:(id)sender
{
  NSString* text = [[UIPasteboard generalPasteboard] string];
  
  if (text.length > 0)
  {
    [self insertText:text];
  }
}

- (void)selectAll:(id)sender
{
  if (!_firstIndex || !_lastIndex)
  {
    return;
  }
  
  [self requestSetSelectionFrom:_firstIndex to:_lastIndex];
}

- (void)copy:(id)sender
{
  if (!_selectionStart || !_selectionEnd) {
    return;
  }

  __block NSUInteger startIndex = 0;
  __block NSUInteger endIndex = 0;
  
  __block NSUInteger smallestStartDistance = NSUIntegerMax;
  __block NSUInteger smallestEndDistance = NSUIntegerMax;
  
  NSAttributedString* attributedString = _textStorage;

  [attributedString enumerateAttribute:RNDJDraftJsIndexAttributeName
                               inRange:NSMakeRange(0, attributedString.length)
                               options:0
                            usingBlock:^(RNDJDraftJsIndex* index, NSRange range, BOOL* stop) {
                              NSUInteger offsetDistance = abs((int)index.offset - (int)_selectionStart.offset);
                              if (index && [index.key isEqualToString:_selectionStart.key] && offsetDistance < smallestStartDistance) {
                                startIndex = range.location;
                                smallestStartDistance = offsetDistance;
                              }
                            }];
  
  [attributedString enumerateAttribute:RNDJDraftJsIndexAttributeName
                               inRange:NSMakeRange(0, attributedString.length)
                               options:0
                            usingBlock:^(RNDJDraftJsIndex* index, NSRange range, BOOL* stop) {
                              NSUInteger offsetDistance = abs((int)index.offset - (int)_selectionEnd.offset);
                              if (index && [index.key isEqualToString:_selectionEnd.key] && offsetDistance < smallestEndDistance) {
                                endIndex = range.location + range.length - 1;
                                smallestEndDistance = offsetDistance;
                              }
                            }];

  if (startIndex > endIndex) {
    NSUInteger temp = endIndex;
    endIndex = startIndex;
    startIndex = temp;
  }
  
  if (smallestStartDistance == NSUIntegerMax || smallestEndDistance == NSUIntegerMax || endIndex == startIndex || endIndex >= attributedString.length || startIndex >= attributedString.length) {
    return;
  }

  NSMutableDictionary *item = [NSMutableDictionary new];
  
  NSRange substringRange = NSMakeRange(startIndex, endIndex - startIndex);
  NSData *rtf = [attributedString dataFromRange:substringRange
                             documentAttributes:@{NSDocumentTypeDocumentAttribute: NSRTFDTextDocumentType}
                                          error:nil];
  
  if (rtf) {
    [item setObject:rtf forKey:(id)kUTTypeFlatRTFD];
  }
  
  [item setObject:[attributedString.string substringWithRange:substringRange] forKey:(id)kUTTypeUTF8PlainText];
  
  UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
  pasteboard.items = @[item];
}

- (BOOL)hasText
{
  return _textStorage.length > 0;
}

- (void)insertText:(NSString *)text
{
  [[UIMenuController sharedMenuController] setMenuVisible:NO animated:YES];

  if ([text isEqualToString:@" "] && [existingAutocompleteViews count]) {
    for (NSString* autocompleteKey in existingAutocompleteViews) {
      if (![closedAutocorrects containsObject:autocompleteKey]) {
        RNDJAutocorrectView* autocompleteView = existingAutocompleteViews[autocompleteKey];
        if ([autocompleteView isKindOfClass:[RNDJAutocorrectView class]]) {
          if ([autocompleteView dispatchIfOnlyShownNTimes:2])
          {
            periodEnterState = AutoPeriodStateEnteredFirstPeriod;
            return;
          }
        }
      }
    }
  }

  RCTDirectEventBlock onInsertTextRequest = self.onInsertTextRequest;
  RCTDirectEventBlock onNewlineRequest = self.onNewlineRequest;
  
  if (text.length == 1)
  {
    if ([[NSCharacterSet characterSetWithCharactersInString:terminalPunctionationString] characterIsMember:[text characterAtIndex:0]])
    {
      isReadyToCapitalize = YES;
    }
    else if ([[NSCharacterSet newlineCharacterSet] characterIsMember:[text characterAtIndex:0]])
    {
      isReadyToCapitalize = YES;
    }
    else if ([[NSCharacterSet whitespaceCharacterSet] characterIsMember:[text characterAtIndex:0]])
    {
      
    }
    else if (isReadyToCapitalize)
    {
      text = [text capitalizedString];
      isReadyToCapitalize = NO;
    }
    
    if ([text characterAtIndex:0] == ' ')
    {
      RCTDirectEventBlock onReplaceRangeRequest = _onReplaceRangeRequest;
      if (periodEnterState == AutoPeriodStateEnteredCharacter)
      {
        periodEnterState = AutoPeriodStateEnteredFirstPeriod;
      }
      else  if (periodEnterState == AutoPeriodStateEnteredFirstPeriod && [_selectionStart isEqual:_selectionEnd] && _selectionStart.offset > 0 && _selectionStart.key.length > 0 && onReplaceRangeRequest)
      {
        onReplaceRangeRequest(@{
                                @"startKey": _selectionStart.key,
                                @"startOffset": @(_selectionStart.offset - 1),
                                @"endKey": _selectionStart.key,
                                @"endOffset": @(_selectionStart.offset),
                                @"word": @". ",
                                });
        periodEnterState = AutoPeriodStateNotReady;
        isReadyToCapitalize = YES;
        return;
      }
    }
    else
    {
      if ([[NSCharacterSet letterCharacterSet] characterIsMember:[text characterAtIndex:0]])
      {
        periodEnterState = AutoPeriodStateEnteredCharacter;
      }
      else
      {
        periodEnterState = AutoPeriodStateNotReady;
      }
    }
  }
  else
  {
    isReadyToCapitalize = NO;
    periodEnterState = AutoPeriodStateNotReady;
  }

  NSArray* textComponents = [text componentsSeparatedByString:@"\n"];
  NSUInteger numComponents = textComponents.count;
  
  if (numComponents == 1 && ((NSString*)textComponents[0]).length == 1 && ![textComponents[0] isEqualToString:@" "]) {
    shouldShowAutocomplete = YES;
  } else {
    shouldShowAutocomplete = NO;
  }
  
  for (int i=0; i<numComponents; i++) {
    NSString* textComponent = textComponents[i];
    
    if (textComponent.length > 0) {
      if (onInsertTextRequest)
      {
        onInsertTextRequest(@{@"text": textComponent});
      }
    }
    
    if (textComponent.length == 1 && ![textComponent isEqualToString:@" "]) {
      
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
  shouldShowAutocomplete = NO;
}
  
#pragma mark - touch events
  
- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event {
  UITouch *touch = [touches anyObject];
  [self updateMagnifyingGlassAtPoint:[touch locationInView:self]];
  touchTimer = [NSTimer scheduledTimerWithTimeInterval:MAGNIFYING_GLASS_SHOW_DELAY
                                                     target:self
                                                   selector:@selector(addMagnifyingGlassTimer:)
                                                   userInfo:nil
                                                    repeats:NO];
  magnifyingGlassRetainCount++;
}
  
- (void) touchesMoved:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
  [self updateMagnifyingGlassAtPoint:[[touches anyObject] locationInView:self]];
}

- (void) touchesEnded:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
  [self removeMagnifyingGlass];
}

- (void) touchesCancelled:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
  [self removeMagnifyingGlass];
}

#pragma mark - private functions

- (void)addMagnifyingGlassTimer:(NSTimer*)timer {
  [self addMagnifyingGlass];
}

#pragma mark - magnifier function
  
- (void) updateMagnifierFromGesture:(UIGestureRecognizer*) gesture {
  switch (gesture.state) {
    case UIGestureRecognizerStateBegan:
      magnifyingGlassRetainCount++;
    case UIGestureRecognizerStatePossible:
    case UIGestureRecognizerStateChanged:
      [self updateMagnifyingGlassAtPoint:[gesture locationInView:self]];
      break;  
      
    case UIGestureRecognizerStateEnded:
    case UIGestureRecognizerStateFailed:
    case UIGestureRecognizerStateCancelled:
      [self removeMagnifyingGlass];
      break;
  }
}
- (void)addMagnifyingGlass {
  [self.superview addSubview:magnifyingGlass];
  [magnifyingGlass setNeedsDisplay];
}

- (void)removeMagnifyingGlass {
  magnifyingGlassRetainCount--;
  if (magnifyingGlassRetainCount > 0) {
    return;
  }
  magnifyingGlassRetainCount = 0;
  [touchTimer invalidate];
  touchTimer = nil;
  [magnifyingGlass removeFromSuperview];
}

- (void)updateMagnifyingGlassAtPoint:(CGPoint)point {
  magnifyingGlass.touchPoint = point;
  [magnifyingGlass setNeedsDisplay];
}


@end

@implementation SimpleAutocorrectInfo

- (instancetype) initWithExistingText:(NSString*)existingText start:(RNDJDraftJsIndex*)start end:(RNDJDraftJsIndex*)end textSuggestion:(NSString *)textSuggestion
{
  if (self = [super init])
  {
    _existingText = existingText;
    _start = start;
    _end = end;
    _textSuggestion = textSuggestion;
  }
  return self;
}

@end

