//
//  RHNativeFeedPrefetcher.h
//  HeroTravelerMobile
//
//  Created by Andrew Beck on 5/2/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <SDWebImage/SDWebImagePrefetcher.h>

@class RHNativeFeedPrefetcher;

@protocol RHNativeFeedPrefetcherDelegate

- (void) prefetcher:(RHNativeFeedPrefetcher*)prefetcher updatedCachedImages:(NSSet*)cachedImages;

@end

@interface RHNativeFeedPrefetcher : NSObject<SDWebImagePrefetcherDelegate>
{
  NSSet* imagesPendingCheck;
  NSSet* imagesPendingDownload;
  NSSet* imagesFailedDownload;
  
  BOOL _invalidated;
}

- (instancetype) initWithImagesToPrefetch:(NSSet*)imagesToPrefetch delegate:(NSObject<RHNativeFeedPrefetcherDelegate>*)delegate;

@property(nonatomic, weak, readonly) NSObject<RHNativeFeedPrefetcherDelegate>* delegate;

@property(nonatomic, strong) NSSet* imagesToPrefetch;
@property(nonatomic, strong) NSSet* loadedImages;

- (void) invalidate;

@end
