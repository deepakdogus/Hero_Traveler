//
//  RNDJShadowDraftJSEditor.m
//  RNDraftJs
//
//  Created by Andrew Beck on 10/23/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "RNDJShadowDraftJSEditor.h"

#import <React/RCTAccessibilityManager.h>
#import <React/RCTBridge.h>
#import <React/RCTConvert.h>
#import <React/RCTFont.h>
#import <React/RCTLog.h>
#import <React/RCTShadowView+Layout.h>
#import <React/RCTUIManager.h>
#import <React/RCTUtils.h>

#import "RNDJDraftJSEditor.h"
#import "RCTShadowView+DraftJSDirty.h"
#import "RNDJStyle.h"


static NSString *const kShadowViewAttributeName = @"RCTShadowViewAttributeName";

extern CGFloat const kAutoSizeWidthErrorMargin;
extern CGFloat const kAutoSizeHeightErrorMargin;
extern CGFloat const kAutoSizeGranularity;


NSString *const RNDJSingleCursorPositionAttributeName = @"SingleCursorPositionAttributeName";
NSString *const RNDJDraftJsIndexAttributeName = @"DraftJsIndexAttributeName";
NSString *const RNDJDraftJsAutocompleteAttributeName = @"RNDJDraftJsAutocompleteAttributeName";
NSString *const RNDJDraftJsIsHighlightedAttributeName = @"RNDJDraftJsIsHighlightedAttributeName";
NSString *const RNDJDraftJsReactTagAttributeName = @"RNDJDraftJsReactTagAttributeName";

@interface NSString(DraftJsBlockTypesMap)

- (NSString*) toJsStyleName;

@end

@implementation RNDJShadowDraftJSEditor
{
  __weak RCTBridge *_bridge;
  BOOL _needsUpdateView;
  NSMapTable<id, NSTextStorage *> *_cachedTextStorages;

  NSAttributedString* _cachedAttributedString;

  CGFloat _cachedTextStorageWidth;
  CGFloat _cachedTextStorageWidthMode;
  CGFloat _effectiveLetterSpacing;
  UIUserInterfaceLayoutDirection _cachedLayoutDirection;
}

- (instancetype)initWithBridge:(RCTBridge *)bridge
{
  if (self = [super init]) {
    _bridge = bridge;
    _cachedTextStorages = [NSMapTable strongToStrongObjectsMapTable];
    _needsUpdateView = YES;
    YGNodeSetMeasureFunc(self.yogaNode, DraftJsShadowViewMeasure);
    YGNodeSetBaselineFunc(self.yogaNode, DraftJsShadowViewBaseline);
  }
  
  return self;
}

- (BOOL)isYogaLeafNode
{
  return YES;
}

- (void)dirtyLayout
{
  [self invalidateCache];
  [self.superview dirtyLayout];
  YGNodeMarkDirty(self.yogaNode);
}

- (void)invalidateCache
{
  [_cachedTextStorages removeAllObjects];
  _needsUpdateView = YES;
}

- (NSString *)description
{
  NSString *superDescription = super.description;
  return [[superDescription substringToIndex:superDescription.length - 1] stringByAppendingFormat:@"; text: %@>", [self attributedTextWithBaseTextAttributes:nil].string];
}

- (CGRect)calculateTextFrame:(NSTextStorage *)textStorage
{
  CGRect textFrame = UIEdgeInsetsInsetRect((CGRect){CGPointZero, self.contentFrame.size},
                                           self.compoundInsets);
  
  return textFrame;
}

- (void)uiManagerWillPerformMounting
{
  if (!_needsUpdateView) {
    return;
  }
  _needsUpdateView = NO;
  
  CGRect contentFrame = self.contentFrame;
  NSTextStorage *textStorage = [self textStorageAndLayoutManagerThatFitsSize:self.contentFrame.size
                                                          exclusiveOwnership:YES];
  CGRect textFrame = [self calculateTextFrame:textStorage];
  
  NSNumber *tag = self.reactTag;
  NSMutableArray<NSNumber *> *descendantViewTags = [NSMutableArray new];
  [textStorage enumerateAttribute:kShadowViewAttributeName
                          inRange:NSMakeRange(0, textStorage.length)
                          options:0
                       usingBlock:
   ^(RCTShadowView *shadowView, NSRange range, __unused BOOL *stop) {
     if (!shadowView) {
       return;
     }
     
     [descendantViewTags addObject:shadowView.reactTag];
   }
   ];

  NSString* firstBlockKey = ((RNDJBlockModel*) contentModel.blocks.firstObject).key;
  RNDJDraftJsIndex* firstIndex = firstBlockKey.length > 0 ? [[RNDJDraftJsIndex alloc] initWithKey:firstBlockKey offset:0] : nil;
  
  NSString* lastBlockKey = ((RNDJBlockModel*) contentModel.blocks.lastObject).key;
  NSUInteger lastBlockIndex = ((RNDJBlockModel*) contentModel.blocks.lastObject).text.length - 1;
  RNDJDraftJsIndex* lastIndex = lastBlockKey.length > 0 ? [[RNDJDraftJsIndex alloc] initWithKey:lastBlockKey offset:lastBlockIndex] : nil;
  
  [_bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
    RNDJDraftJSEditor *textView = (RNDJDraftJSEditor *)viewRegistry[tag];
    if (!textView) {
      return;
    }
    
    NSMutableArray<UIView *> *descendantViews =
    [NSMutableArray arrayWithCapacity:descendantViewTags.count];
    [descendantViewTags enumerateObjectsUsingBlock:^(NSNumber *_Nonnull descendantViewTag, NSUInteger index, BOOL *_Nonnull stop) {
      UIView *descendantView = viewRegistry[descendantViewTag];
      if (!descendantView) {
        return;
      }
      
      [descendantViews addObject:descendantView];
    }];
    
    // Removing all references to Shadow Views to avoid unnececery retainning.
//    [textStorage removeAttribute:kShadowViewAttributeName range:NSMakeRange(0, textStorage.length)];
    
    [textView setTextStorage:textStorage
                contentFrame:textFrame
             descendantViews:descendantViews];
    textView.selectable = self.selectable;//self.textAttributes.selectable;
    textView.hasFocus = selectionModel ? selectionModel.hasFocus : NO;
    textView.firstIndex = firstIndex;
    textView.lastIndex = lastIndex;
    textView.selectionStart = selectionModel.startIndex;
    textView.selectionEnd = selectionModel.endIndex;
    textView.contentModel = contentModel;
  }];
}


