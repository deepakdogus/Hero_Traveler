#import "FFFastImageSource.h"

@implementation FFFastImageSource

- (instancetype)initWithURL:(NSURL *)url
                   priority:(FFFPriority)priority
                    headers:(NSDictionary *)headers
               operationKey:(NSString*)operationKey
{
    self = [super init];
    if (self) {
        _uri = url;
        _priority = priority;
        _headers = headers;
        _operationKey = operationKey;
    }
    return self;
}

@end
