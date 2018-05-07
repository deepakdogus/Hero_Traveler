//
//  RNDJAutocorrectView.m
//  HeroTravelerMobile
//
//  Created by Andrew Beck on 12/7/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "RNDJAutocorrectView.h"

@implementation RNDJAutocorrectView
{
  UILabel* wordLabel;
}

// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
  [[UIColor clearColor] setFill];
  UIRectFill(rect);
  
  rect = CGRectInset(rect, 1, 1);
  
  UIBezierPath* path = [[UIBezierPath alloc] init];
  [path moveToPoint:rect.origin];
  [path addLineToPoint:CGPointMake(rect.origin.x+rect.size.width-(rect.size.height/2.f),
                                   rect.origin.y)];
  [path addArcWithCenter:CGPointMake(rect.origin.x+rect.size.width-(rect.size.height/2.f),
                                     rect.origin.y+(rect.size.height/2.f))
                  radius:rect.size.height/2.0f
              startAngle:-(M_PI/2.0f)
                endAngle:(M_PI/2.0f)
               clockwise:YES];
  [path addLineToPoint:CGPointMake(rect.origin.x,
                                   rect.origin.y+rect.size.height)];
  
  [path closePath];

  [[UIColor whiteColor] setFill];
  [path fill];
  
  path.lineWidth = 1.f;
  
  [[UIColor lightGrayColor] setStroke];
  [path stroke];
}

+ (RNDJAutocorrectView*) make:(AutocompleteViewInfo*)info inside:(UIView*)view cancelBlock:(CancelAutoCorrectBlock)cancelAutocorrectBlock withContentOffset:(UIEdgeInsets)contentInset withPreviousCount:(NSUInteger)previousCount
{
  NSString* word = info.textSuggestion;

  if (!info || !view || word.length == 0 || [info.existingText isEqualToString:word]) {
    return nil;
  }
  
  RNDJAutocorrectView* autocompleteView = [[RNDJAutocorrectView alloc]
                                           initWithInfo:info
                                           cancelBlock:cancelAutocorrectBlock
                                           withPreviousCount:previousCount];
  autocompleteView.translatesAutoresizingMaskIntoConstraints = false;

  [view addSubview:autocompleteView];
  
  [view
   addConstraint:[NSLayoutConstraint
                  constraintWithItem:autocompleteView
                  attribute:NSLayoutAttributeTop
                  relatedBy:NSLayoutRelationEqual
                  toItem:view
                  attribute:NSLayoutAttributeTop
                  multiplier:1
                  constant:info.point.y+contentInset.top]];
  
  [view
   addConstraint:[NSLayoutConstraint
                  constraintWithItem:autocompleteView
                  attribute:NSLayoutAttributeLeft
                  relatedBy:NSLayoutRelationEqual
                  toItem:view
                  attribute:NSLayoutAttributeLeft
                  multiplier:1
                  constant:info.point.x+contentInset.left]];
  
  return autocompleteView;
}

- (instancetype) initWithInfo:(AutocompleteViewInfo*)info cancelBlock:(CancelAutoCorrectBlock)cancelAutocorrectBlock withPreviousCount:(NSUInteger)previousCount
{
  if (self = [super initWithFrame:CGRectMake(0, 0, 1, 1)])
  {
    [self setup];
    wordLabel.text = info.textSuggestion;
    _cancelAutocorrectBlock = cancelAutocorrectBlock;
    _autocomplete = info;
    _previousCount = previousCount;
    
    if (_previousCount >= 2)
    {
      self.hidden = YES;
    }
  }

  return self;
}