//- (BOOL)isYogaLeafNode
//{
//  return YES;
//}

//- (void)contentSizeMultiplierDidChange:(NSNotification *)note
//{
//  YGNodeMarkDirty(self.yogaNode);
//  [self dirtyDraftJsText];
//}

- (void)layoutSubviewsWithContext:(RCTLayoutContext)layoutContext
{
  RCTLayoutMetrics layoutMetrics = self.layoutMetrics;
  
  if (layoutMetrics.displayType == RCTDisplayTypeNone) {
    return;
  }
  
  CGFloat availableWidth = self.availableSize.width;
  NSTextStorage *textStorage =
  [self textStorageAndLayoutManagerThatFitsSize:self.availableSize
                             exclusiveOwnership:NO];
  NSLayoutManager *layoutManager = textStorage.layoutManagers.firstObject;
  NSTextContainer *textContainer = layoutManager.textContainers.firstObject;
  NSRange glyphRange = [layoutManager glyphRangeForTextContainer:textContainer];
  NSRange characterRange = [layoutManager characterRangeForGlyphRange:glyphRange actualGlyphRange:NULL];

  [layoutManager.textStorage enumerateAttribute:kShadowViewAttributeName inRange:characterRange options:0 usingBlock:^(RCTShadowView *child, NSRange range, BOOL *_) {
    if (child) {
      YGNodeRef childNode = child.yogaNode;
      float width = YGNodeStyleGetWidth(childNode).value;
      float height = YGNodeStyleGetHeight(childNode).value;
      if (YGFloatIsUndefined(width)) {
        width = self.defaultAtomicWidth;
      }
      if (YGFloatIsUndefined(height)) {
        height = self.defaultAtomicHeight;
      }
      
      //      if (YGFloatIsUndefined(width) || YGFloatIsUndefined(height)) {
      //        RCTLogError(@"Views nested within a <RNDJShadowDraftJsEditor> must have a width and height");
      //      }
      UIFont *font = [textStorage attribute:NSFontAttributeName atIndex:range.location effectiveRange:nil];
      CGRect glyphRect = [layoutManager boundingRectForGlyphRange:range inTextContainer:textContainer];
      CGRect childFrame = {{
        RCTRoundPixelValue(glyphRect.origin.x),
        RCTRoundPixelValue(glyphRect.origin.y + glyphRect.size.height - height + font.descender)
      }, {
        RCTRoundPixelValue(width),
        RCTRoundPixelValue(height)
      }};
      
      NSRange truncatedGlyphRange = [layoutManager truncatedGlyphRangeInLineFragmentForGlyphAtIndex:range.location];
      BOOL viewIsTruncated = NSIntersectionRange(range, truncatedGlyphRange).length != 0;
      
      RCTLayoutContext localLayoutContext = layoutContext;
      localLayoutContext.absolutePosition.x += childFrame.origin.x;
      localLayoutContext.absolutePosition.y += childFrame.origin.y;
      
      [child layoutWithMinimumSize:childFrame.size
                       maximumSize:childFrame.size
                   layoutDirection:self.layoutMetrics.layoutDirection
                     layoutContext:localLayoutContext];

      RCTLayoutMetrics localLayoutMetrics = child.layoutMetrics;
      localLayoutMetrics.frame.origin = childFrame.origin; // Reinforcing a proper frame origin for the Shadow View.
      if (viewIsTruncated) {
        localLayoutMetrics.displayType = RCTDisplayTypeNone;
      }
      [child layoutWithMetrics:localLayoutMetrics layoutContext:localLayoutContext];
    }
  }];
}

- (void)layoutWithMetrics:(RCTLayoutMetrics)layoutMetrics
            layoutContext:(RCTLayoutContext)layoutContext
{
  // If the view got new `contentFrame`, we have to redraw it because
  // and sizes of embedded views may change.
  if (!CGRectEqualToRect(self.layoutMetrics.contentFrame, layoutMetrics.contentFrame)) {
    _needsUpdateView = YES;
  }
  
  if (self.textAttributes.layoutDirection != layoutMetrics.layoutDirection) {
    self.textAttributes.layoutDirection = layoutMetrics.layoutDirection;
    [self invalidateCache];
  }
  
  [super layoutWithMetrics:layoutMetrics layoutContext:layoutContext];
}

