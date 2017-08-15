//
//  FDConfig.m
//  Learnium
//
//  Created by Rebecca Hughes on 03/08/2015.
//  Copyright © 2015 Learnium Limited. All rights reserved.
//

#import "FDConfig.h"

@interface FDConfig()
@property(strong, nonatomic) NSDictionary *config;
@property(nonatomic, strong, readonly) NSString *hockAppAppIdentifier;
@property(nonatomic, strong, readonly) NSString *googleAPIKey;
@end



@implementation FDConfig

@synthesize hockAppAppIdentifier = _hockAppAppIdentifier;
@synthesize googleAPIKey = _googleAPIKey;

+ (NSString *)hockAppAppIdentifier {
  return [[[FDConfig alloc] init] hockAppAppIdentifier];
}
  
+ (NSString *)googleAPIKey {
  return [[[FDConfig alloc] init] googleAPIKey];
}

RCT_EXPORT_MODULE(FDConfig)


- (instancetype)init {
  if (self = [super init]) {
    self.config = [self readValueFromConfigurationFile];
    _hockAppAppIdentifier = nil;
    _googleAPIKey = nil;
  }
  
  return self;
}

- (NSString *)hockAppAppIdentifier {
  return self.config[@"hock_app_app_identifier"];
}
  
- (NSString *)googleAPIKey {
  return self.config[@"google_api_key"];
}

- (NSDictionary *)constantsToExport
{
  NSString * versionName = [[NSBundle mainBundle] objectForInfoDictionaryKey: @"CFBundleShortVersionString"];
  
  return @{
           @"api_domain": self.config[@"api_domain"],
           @"web_domain": self.config[@"web_domain"],
           @"google_api_key": self.config[@"google_api_key"],
           @"gcm_sender_id": self.config[@"gcm_sender_id"],
           @"version_name": versionName,
           };
}

- (NSDictionary *) readValueFromConfigurationFile {
  
  NSBundle *bundle = [NSBundle mainBundle];
  
  NSString *path = [bundle pathForResource:@"Configuration" ofType:@"plist"];
  
  NSDictionary *config = [NSDictionary dictionaryWithContentsOfFile:path];
  
  return config;
}

@end