- (void) setup
{
  self.clipsToBounds = NO;
  self.opaque = NO;

  UIView* cancelView = [[UIView alloc] init];
  cancelView.translatesAutoresizingMaskIntoConstraints = false;
  cancelView.backgroundColor = [UIColor clearColor];
  [self addSubview:cancelView];
  
  [self
   addConstraint:[NSLayoutConstraint
                  constraintWithItem:cancelView
                  attribute:NSLayoutAttributeHeight
                  relatedBy:NSLayoutRelationEqual
                  toItem:cancelView
                  attribute:NSLayoutAttributeWidth multiplier:1 constant:0]];
  [self
   addConstraint:[NSLayoutConstraint
                  constraintWithItem:cancelView
                  attribute:NSLayoutAttributeTop
                  relatedBy:NSLayoutRelationEqual
                  toItem:self
                  attribute:NSLayoutAttributeTop multiplier:1 constant:0]];
  [self
   addConstraint:[NSLayoutConstraint
                  constraintWithItem:cancelView
                  attribute:NSLayoutAttributeBottom
                  relatedBy:NSLayoutRelationEqual
                  toItem:self
                  attribute:NSLayoutAttributeBottom multiplier:1 constant:0]];
  [self
   addConstraint:[NSLayoutConstraint
                  constraintWithItem:cancelView
                  attribute:NSLayoutAttributeTrailing
                  relatedBy:NSLayoutRelationEqual
                  toItem:self
                  attribute:NSLayoutAttributeTrailing multiplier:1 constant:0]];
  
  UIView* acceptView = [[UIView alloc] init];
  acceptView.translatesAutoresizingMaskIntoConstraints = false;
  acceptView.backgroundColor = [UIColor clearColor];
  [self addSubview:acceptView];

  [self
   addConstraint:[NSLayoutConstraint
                  constraintWithItem:acceptView
                  attribute:NSLayoutAttributeTrailing
                  relatedBy:NSLayoutRelationEqual
                  toItem:cancelView
                  attribute:NSLayoutAttributeLeading multiplier:1 constant:0]];
  [self
   addConstraint:[NSLayoutConstraint
                  constraintWithItem:acceptView
                  attribute:NSLayoutAttributeTop
                  relatedBy:NSLayoutRelationEqual
                  toItem:self
                  attribute:NSLayoutAttributeTop multiplier:1 constant:0]];
  [self
   addConstraint:[NSLayoutConstraint
                  constraintWithItem:acceptView
                  attribute:NSLayoutAttributeBottom
                  relatedBy:NSLayoutRelationEqual
                  toItem:self
                  attribute:NSLayoutAttributeBottom multiplier:1 constant:0]];
  [self
   addConstraint:[NSLayoutConstraint
                  constraintWithItem:acceptView
                  attribute:NSLayoutAttributeLeading
                  relatedBy:NSLayoutRelationEqual
                  toItem:self
                  attribute:NSLayoutAttributeLeading multiplier:1 constant:0]];

  UITapGestureRecognizer* cancelTap = [[UITapGestureRecognizer alloc]
                                       initWithTarget:self action:@selector(tapCancel:)];
  [cancelView addGestureRecognizer:cancelTap];
  
  UITapGestureRecognizer* acceptTap = [[UITapGestureRecognizer alloc]
                                       initWithTarget:self action:@selector(tapAccept:)];
  [acceptView addGestureRecognizer:acceptTap];

  wordLabel = [[UILabel alloc] initWithFrame:CGRectMake(0, 0, 1, 1)];
  wordLabel.translatesAutoresizingMaskIntoConstraints = false;
  [acceptView addSubview:wordLabel];
  
  [self
   addConstraint:[NSLayoutConstraint
                  constraintWithItem:wordLabel
                  attribute:NSLayoutAttributeTop
                  relatedBy:NSLayoutRelationEqual
                  toItem:acceptView
                  attribute:NSLayoutAttributeTop multiplier:1 constant:4]];
  [self
   addConstraint:[NSLayoutConstraint
                  constraintWithItem:wordLabel
                  attribute:NSLayoutAttributeBottom
                  relatedBy:NSLayoutRelationEqual
                  toItem:acceptView
                  attribute:NSLayoutAttributeBottom multiplier:1 constant:-4]];
  [self
   addConstraint:[NSLayoutConstraint
                  constraintWithItem:wordLabel
                  attribute:NSLayoutAttributeLeading
                  relatedBy:NSLayoutRelationEqual
                  toItem:acceptView
                  attribute:NSLayoutAttributeLeading multiplier:1 constant:4]];
  [self
   addConstraint:[NSLayoutConstraint
                  constraintWithItem:wordLabel
                  attribute:NSLayoutAttributeTrailing
                  relatedBy:NSLayoutRelationEqual
                  toItem:acceptView
                  attribute:NSLayoutAttributeTrailing multiplier:1 constant:-4]];
  
  UILabel* xLabel = [[UILabel alloc] init];
  xLabel.translatesAutoresizingMaskIntoConstraints = NO;
  [cancelView addSubview:xLabel];
  xLabel.text = @"x";
  
  [cancelView addConstraint:[NSLayoutConstraint
                             constraintWithItem:xLabel
                             attribute:NSLayoutAttributeCenterX
                             relatedBy:NSLayoutRelationEqual
                             toItem:cancelView
                             attribute:NSLayoutAttributeCenterX multiplier:1 constant:-4.f]];
  [cancelView addConstraint:[NSLayoutConstraint
                             constraintWithItem:xLabel
                             attribute:NSLayoutAttributeCenterY
                             relatedBy:NSLayoutRelationEqual
                             toItem:cancelView
                             attribute:NSLayoutAttributeCenterY multiplier:1 constant:0]];
}