//- (void)applyLayoutToChildren:(YGNodeRef)node
//            viewsWithNewFrame:(NSMutableSet<RCTShadowView *> *)viewsWithNewFrame
//             absolutePosition:(CGPoint)absolutePosition
//{
//  // Run layout on subviews.
//  CGFloat availableWidth = self.availableSize.width;
//  NSTextStorage *textStorage = [self buildTextStorageForWidth:availableWidth widthMode:YGMeasureModeExactly];
//  NSLayoutManager *layoutManager = textStorage.layoutManagers.firstObject;
//  NSTextContainer *textContainer = layoutManager.textContainers.firstObject;
//  NSRange glyphRange = [layoutManager glyphRangeForTextContainer:textContainer];
//  NSRange characterRange = [layoutManager characterRangeForGlyphRange:glyphRange actualGlyphRange:NULL];
//  [layoutManager.textStorage enumerateAttribute:kShadowViewAttributeName inRange:characterRange options:0 usingBlock:^(RCTShadowView *child, NSRange range, BOOL *_) {
//    if (child) {
//      YGNodeRef childNode = child.yogaNode;
//      float width = YGNodeStyleGetWidth(childNode).value;
//      float height = YGNodeStyleGetHeight(childNode).value;
//      if (YGFloatIsUndefined(width)) {
//        width = self.defaultAtomicWidth;
//      }
//      if (YGFloatIsUndefined(height)) {
//        height = self.defaultAtomicHeight;
//      }
//
////      if (YGFloatIsUndefined(width) || YGFloatIsUndefined(height)) {
////        RCTLogError(@"Views nested within a <RNDJShadowDraftJsEditor> must have a width and height");
////      }
//      UIFont *font = [textStorage attribute:NSFontAttributeName atIndex:range.location effectiveRange:nil];
//      CGRect glyphRect = [layoutManager boundingRectForGlyphRange:range inTextContainer:textContainer];
//      CGRect childFrame = {{
//        RCTRoundPixelValue(glyphRect.origin.x),
//        RCTRoundPixelValue(glyphRect.origin.y + self.paddingAsInsets.top + glyphRect.size.height - height + font.descender)
//      }, {
//        RCTRoundPixelValue(width),
//        RCTRoundPixelValue(height)
//      }};
//
//      NSRange truncatedGlyphRange = [layoutManager truncatedGlyphRangeInLineFragmentForGlyphAtIndex:range.location];
//      BOOL childIsTruncated = NSIntersectionRange(range, truncatedGlyphRange).length != 0;
//
//      [child collectUpdatedFrames:viewsWithNewFrame
//                        withFrame:childFrame
//                           hidden:childIsTruncated
//                 absolutePosition:absolutePosition];
//    }
//  }];
//}

- (NSDictionary*) mapStyles:(NSDictionary*)styleDictionariesMap {
  NSMutableDictionary* retStyleMap = [NSMutableDictionary new];

  for (NSString* styleKey in [styleDictionariesMap allKeys]) {
    NSDictionary* styleDictionary = [styleDictionariesMap objectForKey:styleKey];
    RNDJStyle* style = [[RNDJStyle alloc] initWithDictionary:styleDictionary];

    if (style) {
      retStyleMap[styleKey] = style;
    }
  }

  return retStyleMap;
}

