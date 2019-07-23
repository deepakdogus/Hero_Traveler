package com.herotravelermobile;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.masteratul.RNAppstoreVersionCheckerPackage;
import com.arttitude360.reactnative.rngoogleplaces.RNGooglePlacesPackage;
import org.reactnative.camera.RNCameraPackage;
import com.imagepicker.ImagePickerPackage;
import com.apsl.versionnumber.RNVersionNumberPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import io.branch.referral.Branch;

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
            new RNAppstoreVersionCheckerPackage(),
            new RNGooglePlacesPackage(),
            new RNCameraPackage(),
            new ImagePickerPackage(),
            new RNVersionNumberPackage(),
            new NetInfoPackage(),
            new MapsPackage(),
            new VectorIconsPackage(),
            new RNGestureHandlerPackage(),
            new AsyncStoragePackage(),
            new SplashScreenReactPackage(),
            new RNFetchBlobPackage(),
            new ReactNativePushNotificationPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
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
    RNBranchModule.getAutoInstance(this);
  }
}
