package com.herotravelermobile;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.wix.autogrowtextinput.AutoGrowTextInputPackage;
import com.wix.autogrowtextinput.AutoGrowTextInputPackage;
import com.arttitude360.reactnative.rngoogleplaces.RNGooglePlacesPackage;
import com.apsl.versionnumber.RNVersionNumberPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.github.alinz.reactnativewebviewbridge.WebViewBridgePackage;
import com.slowpath.hockeyapp.RNHockeyAppPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.cboy.rn.splashscreen.SplashScreenReactPackage;
import com.imagepicker.ImagePickerPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new AutoGrowTextInputPackage(),
            new AutoGrowTextInputPackage(),
            new RNGooglePlacesPackage(),
            new RNVersionNumberPackage(),
            new RNFetchBlobPackage(),
            new MapsPackage(),
            new WebViewBridgePackage(),
            new RNHockeyAppPackage(),
            new ReactNativePushNotificationPackage(),
            new ReactVideoPackage(),
            new FBSDKPackage(),
            new SplashScreenReactPackage(),
            new ImagePickerPackage(),
            new RCTCameraPackage(),
            new VectorIconsPackage(),
            new RNDeviceInfo()
      );
    }
  };

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