- (NSAttributedString *)attributedTextWithBaseTextAttributes:(nullable RCTTextAttributes *)baseTextAttributes
{
  if (!_needsUpdateView && _cachedAttributedString && contentModel) {
    return _cachedAttributedString;
  }

  if (!_content) {
    _cachedAttributedString = [[NSAttributedString alloc] initWithString:@""];
    return _cachedAttributedString;
  }

  if (!contentModel) {
    contentModel = [RNDJContentModel fromDictionary:_content];
  }

  if (!selectionModel && _selection) {
    selectionModel = [RNDJSelectionModel fromDictionary:_selection];
  }

  if (!autocompleteModel && _autocomplete) {
    autocompleteModel = [RNDJAutocompleteModel fromDictionary:_autocomplete];
  }

  RNDJStyle* rootStyle = [[RNDJStyle alloc] initWithTextAttributes:self.textAttributes];
  NSDictionary* blockTypeStyles = [self mapStyles:_blockFontTypes];
  NSDictionary* inlineStyles = [self mapStyles:_inlineStyleFontTypes];

  NSMutableAttributedString* contentAttributedString = [NSMutableAttributedString new];

  [contentAttributedString beginEditing];
  NSMutableSet* fullyHighlightedBlocks = [NSMutableSet new];

  BOOL isInHighlightedState = NO;
  NSInteger singleSelectionIndex = -1;

  BOOL isEmpty = YES;
  for (RNDJBlockModel* block in contentModel.blocks) {
    if (!isInHighlightedState && [block.key isEqualToString:selectionModel.startKey] && ![block.key isEqualToString:selectionModel.endKey]) {
      isInHighlightedState = YES;
    } else if (isInHighlightedState && [block.key isEqualToString:selectionModel.endKey]) {
      isInHighlightedState = NO;
    } else if (isInHighlightedState) {
      [fullyHighlightedBlocks addObject:block.key];
    }

    if ([block.text stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]].length > 0 || [block.type isEqualToString:@"atomic"]) {
      isEmpty = NO;
    }
  }

  if (isEmpty) {
    if (selectionModel.hasFocus) {
      singleSelectionIndex = 0;
    } else {
      RNDJStyle* placeholderStyle = rootStyle;
      placeholderStyle = [placeholderStyle applyStyle:[blockTypeStyles objectForKey:@"placeholder"]];

      NSString *placeholderText = _placeholderText ? _placeholderText : @"";
      [self _appendText:placeholderText toAttributedString:contentAttributedString withStyle:placeholderStyle];
    }
  } else {
    NSUInteger atomicBlockIndex = 0;

    for (RNDJBlockModel* block in contentModel.blocks) {
      RNDJStyle* blockStyle = rootStyle;

      NSString* blockType = block.type;
      if ([blockType isEqualToString:@"atomic"]) {
        [self _attachAtomicBlock:block toAttributedString:contentAttributedString withViewIndex:atomicBlockIndex];

        atomicBlockIndex++;
      }

      NSMutableAttributedString* blockAttributedString = [NSMutableAttributedString new];

      if (blockType) {
        RNDJStyle* blockTypeStyle = [blockTypeStyles objectForKey:[blockType toJsStyleName]];
        blockStyle = [blockStyle applyStyle:blockTypeStyle];
      }

      NSString* text = block.text;

      if (text.length == 0) {
        text = blockStyle.placeholderText;
        blockStyle = [blockStyle applyStyle:blockStyle.placeholderStyle];
      }

      NSUInteger startPosition = 0;
      NSUInteger endPosition = 0;

      NSSet* previousInlineStyles = nil;

      CGFloat lastLineHeight = 0;

      while (true) {
        NSMutableSet* currentInlineStyles = [NSMutableSet new];
        BOOL shouldUpdate = NO;
        BOOL shouldBreak = NO;

        if (endPosition >= text.length) {
          if (startPosition != endPosition) {
            shouldUpdate = YES;
          }
          shouldBreak = YES;
        } else {
          for (RNDJInlineStyleRangeModel* inlineStyleRange in block.inlineStyleRanges) {
            if (inlineStyleRange.style && inlineStyleRange.offset <= endPosition && endPosition < (inlineStyleRange.offset + inlineStyleRange.length)) {
              [currentInlineStyles addObject:inlineStyleRange.style];
            }
          }

          if (previousInlineStyles && ![currentInlineStyles isEqualToSet:previousInlineStyles]) {
            shouldUpdate = YES;
          }
        }

        if (shouldUpdate) {
          RNDJStyle* currentStyle = blockStyle;

          NSString* substring = [text substringWithRange:NSMakeRange(startPosition, endPosition - startPosition)];

          for (NSString* inlineStyleKey in currentInlineStyles) {
            currentStyle = [currentStyle applyStyle:[inlineStyles objectForKey:inlineStyleKey]];
          }

          if (currentStyle.lineHeight) {
            if ([currentStyle.allowFontScaling boolValue]) {
              lastLineHeight = [currentStyle.lineHeight floatValue] * [self.textAttributes effectiveFontSizeMultiplier];
            } else {
              lastLineHeight = [currentStyle.lineHeight floatValue];
            }
          }

          [self _appendText:substring toAttributedString:blockAttributedString withStyle:currentStyle];
          startPosition = endPosition;
        }

        if (shouldBreak) {
          break;
        }

        endPosition += 1;
      }

      if (!block.isLastBlock) {
        [self _appendText:@" \n" toAttributedString:blockAttributedString withStyle:blockStyle];
      } else {
        [self _appendText:@" " toAttributedString:blockAttributedString withStyle:blockStyle];
      }


      if (selectionModel.hasFocus)
      {
        BOOL isStartSelectionBlock = [block.key isEqualToString:selectionModel.startKey];
        BOOL isEndSelectionBlock = [block.key isEqualToString:selectionModel.endKey];

        if (isStartSelectionBlock && isEndSelectionBlock)
        {
          if (selectionModel.startOffsetIndex == selectionModel.endOffsetIndex)
          {
            singleSelectionIndex = contentAttributedString.length + selectionModel.startOffsetIndex;
          }
          else
          {
            NSUInteger startOffset = MIN(selectionModel.startOffsetIndex + 1, blockAttributedString.length) - 1;
            NSUInteger endOffset = MIN(selectionModel.endOffsetIndex, blockAttributedString.length - 1);
            NSUInteger selectionSize = endOffset - startOffset;
            if (endOffset > startOffset && selectionSize > 0)
            {
              [blockAttributedString addAttribute:RNDJDraftJsIsHighlightedAttributeName
                                            value:@YES
                                             range:NSMakeRange(startOffset, selectionSize)];
            }
          }
        }
        else
        {
          if (blockAttributedString.length > 0)
          {
            BOOL isFullyHighlighted = [fullyHighlightedBlocks containsObject:block.key];

            if (isFullyHighlighted)
            {
              [blockAttributedString addAttribute:RNDJDraftJsIsHighlightedAttributeName
                                            value:@YES
                                            range:NSMakeRange(0, blockAttributedString.length)];
            }
            else if (isStartSelectionBlock && selectionModel.startOffsetIndex < blockAttributedString.length - 1)
            {
              NSUInteger startOffset = MIN(selectionModel.startOffsetIndex + 1, blockAttributedString.length) - 1;
              [blockAttributedString addAttribute:RNDJDraftJsIsHighlightedAttributeName
                                            value:@YES
                                            range:NSMakeRange(startOffset, blockAttributedString.length - startOffset)];
            }
            else if (isEndSelectionBlock)
            {
              NSUInteger endOffset = MIN(selectionModel.endOffsetIndex, blockAttributedString.length);
              [blockAttributedString addAttribute:RNDJDraftJsIsHighlightedAttributeName
                                            value:@YES
                                            range:NSMakeRange(0, endOffset)];
            }
          }
        }
      }

       for (NSUInteger i = 0; i<blockAttributedString.length; i++) {
        [blockAttributedString addAttribute:RNDJDraftJsIndexAttributeName
                                      value:[[RNDJDraftJsIndex alloc] initWithKey:block.key offset:MIN(i, block.text.length)]
                                      range:NSMakeRange(i, 1)];


      }

      NSUInteger textLength = block.text.length;
      if (autocompleteModel.enabled && [autocompleteModel.blockKey isEqualToString:block.key]) {
        NSUInteger startIndex = MIN(textLength, autocompleteModel.startOffset);
        NSUInteger endIndex = MIN(textLength, autocompleteModel.endOffset);

        RNDJDraftJsIndex* start = [[RNDJDraftJsIndex alloc]
                                   initWithKey:block.key offset:startIndex];
        RNDJDraftJsIndex* end = [[RNDJDraftJsIndex alloc]
                                 initWithKey:block.key offset:endIndex];

        if (startIndex < endIndex) {
          NSRange textRange = NSMakeRange(startIndex, endIndex-startIndex);
          NSString* text = [block.text substringWithRange:textRange];

          if (text.length > 2)
          {
            NSString* suggestedText = [self suggestionFor:text];
            if (suggestedText.length > 0) {
              SimpleAutocorrectInfo* info = [[SimpleAutocorrectInfo alloc]
                                             initWithExistingText:text
                                             start:start
                                             end:end
                                             textSuggestion:suggestedText];

              [blockAttributedString addAttribute:RNDJDraftJsAutocompleteAttributeName
                                            value:info
                                            range:NSMakeRange(startIndex, endIndex-startIndex)];
            }
          }
        }
      }

      [contentAttributedString appendAttributedString:blockAttributedString];
    }
  }

  if (singleSelectionIndex > -1) {
    while (singleSelectionIndex >= contentAttributedString.length) {
      [contentAttributedString appendAttributedString:[[NSAttributedString alloc] initWithString:@" "]];
      NSLog(@"Adding a space to accommodate for selection too long!");
    }

    [contentAttributedString addAttribute:RNDJSingleCursorPositionAttributeName value:@YES range:NSMakeRange(singleSelectionIndex, 1)];
  }
  
  [contentAttributedString endEditing];

  // create a non-mutable attributedString for use by the Text system which avoids copies down the line
  _cachedAttributedString = [[NSAttributedString alloc] initWithAttributedString:contentAttributedString];
  YGNodeMarkDirty(self.yogaNode);

  return _cachedAttributedString;
}

