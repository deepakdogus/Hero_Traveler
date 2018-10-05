package com.herotravelermobile.editor

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class RNDJDraftJSEditorPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext?)
            : MutableList<NativeModule> = mutableListOf()

    override fun createViewManagers(reactContext: ReactApplicationContext?)
            : MutableList<ViewManager<*, *>> = mutableListOf(RNDJDraftJSEditorManager())
}