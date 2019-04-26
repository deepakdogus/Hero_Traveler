//
//  RCTShadowView+DraftJSDirty.h
//  RNDraftJs
//
//  Created by Andrew Beck on 10/24/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTShadowView.h>

@interface RCTShadowView (DraftJSDirty)

//- (void) dirtyDraftJsText;
//- (BOOL) isDraftJsTextDirty;
//- (void) setDraftJsTextComputed;
- (void)collectUpdatedFrames:(NSMutableSet<RCTShadowView *> *)viewsWithNewFrame
                   withFrame:(CGRect)frame
            absolutePosition:(CGPoint)absolutePosition;
@end
