#import <UIKit/UIKit.h>
#import <sys/utsname.h>

#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <React/RCTBridgeModule.h>
#endif

@interface FDConfig : NSObject <RCTBridgeModule>
+ (NSString *)hockAppAppIdentifier;
+ (NSString *)googleAPIKey;
@end
