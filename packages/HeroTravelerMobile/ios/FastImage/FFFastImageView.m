#import "FFFastImageView.h"

@implementation FFFastImageView {
    BOOL hasSentOnLoadStart;
}

- (void)setResizeMode:(RCTResizeMode)resizeMode
{
    if (_resizeMode != resizeMode) {
        _resizeMode = resizeMode;
        self.contentMode = (UIViewContentMode)resizeMode;
    }
}

- (void)setOnFastImageLoadStart:(RCTBubblingEventBlock)onFastImageLoadStart {
    if (_source && !hasSentOnLoadStart) {
        _onFastImageLoadStart = onFastImageLoadStart;
        onFastImageLoadStart(@{});
        hasSentOnLoadStart = YES;
    } else {
        _onFastImageLoadStart = onFastImageLoadStart;
        hasSentOnLoadStart = NO;
    }
}

- (void) dealloc
{
  [self sd_cancelCurrentImageLoad];
//  NSLog(@"Deallocing fast image");
}

- (void)setSource:(FFFastImageSource *)source {
    if (_source != source) {
        _source = source;

        // Set headers.
        [_source.headers enumerateKeysAndObjectsUsingBlock:^(NSString *key, NSString* header, BOOL *stop) {
            [[SDWebImageDownloader sharedDownloader] setValue:header forHTTPHeaderField:key];
        }];

        // Set priority.
        SDWebImageOptions options = 0;
        options |= SDWebImageRetryFailed;
        switch (_source.priority) {
            case FFFPriorityLow:
                options |= SDWebImageLowPriority;
                break;
            case FFFPriorityNormal:
                // Priority is normal by default.
                break;
            case FFFPriorityHigh:
                options |= SDWebImageHighPriority;
                break;
        }

        if (_onFastImageLoadStart) {
            _onFastImageLoadStart(@{});
            hasSentOnLoadStart = YES;
        } {
            hasSentOnLoadStart = NO;
        }

//      [self sd_internalSetImageWithURL:url
//                      placeholderImage:placeholder
//                               options:options
//                          operationKey:nil
//                         setImageBlock:nil
//                              progress:progressBlock
//                             completed:completedBlock];
        // Load the new s ource.
      
      RCTDirectEventBlock onFastImageProgress = _onFastImageProgress;
      RCTDirectEventBlock onFastImageError = _onFastImageError;
      RCTDirectEventBlock onFastImageLoad = _onFastImageLoad;
      RCTDirectEventBlock onFastImageLoadEnd = _onFastImageLoadEnd;

      [self sd_internalSetImageWithURL:_source.uri
                      placeholderImage:nil
                               options:options
                          operationKey:_source.operationKey
                         setImageBlock:nil
                              progress:^(NSInteger receivedSize, NSInteger expectedSize, NSURL * _Nullable targetURL) {
                                double progress = MIN(1, MAX(0, (double) receivedSize / (double) expectedSize));
                                if (onFastImageProgress) {
                                  onFastImageProgress(@{
                                                         @"loaded": @(receivedSize),
                                                         @"total": @(expectedSize)
                                                         });
                                }
                              }
                             completed:^(UIImage * _Nullable image,
                                         NSError * _Nullable error,
                                         SDImageCacheType cacheType,
                                         NSURL * _Nullable imageURL) {
                               if (error) {
                                 if (onFastImageError) {
                                   onFastImageError(@{});
                                   if (onFastImageLoadEnd) {
                                     onFastImageLoadEnd(@{});
                                   }
                                 }
                               } else {
                                 if (onFastImageLoad) {
                                   onFastImageLoad(@{});
                                   if (onFastImageLoadEnd) {
                                     onFastImageLoadEnd(@{});
                                   }
                                 }
                               }
                             }];
    }
}

@end