- (NSString*) suggestionFor:(NSString*)text
{
  NSString* lang = @"en_US";

  UITextChecker* textCheck = [[UITextChecker alloc] init];

  NSArray* allWords = [textCheck completionsForPartialWordRange:NSMakeRange(0, text.length)
                                                       inString:text
                                                       language:lang];

  if (allWords.count == 0) {
    allWords = [textCheck guessesForWordRange:NSMakeRange(0, text.length)
                                     inString:text
                                     language:lang];
    if (allWords.count == 0) {
      return nil;
    }
  }

  NSString* word = allWords[0];

  if ([word isEqualToString:text]) {
    return nil;
  }

  return word.length > 0 ? word : nil;
}

- (void) _appendText:(NSString*)text toAttributedString:(NSMutableAttributedString*)outAttributedString withStyle:(RNDJStyle*)style
{
  UIFont *font = [RCTFont updateFont:nil
                          withFamily:style.fontFamily
                                size:style.fontSize
                              weight:style.fontWeight
                               style:style.fontStyle
                             variant:[self.textAttributes fontVariant]
                     scaleMultiplier:[self.textAttributes effectiveFontSizeMultiplier]];

  CGFloat heightOfTallestSubview = 0.0;

  NSMutableDictionary* attributes = [NSMutableDictionary new];

  if (style.color) {
    if (style.opacity) {
      attributes[NSForegroundColorAttributeName] = [style.color colorWithAlphaComponent:CGColorGetAlpha(style.color.CGColor) * [style.opacity floatValue]];
    } else {
      attributes[NSForegroundColorAttributeName] = [style.color colorWithAlphaComponent:CGColorGetAlpha(style.color.CGColor)];
    }
  }

  if (style.backgroundColor) {
    attributes[NSBackgroundColorAttributeName] = [style.backgroundColor colorWithAlphaComponent:CGColorGetAlpha(style.backgroundColor.CGColor) * [style.opacity floatValue]];
  }

  if (font) {
    attributes[NSFontAttributeName] = font;
  }

  if (style.letterSpacing) {
    attributes[NSKernAttributeName] = style.letterSpacing;
  }

  if (self.reactTag) {
    attributes[RNDJDraftJsReactTagAttributeName] = self.reactTag;
  }

  // Text decoration
  if (style.textDecorationLine == RCTTextDecorationLineTypeUnderline ||
      style.textDecorationLine == RCTTextDecorationLineTypeUnderlineStrikethrough) {
    attributes[NSUnderlineStyleAttributeName] = @(style.textDecorationStyle);
  }
  if (style.textDecorationLine == RCTTextDecorationLineTypeStrikethrough ||
      style.textDecorationLine == RCTTextDecorationLineTypeUnderlineStrikethrough){
    attributes[NSStrikethroughStyleAttributeName] = @(style.textDecorationStyle);
  }

  if (style.textDecorationColor) {
    attributes[NSStrikethroughColorAttributeName] = style.textDecorationColor;
    attributes[NSUnderlineColorAttributeName] = style.textDecorationColor;
  }

  // Text shadow
  CGSize textShadowOffset = (style.textShadowOffsetWidth && style.textShadowOffsetHeight) ? CGSizeMake([style.textShadowOffsetWidth floatValue], [style.textShadowOffsetHeight floatValue]) : CGSizeZero;
  if (!CGSizeEqualToSize(textShadowOffset, CGSizeZero)) {
    NSShadow *shadow = [NSShadow new];
    shadow.shadowOffset = textShadowOffset;
    shadow.shadowBlurRadius = [style.textShadowRadius floatValue];
    shadow.shadowColor = style.textShadowColor;
    attributes[NSShadowAttributeName] = shadow;
  }

  NSMutableAttributedString* attributedString = [[NSMutableAttributedString alloc] initWithString:text attributes:attributes];

  [attributedString beginEditing];
  [self _setParagraphStyleOnAttributedString:attributedString
                              fontLineHeight:font.lineHeight
                      heightOfTallestSubview:heightOfTallestSubview
                                   withStyle:style];
  [attributedString endEditing];

  [outAttributedString appendAttributedString:attributedString];
}

