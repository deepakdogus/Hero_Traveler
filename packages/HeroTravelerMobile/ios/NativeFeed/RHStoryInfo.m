#import "RHStoryInfo.h"

@implementation RHStoryInfo

- (instancetype) initWithDictionary:(NSDictionary*)infoDict
{
  if (self = [super init])
  {
    NSString* headerImageString = [infoDict objectForKey:@"headerImage"];
    
    if ([headerImageString isKindOfClass:[NSString class]])
    {
      self.headerImage = [NSURL URLWithString:headerImageString];
    }
    else if ([headerImageString isKindOfClass:[NSURL class]])
    {
      self.headerImage = (NSURL*) headerImageString;
    }
    else
    {
      self.headerImage = nil;
    }
    
    self.height = [[infoDict objectForKey:@"height"] floatValue];
  }
  return self;
}

- (BOOL) isEqualToStoryInfo:(RHStoryInfo*)other
{
  if (!other)
  {
    return NO;
  }
  
  if ((!self.headerImage && !other.headerImage) ||
      ([self.headerImage.absoluteString isEqualToString:other.headerImage.absoluteString]))
  {
    
  }
  else
  {
    return NO;
  }
  
  return fabs(self.height - other.height) < 0.5f;
}

@end

