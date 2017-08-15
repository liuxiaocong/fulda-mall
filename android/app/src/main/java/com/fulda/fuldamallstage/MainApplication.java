package com.fulda.fuldamallstage;

import android.content.Context;
import android.content.pm.PackageManager;
import android.support.multidex.MultiDex;
import android.support.multidex.MultiDexApplication;

import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.arttitude360.reactnative.rngoogleplaces.RNGooglePlacesPackage;
import com.beefe.picker.PickerViewPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.soloader.SoLoader;
import com.fulda.fuldamallstage.ReactPackage.callback.FDCallbackNativePackage;
import com.fulda.fuldamallstage.ReactPackage.config.FDConfigPackage;
import com.fulda.fuldamallstage.ReactPackage.location.FDLocationServicesPackage;
import com.fulda.fuldamallstage.ReactPackage.permissionCheck.FDPermissionCheckPackage;
import com.fulda.fuldamallstage.ReactPackage.qrscan.FDQRScanPackage;
import com.fulda.fuldamallstage.util.GsonUtil;
import com.horcrux.svg.SvgPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.rnfs.RNFSPackage;

import java.lang.reflect.Type;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import fr.greweb.reactnativeviewshot.RNViewShotPackage;


public class MainApplication extends MultiDexApplication implements ReactApplication {
    public static String versionName;
    public static int versionCode;
    private static CallbackManager mCallbackManager = CallbackManager.Factory.create();
    private static MainApplication instance;
    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new RNSpinkitPackage(),
                    new MainReactPackage(),
                    new RNGooglePlacesPackage(),
                    new ReactNativePushNotificationPackage(),
                    new RNFSPackage(),
                    new PickerPackage(),
                    new LinearGradientPackage(),
                    new RNViewShotPackage(),
                    new SvgPackage(),
                    new PickerViewPackage(),
                    new FBSDKPackage(mCallbackManager),
                    new RNDeviceInfo(),
                    new VectorIconsPackage(),
                    new RCTCameraPackage(),
                    new FDLocationServicesPackage(),
                    new FDConfigPackage(),
                    new FDPermissionCheckPackage(),
                    new MapsPackage(),
                    new FDQRScanPackage(),
                    new FDCallbackNativePackage(),
                    new RNI18nPackage()
            );
        }
    };

    public static MainApplication getInstance() {
        return instance;
    }

    protected static CallbackManager getCallbackManager() {
        return mCallbackManager;
    }

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();

        try {
            versionName = getPackageManager().getPackageInfo(
                    this.getPackageName(), 0).versionName;
            versionCode = getPackageManager().getPackageInfo(
                    this.getPackageName(), 0).versionCode;
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }

        instance = this;

        GsonUtil.init(new HashMap<Type, Object>());

        SoLoader.init(this, /* native exopackage */ false);
        FacebookSdk.sdkInitialize(getApplicationContext());
        // If you want to use AppEventsLogger to log events.
        AppEventsLogger.activateApp(this);

    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }
}