- (void) _attachAtomicBlock:(RNDJBlockModel*)block toAttributedString:(NSMutableAttributedString*)outAttributedString withViewIndex:(NSUInteger)viewIndex
{
  NSArray* subviews = [self reactSubviews];
  if (viewIndex >= subviews.count) {
    return;
  }

  RCTShadowView* child = [subviews objectAtIndex:viewIndex];

  float width = YGNodeStyleGetWidth(child.yogaNode).value;
  float height = YGNodeStyleGetHeight(child.yogaNode).value;
  if (YGFloatIsUndefined(width)) {
    width = self.defaultAtomicWidth;
  }
  if (YGFloatIsUndefined(height)) {
    height = self.defaultAtomicHeight;
  }

  NSTextAttachment *attachment = [NSTextAttachment new];
  attachment.bounds = (CGRect){CGPointZero, {width, height+20}};
  NSMutableAttributedString *attachmentString = [NSMutableAttributedString new];
  [attachmentString beginEditing];
  [attachmentString appendAttributedString:[NSAttributedString attributedStringWithAttachment:attachment]];
  [attachmentString appendAttributedString:[[NSAttributedString alloc] initWithString:@" \n"]];
  [attachmentString addAttribute:kShadowViewAttributeName
                           value:child
                           range:NSMakeRange(0, attachmentString.length)];
  [attachmentString addAttribute:RNDJDraftJsIndexAttributeName
                           value:[[RNDJDraftJsIndex alloc] initWithKey:block.key offset:0]
                           range:NSMakeRange(0, attachmentString.length)];
  [attachmentString endEditing];
  [outAttributedString appendAttributedString:attachmentString];

}

//NSTextAttachment *attachment = [NSTextAttachment new];
//NSMutableAttributedString *embeddedShadowViewAttributedString = [NSMutableAttributedString new];
//[embeddedShadowViewAttributedString beginEditing];
//[embeddedShadowViewAttributedString appendAttributedString:[NSAttributedString attributedStringWithAttachment:attachment]];
//[embeddedShadowViewAttributedString addAttribute:RCTBaseTextShadowViewEmbeddedShadowViewAttributeName
//                                           value:shadowView
//                                           range:(NSRange){0, embeddedShadowViewAttributedString.length}];
//[embeddedShadowViewAttributedString endEditing];
//[attributedText appendAttributedString:embeddedShadowViewAttributedString];

// TODO: Move this to run after the block so there can be no conflicting paragraph styles set from inline styles
/*
 * LineHeight works the same way line-height works in the web: if children and self have
 * varying lineHeights, we simply take the max.
 */