- (void) tapCancel:(UITapGestureRecognizer*)tap
{
  CancelAutoCorrectBlock cancelAutocorrectBlock = _cancelAutocorrectBlock;
  
  if (cancelAutocorrectBlock) {
    cancelAutocorrectBlock([_autocomplete stringRepresentation]);
  }
}

- (void) dispatch
{
  RCTDirectEventBlock onReplaceRangeRequest = _onReplaceRangeRequest;
  
  RNDJDraftJsIndex* start = _autocomplete.start;
  RNDJDraftJsIndex* end = _autocomplete.end;
  
  if (start.key.length > 0 && end.key.length > 0 && _autocomplete.textSuggestion.length > 0) {
    onReplaceRangeRequest(@{
                            @"startKey": start.key,
                            @"startOffset": @(start.offset),
                            @"endKey": end.key,
                            @"endOffset": @(end.offset),
                            @"word": [NSString stringWithFormat:@"%@ ", _autocomplete.textSuggestion],
                            });
  }
}

- (void) tapAccept:(UITapGestureRecognizer*)tap
{
  if (tap.state == UIGestureRecognizerStateRecognized)
  {
    [self dispatch];
  }
}

@end

@implementation AutocompleteViewInfo

- (instancetype) initWithPoint:(CGPoint)point existingText:(NSString *)existingText inRange:(NSRange)range start:(RNDJDraftJsIndex*)start end:(RNDJDraftJsIndex*)end textSuggestion:(NSString*)textSuggestion
{
  if (self = [super init])
  {
    _point = point;
    _existingText = existingText;
    _range = range;
    _start = start;
    _end = end;
    _textSuggestion = textSuggestion;
  }
  return self;
}

- (NSString*) stringRepresentation
{
  return [NSString stringWithFormat:@"x:%g;y:%g;text:%@;s:%lu;e:%lu", _point.x, _point.y, _existingText, _range.length, _range.location];
}

- (NSString*) previousStringRepresentation
{
  if (_existingText.length > 1)
  {
    NSString* substring = [_existingText substringToIndex:_existingText.length - 1];
    return [NSString stringWithFormat:@"x:%g;y:%g;text:%@;s:%lu;e:%lu", _point.x, _point.y, substring, _range.length - 1, _range.location];
  }
  return [NSString stringWithFormat:@"x:%g;y:%g;text:%@;s:%d;e:%lu", _point.x, _point.y, @"", 0, _range.location];
}

@end
