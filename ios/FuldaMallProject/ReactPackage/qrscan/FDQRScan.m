//
//  FDQRScan.m
//  FuldaMallProject
//
//  Created by XieChao on 20/4/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

// https://github.com/agrass/react-native-gps/blob/master/RNLocation.m


#import <React/RCTBridge.h>
#import <React/RCTConvert.h>
#import <React/RCTEventDispatcher.h>
#import <ZXLuminanceSource.h>
#import <ZXCGImageLuminanceSource.h>
#import <ZXBinaryBitmap.h>
#import <ZXHybridBinarizer.h>
#import <ZXDecodeHints.h>
#import <ZXMultiFormatReader.h>
#import <ZXResult.h>

#import "FDQRScan.h"

@interface FDQRScan () 


@end

@implementation FDQRScan

RCT_EXPORT_MODULE(FDQRScan)


#pragma mark Initialization

- (instancetype)init {
  if (self = [super init]) {
  }

  return self;
}

#pragma mark RCT_EXPORT_METHOD

RCT_EXPORT_METHOD(decodeQRCode
                  : (NSDictionary *)configMap
                  : (RCTPromiseResolveBlock)resolve
                  : (RCTPromiseRejectBlock)reject) {
  
  NSString *path = [configMap objectForKey:@"path"];

//  CGDataProviderRef imgDataProvider = CGDataProviderCreateWithCFData((CFDataRef)[NSData dataWithContentsOfFile:path]);
  
  CGDataProviderRef dataProvider = CGDataProviderCreateWithFilename([path UTF8String]);
  CGImageRef imageToDecode = CGImageCreateWithJPEGDataProvider(dataProvider, NULL, NO, kCGRenderingIntentDefault);
  
//  CGImageRef imageToDecode = CGImageCreateWithPNGDataProvider(imgDataProvider, NULL, true, kCGRenderingIntentDefault);  // Given a CGImage in which we are looking for barcodes
  
  ZXLuminanceSource *source = [[ZXCGImageLuminanceSource alloc] initWithCGImage:imageToDecode];
  ZXBinaryBitmap *bitmap = [ZXBinaryBitmap binaryBitmapWithBinarizer:[ZXHybridBinarizer binarizerWithSource:source]];
  
  NSError *error = nil;
  
  // There are a number of hints we can give to the reader, including
  // possible formats, allowed lengths, and the string encoding.
  ZXDecodeHints *hints = [ZXDecodeHints hints];
  
  ZXMultiFormatReader *reader = [ZXMultiFormatReader reader];
  ZXResult *result = [reader decode:bitmap
                              hints:hints
                              error:&error];
  if (result) {
    // The coded result as a string. The raw data can be accessed with
    // result.rawBytes and result.length.

    NSDictionary *result1 = @{ @"data" : result.text};
    
    if (resolve) {
      resolve(result1);
      resolve = nil;
    }
  } else {
    // Use error to determine why we didn't get a result, such as a barcode
    // not being found, an invalid checksum, or a format inconsistency.
      if (reject)
      {
        reject(@"-1", @"Failed to parse", error);
        reject = nil;
      }
  }
}

@end
