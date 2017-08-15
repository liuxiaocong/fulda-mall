//
//  FDLocationServices.m
//  FuldaMallProject
//
//  Created by XieChao on 20/4/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

// https://github.com/agrass/react-native-gps/blob/master/RNLocation.m

#import <CoreLocation/CoreLocation.h>

#import <React/RCTBridge.h>
#import <React/RCTConvert.h>
#import <React/RCTEventDispatcher.h>

#import "FDLocationServices.h"

@interface FDLocationServices () <CLLocationManagerDelegate>

@property(strong, nonatomic) CLLocationManager *locationManager;

@end

@implementation FDLocationServices

RCT_EXPORT_MODULE(FDLocationServices)

NSDictionary *_configMap;
RCTPromiseResolveBlock _resolve;
RCTPromiseRejectBlock _reject;
CLAuthorizationStatus _status;

#pragma mark Initialization

- (instancetype)init {
  if (self = [super init]) {
    self.locationManager = [[CLLocationManager alloc] init];
    self.locationManager.delegate = self;
  }

  return self;
}

#pragma mark RCT_EXPORT_METHOD

RCT_EXPORT_METHOD(getLocation
                  : (NSDictionary *)configMap
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {

  _configMap = configMap;
  _resolve = resolve;
  _reject = reject;

  if (_status == kCLAuthorizationStatusDenied) {
    NSError *err =
        [NSError errorWithDomain:@"FDLocationServices" code:-1 userInfo:nil];
    _reject(@"-1", @"location service is disabled", err);
    _reject = nil;
  } else if (_status == kCLAuthorizationStatusAuthorizedWhenInUse) {
    [self startUpdatingLocation];
  } else {
    [self.locationManager requestWhenInUseAuthorization];
  }
}

RCT_EXPORT_METHOD(cancelGetLocation) { [self stopUpdatingLocation]; }

RCT_EXPORT_METHOD(requestAlwaysAuthorization) {
  NSLog(@"react-native-location: requestAlwaysAuthorization");
  [self.locationManager requestAlwaysAuthorization];
}

RCT_EXPORT_METHOD(requestWhenInUseAuthorization) {
  NSLog(@"react-native-location: requestWhenInUseAuthorization");
  [self.locationManager requestWhenInUseAuthorization];
}

RCT_EXPORT_METHOD(getAuthorizationStatus : (RCTResponseSenderBlock)callback) {
  callback(@[ [self
      nameForAuthorizationStatus:[CLLocationManager authorizationStatus]] ]);
}

RCT_EXPORT_METHOD(setDesiredAccuracy : (double)accuracy) {
  self.locationManager.desiredAccuracy = accuracy;
}

RCT_EXPORT_METHOD(setDistanceFilter : (double)distance) {
  self.locationManager.distanceFilter = distance;
}

RCT_EXPORT_METHOD(setAllowsBackgroundLocationUpdates : (BOOL)enabled) {
  self.locationManager.allowsBackgroundLocationUpdates = enabled;
}

RCT_EXPORT_METHOD(startMonitoringSignificantLocationChanges) {
  NSLog(@"react-native-location: startMonitoringSignificantLocationChanges");
  [self.locationManager startMonitoringSignificantLocationChanges];
}

RCT_EXPORT_METHOD(startUpdatingHeading) {
  [self.locationManager startUpdatingHeading];
}

RCT_EXPORT_METHOD(stopMonitoringSignificantLocationChanges) {
  [self.locationManager stopMonitoringSignificantLocationChanges];
}

RCT_EXPORT_METHOD(stopUpdatingHeading) {
  [self.locationManager stopUpdatingHeading];
}

#pragma mark function

- (void)startUpdatingLocation {
  NSLog(@"startUpdatingLocation");

  self.locationManager.distanceFilter = kCLDistanceFilterNone;
  self.locationManager.desiredAccuracy = kCLLocationAccuracyBest;

  self.locationManager.pausesLocationUpdatesAutomatically = NO;

  [self.locationManager startUpdatingLocation];
}

- (void)stopUpdatingLocation {
  NSLog(@"stopUpdatingLocation");
  [self.locationManager stopUpdatingLocation];
}

- (NSString *)nameForAuthorizationStatus:
    (CLAuthorizationStatus)authorizationStatus {
  switch (authorizationStatus) {
  case kCLAuthorizationStatusAuthorizedAlways:
    NSLog(@"Authorization Status: authorizedAlways");
    return @"authorizedAlways";

  case kCLAuthorizationStatusAuthorizedWhenInUse:
    NSLog(@"Authorization Status: authorizedWhenInUse");
    return @"authorizedWhenInUse";

  case kCLAuthorizationStatusDenied:
    NSLog(@"Authorization Status: denied");
    return @"denied";

  case kCLAuthorizationStatusNotDetermined:
    NSLog(@"Authorization Status: notDetermined");
    return @"notDetermined";

  case kCLAuthorizationStatusRestricted:
    NSLog(@"Authorization Status: restricted");
    return @"restricted";
  }
}

#pragma mark CLLocationManager Delegate

- (void)locationManager:(CLLocationManager *)manager
     didUpdateLocations:(NSArray *)locations {
  NSLog(@"didUpdateLocations");

  CLLocation *location = [locations lastObject];
  NSDictionary *locationEvent = @{
    @"latitude" : @(location.coordinate.latitude),
    @"longitude" : @(location.coordinate.longitude),
    @"altitude" : @(location.altitude),
    @"accuracy" : @(location.horizontalAccuracy),
    @"altitudeAccuracy" : @(location.verticalAccuracy),
    @"course" : @(location.course),
    @"speed" : @(location.speed),
    @"timestamp" : @([location.timestamp timeIntervalSince1970] * 1000) // in ms
  };

  if (_resolve) {
    _resolve(locationEvent);
    _resolve = nil;
    [self stopUpdatingLocation];
  }
}

- (void)locationManager:(CLLocationManager *)manager
       didFailWithError:(NSError *)error {
  NSLog(@"didFailWithError");

  _reject(nil, nil, error);
  [self stopUpdatingLocation];
}

- (void)locationManager:(CLLocationManager *)manager
    didChangeAuthorizationStatus:(CLAuthorizationStatus)status {
  //  NSLog(@"didChangeAuthorizationStatus");
  _status = status;

  switch (status) {
  case kCLAuthorizationStatusAuthorizedAlways:
    NSLog(@"Authorization Status: authorizedAlways");
    break;

  case kCLAuthorizationStatusAuthorizedWhenInUse:
    NSLog(@"Authorization Status: authorizedWhenInUse");
    [self startUpdatingLocation];
    break;

  case kCLAuthorizationStatusDenied:
    NSLog(@"Authorization Status: denied");
    if (_reject != nil) {
      NSError *err =
          [NSError errorWithDomain:@"FDLocationServices" code:-1 userInfo:nil];
      _reject(@"-1", @"location service is disabled", err);
      _reject = nil;
    }
    break;

  case kCLAuthorizationStatusNotDetermined:
    NSLog(@"Authorization Status: notDetermined");
    break;

  case kCLAuthorizationStatusRestricted:
    NSLog(@"Authorization Status: restricted");
    break;
  }
}

- (void)locationManager:(CLLocationManager *)manager
       didUpdateHeading:(CLHeading *)newHeading {
  NSLog(@"didUpdateHeading");
}

@end
