package com.herotravelermobile;

import android.support.multidex.MultiDexApplication;

import com.RNFetchBlob.RNFetchBlobPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.apsl.versionnumber.RNVersionNumberPackage;
import com.arttitude360.reactnative.rngoogleplaces.RNGooglePlacesPackage;
import com.cboy.rn.splashscreen.SplashScreenReactPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.soloader.SoLoader;
import com.github.alinz.reactnativewebviewbridge.WebViewBridgePackage;
import com.imagepicker.ImagePickerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.oblador.vectoricons.VectorIconsPackage;
import com.shahenlibrary.RNVideoProcessingPackage;
import com.slowpath.hockeyapp.RNHockeyAppPackage;
import com.wix.autogrowtextinput.AutoGrowTextInputPackage;

import org.reactnative.camera.RNCameraPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends MultiDexApplication implements ReactApplication {
    private static final CallbackManager CALLBACK_MANAGER = CallbackManager.Factory.create();

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNVideoProcessingPackage(),
            new FastImageViewPackage(),
            new AutoGrowTextInputPackage(),
            new RNGooglePlacesPackage(),
            new RNVersionNumberPackage(),
            new RNFetchBlobPackage(),
            new MapsPackage(),
            new WebViewBridgePackage(),
            new RNHockeyAppPackage(MainApplication.this),
            new ReactNativePushNotificationPackage(),
            new FBSDKPackage(CALLBACK_MANAGER),
            new SplashScreenReactPackage(),
            new ImagePickerPackage(),
            new RNCameraPackage(),
            new VectorIconsPackage(),
            new RNDeviceInfo()
      );
    }
  };

    public static CallbackManager getCallbackManager() {
        return CALLBACK_MANAGER;
    }

    @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