- (void)_setParagraphStyleOnAttributedString:(NSMutableAttributedString *)attributedString
                              fontLineHeight:(CGFloat)fontLineHeight
                      heightOfTallestSubview:(CGFloat)heightOfTallestSubview
                                   withStyle:(RNDJStyle*)style
{
  NSRange fullRange = NSMakeRange(0, attributedString.length);

  // check if we have lineHeight set on self
  __block BOOL hasParagraphStyle = NO;
  if ([style.lineHeight floatValue] || style.textAlign) {
    hasParagraphStyle = YES;
  }

  __block float newLineHeight = [style.lineHeight floatValue] ?: 0.0;

  CGFloat fontSizeMultiplier = [style.allowFontScaling boolValue] ? [self.textAttributes effectiveFontSizeMultiplier] : 1.0;

  // check for lineHeight on each of our children, update the max as we go (in self.lineHeight)
  [attributedString enumerateAttribute:NSParagraphStyleAttributeName inRange:(NSRange){0, attributedString.length} options:0 usingBlock:^(id value, NSRange range, BOOL *stop) {
    if (value) {
      NSParagraphStyle *paragraphStyle = (NSParagraphStyle *)value;
      CGFloat maximumLineHeight = round(paragraphStyle.maximumLineHeight / fontSizeMultiplier);
      if (maximumLineHeight > newLineHeight) {
        newLineHeight = maximumLineHeight;
      }
      hasParagraphStyle = YES;
    }
  }];

  NSTextAlignment newTextAlign = style.textAlign ?: NSTextAlignmentNatural;

  // The part below is to address textAlign for RTL language before setting paragraph style
  // Since we can't get layout directly because this logic is currently run just before layout is calculatede
  // We will climb up to the first node which style has been setted as non-inherit
  if (newTextAlign == NSTextAlignmentRight || newTextAlign == NSTextAlignmentLeft) {
    RCTShadowView *view = self;
    while (view != nil && YGNodeStyleGetDirection(view.yogaNode) == YGDirectionInherit) {
      view = [view reactSuperview];
    }
    if (view != nil && YGNodeStyleGetDirection(view.yogaNode) == YGDirectionRTL) {
      if (newTextAlign == NSTextAlignmentRight) {
        newTextAlign = NSTextAlignmentLeft;
      } else if (newTextAlign == NSTextAlignmentLeft) {
        newTextAlign = NSTextAlignmentRight;
      }
    }
  }

  // if we found anything, set it :D
  if (hasParagraphStyle || _paragraphSpacing > 0) {
    NSMutableParagraphStyle *paragraphStyle = [NSMutableParagraphStyle new];
    paragraphStyle.alignment = style.textAlign;
    paragraphStyle.baseWritingDirection = NSWritingDirectionNatural;
    CGFloat lineHeight = round(newLineHeight * fontSizeMultiplier);
    if (heightOfTallestSubview > lineHeight) {
      lineHeight = ceilf(heightOfTallestSubview);
    }
    paragraphStyle.minimumLineHeight = lineHeight;
    paragraphStyle.maximumLineHeight = lineHeight;
    paragraphStyle.paragraphSpacing = _paragraphSpacing;
    [attributedString addAttribute:NSParagraphStyleAttributeName
                             value:paragraphStyle
                             range:fullRange];

    if (lineHeight > fontLineHeight) {
      [attributedString addAttribute:NSBaselineOffsetAttributeName
                               value:@(lineHeight / 2 - fontLineHeight / 2)
                               range:fullRange];
    }
  }
}

#pragma mark Autosizing

- (void) setContent:(NSDictionary *)content
{
  contentModel = nil;
  _content = content;
  [self dirtyLayout];
}

- (void) setSelection:(NSDictionary *)selection
{
  selectionModel = nil;
  _selection = selection;
  [self dirtyLayout];
}

- (void) setAutocomplete:(NSDictionary *)autocomplete
{
  autocompleteModel = nil;
  _autocomplete = autocomplete;
  [self dirtyLayout];
}

- (void) setSelectable:(BOOL)selectable
{
  _selectable = selectable;
  [self dirtyLayout];
}

- (NSDictionary*) content
{
  return _content;
}

- (NSAttributedString *)attributedTextWithMeasuredAttachmentsThatFitSize:(CGSize)size
{
  NSMutableAttributedString *attributedText =
  [[NSMutableAttributedString alloc] initWithAttributedString:[self attributedTextWithBaseTextAttributes:nil]];
  
  [attributedText beginEditing];
  
  [attributedText enumerateAttribute:RCTBaseTextShadowViewEmbeddedShadowViewAttributeName
                             inRange:NSMakeRange(0, attributedText.length)
                             options:0
                          usingBlock:
   ^(RCTShadowView *shadowView, NSRange range, __unused BOOL *stop) {
     if (!shadowView) {
       return;
     }
     
     CGSize fittingSize = [shadowView sizeThatFitsMinimumSize:CGSizeZero
                                                  maximumSize:size];
     NSTextAttachment *attachment = [NSTextAttachment new];
     attachment.bounds = (CGRect){CGPointZero, fittingSize};
     [attributedText addAttribute:NSAttachmentAttributeName value:attachment range:range];
   }
   ];
  
  [attributedText endEditing];
  
  return [attributedText copy];
}

- (void)postprocessAttributedText:(NSMutableAttributedString *)attributedText
{
  __block CGFloat maximumLineHeight = 0;
  
  [attributedText enumerateAttribute:NSParagraphStyleAttributeName
                             inRange:NSMakeRange(0, attributedText.length)
                             options:NSAttributedStringEnumerationLongestEffectiveRangeNotRequired
                          usingBlock:
   ^(NSParagraphStyle *paragraphStyle, __unused NSRange range, __unused BOOL *stop) {
     if (!paragraphStyle) {
       return;
     }
     
     maximumLineHeight = MAX(paragraphStyle.maximumLineHeight, maximumLineHeight);
   }
   ];
  
  if (maximumLineHeight == 0) {
    // `lineHeight` was not specified, nothing to do.
    return;
  }
  
  __block CGFloat maximumFontLineHeight = 0;
  
  [attributedText enumerateAttribute:NSFontAttributeName
                             inRange:NSMakeRange(0, attributedText.length)
                             options:NSAttributedStringEnumerationLongestEffectiveRangeNotRequired
                          usingBlock:
   ^(UIFont *font, NSRange range, __unused BOOL *stop) {
     if (!font) {
       return;
     }
     
     if (maximumFontLineHeight <= font.lineHeight) {
       maximumFontLineHeight = font.lineHeight;
     }
   }
   ];
  
  if (maximumLineHeight < maximumFontLineHeight) {
    return;
  }
  
  CGFloat baseLineOffset = maximumLineHeight / 2.0 - maximumFontLineHeight / 2.0;
  
  [attributedText addAttribute:NSBaselineOffsetAttributeName
                         value:@(baseLineOffset)
                         range:NSMakeRange(0, attributedText.length)];
}

