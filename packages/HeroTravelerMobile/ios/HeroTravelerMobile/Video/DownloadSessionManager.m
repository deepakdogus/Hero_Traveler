#import "DownloadSessionManager.h"
#import "VideoDownloadItem.h"

@interface DownloadListenerPair : NSObject

- (instancetype) initWithItem:(VideoDownloadItem*)item task:(NSURLSessionDownloadTask*)task;

@property(readonly, weak) VideoDownloadItem* item;
@property(readonly, weak) NSURLSessionDownloadTask* task;

@end

@implementation DownloadListenerPair

- (instancetype) initWithItem:(VideoDownloadItem*)item task:(NSURLSessionDownloadTask*)task
{
  if (self = [super init])
  {
    _item = item;
    _task = task;
  }

  return self;
}

@end

@interface DownloadSessionManager()
{
  NSURLSession* mediaSession;
}

@end

@implementation DownloadSessionManager
//{
//  NSArray* listenerPairs;
//}

+ (instancetype) get
{
  static DownloadSessionManager* sharedInstance = nil;
  static dispatch_once_t pred;
  
  if (sharedInstance)
  {
    return sharedInstance;
  }
  
  dispatch_once(&pred, ^{
    sharedInstance = [DownloadSessionManager alloc];
    sharedInstance = [sharedInstance init];
  });
  
  return sharedInstance;
}

- (instancetype) init
{
  if (self = [super init])
  {
    NSURLSessionConfiguration* sessionConfiguration = [self mediaSessionConfiguration];
    mediaSession = [NSURLSession sessionWithConfiguration:sessionConfiguration
                                                 delegate:self
                                            delegateQueue:[NSOperationQueue mainQueue]];
  }

  return self;
}

- (void) registerItem:(VideoDownloadItem*)item forTask:(NSURLSessionDownloadTask*)task
{
  [self unregisterItem:item forTask:task];
  
  DownloadListenerPair* pair = [[DownloadListenerPair alloc] initWithItem:item task:task];

  NSMutableArray* mListenerPairs = [listenerPairs mutableCopy];
  [mListenerPairs addObject:pair];
  listenerPairs = [NSArray arrayWithArray:mListenerPairs];
}

- (void) unregisterItem:(VideoDownloadItem*)item forTask:(NSURLSessionDownloadTask*)task
{
  NSMutableArray* mListenerPairs = [@[] mutableCopy];

  for (DownloadListenerPair* pair in listenerPairs)
  {
    if (pair.item && pair.task && pair.item != item && pair.task != task)
    {
       [mListenerPairs addObject:pair];
    }
  }

  listenerPairs = [NSArray arrayWithArray:mListenerPairs];
}

- (NSURLSession*) mediaSession
{
  return mediaSession;
}

+ (NSURLSession*) mediaSession
{
  return [[DownloadSessionManager get] mediaSession];
}

+ (void) registerItem:(VideoDownloadItem*)item forTask:(NSURLSessionDownloadTask*)task
{
  [[DownloadSessionManager get] registerItem:item forTask:task];
}

+ (void) unregisterItem:(VideoDownloadItem*)item forTask:(NSURLSessionDownloadTask*)task
{
  [[DownloadSessionManager get] unregisterItem:item forTask:task];
}

- (NSURLSessionConfiguration*) mediaSessionConfiguration
{
  return [NSURLSessionConfiguration backgroundSessionConfigurationWithIdentifier:@"com.hero-traveller.media-download"];
}

- (void)URLSession:(NSURLSession *)session downloadTask:(NSURLSessionDownloadTask *)downloadTask didFinishDownloadingToURL:(NSURL *)location
{
  for (DownloadListenerPair* pair in listenerPairs)
  {
    if (pair.task == downloadTask)
    {
      [pair.item URLSession:session downloadTask:downloadTask didFinishDownloadingToURL:location];
    }
  }
}

- (void) URLSession:(NSURLSession*)session task:(NSURLSessionTask*)task didCompleteWithError:(nullable NSError*)error
{
  for (DownloadListenerPair* pair in listenerPairs)
  {
    if (pair.task == task)
    {
      [pair.item URLSession:session task:task didCompleteWithError:error];
    }
  }
}

@end

