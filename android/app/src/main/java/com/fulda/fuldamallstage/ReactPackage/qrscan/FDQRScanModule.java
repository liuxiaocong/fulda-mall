package com.fulda.fuldamallstage.ReactPackage.qrscan;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.support.annotation.NonNull;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.fulda.fuldamallstage.observer.ScanLocalQRObservable;
import com.google.zxing.Result;

import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.functions.Consumer;
import io.reactivex.schedulers.Schedulers;
import me.dm7.barcodescanner.zxing.ZXingScannerView;

class FDQRScanModule extends ReactContextBaseJavaModule implements ActivityEventListener {
    private static final String TAG = FDQRScanModule.class.getSimpleName();
    private static final String REACT_CLASS = "FDQRScan";


    FDQRScanModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(this);
    }

    @Override
    public void onNewIntent(Intent intent) {
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactMethod
    public void decodeQRCode(final ReadableMap configMap, final Promise promise) {
        final Activity currentActivity = getCurrentActivity();
        if (currentActivity != null) {
            currentActivity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Uri uri = Uri.parse(configMap.getString("path"));

                    ScanLocalQRObservable.getObserver(uri.getPath(), ZXingScannerView.ALL_FORMATS)
                            .subscribeOn(AndroidSchedulers.mainThread())
                            .observeOn(Schedulers.io())
                            .subscribe(
                                    new Consumer<Result>() {
                                        @Override
                                        public void accept(@NonNull Result result) throws Exception {
                                            if (promise != null) {
                                                WritableMap params = Arguments.createMap();
                                                params.putString("data", result.getText());
                                                promise.resolve(params);
                                            }
                                        }
                                    },
                                    new Consumer<Throwable>() {
                                        @Override
                                        public void accept(@NonNull Throwable throwable) throws Exception {
                                            if (promise != null) {
                                                promise.reject(throwable);
                                            }
                                        }
                                    }
                            );
                }
            });
        }
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

    }
}