- (NSTextStorage *)textStorageAndLayoutManagerThatFitsSize:(CGSize)size
                                        exclusiveOwnership:(BOOL)exclusiveOwnership
{
  NSValue *key = [NSValue valueWithCGSize:size];
  NSTextStorage *cachedTextStorage = [_cachedTextStorages objectForKey:key];
  
  if (cachedTextStorage) {
    if (exclusiveOwnership) {
      [_cachedTextStorages removeObjectForKey:key];
    }
    
    return cachedTextStorage;
  }
  
  NSTextContainer *textContainer = [[NSTextContainer alloc] initWithSize:size];
  
  textContainer.lineFragmentPadding = 0.0; // Note, the default value is 5.
  textContainer.lineBreakMode = NSLineBreakByWordWrapping;
  textContainer.maximumNumberOfLines = 0;
  
  NSLayoutManager *layoutManager = [NSLayoutManager new];
  [layoutManager addTextContainer:textContainer];
  
  NSTextStorage *textStorage =
  [[NSTextStorage alloc] initWithAttributedString:[self attributedTextWithMeasuredAttachmentsThatFitSize:size]];
  
  [self postprocessAttributedText:textStorage];
  
  [textStorage addLayoutManager:layoutManager];
  
  if (!exclusiveOwnership) {
    [_cachedTextStorages setObject:textStorage forKey:key];
  }
  
  return textStorage;
}

static YGSize DraftJsShadowViewMeasure(YGNodeRef node, float width, YGMeasureMode widthMode, float height, YGMeasureMode heightMode)
{
  CGSize maximumSize = (CGSize){
    widthMode == YGMeasureModeUndefined ? CGFLOAT_MAX : RCTCoreGraphicsFloatFromYogaFloat(width),
    heightMode == YGMeasureModeUndefined ? CGFLOAT_MAX : RCTCoreGraphicsFloatFromYogaFloat(height),
  };
  
  RNDJShadowDraftJSEditor *shadowTextView = (__bridge RNDJShadowDraftJSEditor *)YGNodeGetContext(node);
  
  NSTextStorage *textStorage =
  [shadowTextView textStorageAndLayoutManagerThatFitsSize:maximumSize
                                       exclusiveOwnership:NO];
  
  NSLayoutManager *layoutManager = textStorage.layoutManagers.firstObject;
  NSTextContainer *textContainer = layoutManager.textContainers.firstObject;
  [layoutManager ensureLayoutForTextContainer:textContainer];
  CGSize size = [layoutManager usedRectForTextContainer:textContainer].size;
  
  CGFloat letterSpacing = shadowTextView.textAttributes.letterSpacing;
  if (!isnan(letterSpacing) && letterSpacing < 0) {
    size.width -= letterSpacing;
  }
  
  size = (CGSize){
    MIN(RCTCeilPixelValue(size.width), maximumSize.width),
    MIN(RCTCeilPixelValue(size.height), maximumSize.height)
  };
  
  // Adding epsilon value illuminates problems with converting values from
  // `double` to `float`, and then rounding them to pixel grid in Yoga.
  CGFloat epsilon = 0.001;
  return (YGSize){
    RCTYogaFloatFromCoreGraphicsFloat(size.width + epsilon),
    RCTYogaFloatFromCoreGraphicsFloat(size.height + epsilon)
  };
}

- (CGFloat)lastBaselineForSize:(CGSize)size
{
  NSAttributedString *attributedText =
  [self textStorageAndLayoutManagerThatFitsSize:size exclusiveOwnership:NO];
  
  __block CGFloat maximumDescender = 0.0;
  
  [attributedText enumerateAttribute:NSFontAttributeName
                             inRange:NSMakeRange(0, attributedText.length)
                             options:NSAttributedStringEnumerationLongestEffectiveRangeNotRequired
                          usingBlock:
   ^(UIFont *font, NSRange range, __unused BOOL *stop) {
     if (maximumDescender > font.descender) {
       maximumDescender = font.descender;
     }
   }
   ];
  
  return size.height + maximumDescender;
}

static float DraftJsShadowViewBaseline(YGNodeRef node, const float width, const float height)
{
  RNDJShadowDraftJSEditor *shadowTextView = (__bridge RNDJShadowDraftJSEditor *)YGNodeGetContext(node);
  
  CGSize size = (CGSize){
    RCTCoreGraphicsFloatFromYogaFloat(width),
    RCTCoreGraphicsFloatFromYogaFloat(height)
  };
  
  CGFloat lastBaseline = [shadowTextView lastBaselineForSize:size];
  
  return RCTYogaFloatFromCoreGraphicsFloat(lastBaseline);
}

@end

NSDictionary* blockTypesMap = nil;

@implementation NSString(DraftJsBlockTypesMap)

- (NSString*) toJsStyleName {
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    blockTypesMap = @{
                      @"header-one": @"headerOne",
                      @"header-two": @"headerTwo",
                      @"header-three": @"headerThree",
                      @"header-four": @"headerFour",
                      @"header-five": @"headerFive",
                      @"header-six": @"headerSix",
                      @"code-block": @"codeBlock",
                      };
  });

  NSString* styleName = [blockTypesMap objectForKey:self];
  return styleName ? styleName : self;
}

@end
