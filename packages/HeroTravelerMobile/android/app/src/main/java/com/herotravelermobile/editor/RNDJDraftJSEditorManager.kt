package com.herotravelermobile.editor

import com.facebook.react.bridge.ReactContext

import com.facebook.react.bridge.ReadableMap
import com.facebook.react.common.MapBuilder
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.BaseViewManager
import com.facebook.react.uimanager.LayoutShadowNode
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerModule
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.uimanager.events.Event
import com.facebook.react.views.scroll.ScrollEventType
import com.facebook.react.views.text.ReactTextUpdate
import com.facebook.react.views.text.TextInlineImageSpan
import com.facebook.react.views.textinput.ReactTextInputShadowNode
import com.herotravelermobile.editor.event.*
import com.herotravelermobile.editor.model.DraftJsContent
import com.herotravelermobile.editor.model.DraftJsSelection
/**
 * Manages instances of TextInput.
 */
@ReactModule(name = RNDJDraftJSEditorManager.REACT_CLASS)
class RNDJDraftJSEditorManager : BaseViewManager<RNDJDraftJSEditor, LayoutShadowNode>() {
    companion object {
        const val REACT_CLASS = "RNDJDraftJSEditor"
    }

    override fun getName(): String {
        return REACT_CLASS
    }

    public override fun createViewInstance(context: ThemedReactContext): RNDJDraftJSEditor {
        val editText = RNDJDraftJSEditor(context)
        editText.eventSender = createEventSender(editText)
        return editText
    }

    override fun createShadowNodeInstance() = ReactTextInputShadowNode()

    override fun getShadowNodeClass(): Class<out LayoutShadowNode> = ReactTextInputShadowNode::class.java

    override fun getExportedCustomBubblingEventTypeConstants(): Map<String, Any>? {
        return MapBuilder.builder<String, Any>()
                .put(
                        "topSubmitEditing",
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of(
                                        "bubbled",
                                        "onSubmitEditing",
                                        "captured",
                                        "onSubmitEditingCapture"
                                )
                        )
                )
                .put(
                        "topEndEditing",
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of(
                                        "bubbled",
                                        "onEndEditing",
                                        "captured",
                                        "onEndEditingCapture"
                                )
                        )
                )
                .put(
                        "topTextInput",
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of(
                                        "bubbled",
                                        "onTextInput",
                                        "captured",
                                        "onTextInputCapture"
                                )
                        )
                )
                .put(
                        "topFocus",
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of("bubbled", "onFocus", "captured", "onFocusCapture")
                        )
                )
                .put(
                        "topBlur",
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of("bubbled", "onBlur", "captured", "onBlurCapture")
                        )
                )
                .put(
                        "topKeyPress",
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of(
                                        "bubbled",
                                        "onKeyPress",
                                        "captured",
                                        "onKeyPressCapture"
                                )
                        )
                )
                .build()
    }

    override fun getExportedCustomDirectEventTypeConstants(): Map<String, Any>? {
        return MapBuilder.builder<String, Any>()
                .put(
                        ScrollEventType.SCROLL.jsEventName,
                        MapBuilder.of("registrationName", "onScroll")
                )
                .put(OnSelectionChangeRequest.EVENT_NAME)
                .put(OnSelectionChangeRequest.EVENT_NAME)
                .put(OnInsertTextRequest.EVENT_NAME)
                .put(OnBackspaceRequest.EVENT_NAME)
                .put(OnNewlineRequest.EVENT_NAME)
                .put(OnReplaceRangeRequest.EVENT_NAME)
                .build()
    }

    override fun updateExtraData(view: RNDJDraftJSEditor, extraData: Any) {
        if (extraData is ReactTextUpdate) {

            view.setPadding(
                    extraData.paddingLeft.toInt(),
                    extraData.paddingTop.toInt(),
                    extraData.paddingRight.toInt(),
                    extraData.paddingBottom.toInt()
            )

            if (extraData.containsImages()) {
                val spannable = extraData.text
                TextInlineImageSpan.possiblyUpdateInlineImageSpans(spannable, view)
            }
            //view.maybeSetText(update);
        }
    }

    @ReactProp(name = "content")
    fun setContent(view: RNDJDraftJSEditor, content: ReadableMap) {
        view.setContent(DraftJsContent(content))
    }

    @ReactProp(name = "selection")
    fun setSelection(view: RNDJDraftJSEditor, selection: ReadableMap) {
        view.setSelection(DraftJsSelection(selection))
    }

    @ReactProp(name = "onSelectionChangeRequest")
    fun setOnSelectionChangeRequest(view: RNDJDraftJSEditor, enabled: Boolean) {
        view.onSelectionChangedEnabled = enabled
    }

    @ReactProp(name = "onInsertTextRequest")
    fun setOnInsertTextRequest(view: RNDJDraftJSEditor, enabled: Boolean) {
        view.onInsertTextEnabled = enabled
    }

    @ReactProp(name = "onBackspaceRequest")
    fun setOnBackspaceRequest(view: RNDJDraftJSEditor, enabled: Boolean) {
        view.onBackspaceEnabled = enabled
    }

    @ReactProp(name = "onNewlineRequest")
    fun setOnNewlineRequest(view: RNDJDraftJSEditor, enabled: Boolean) {
        view.onNewlineEnabled = enabled
    }

    @ReactProp(name = "onReplaceRangeRequest")
    fun setOnReplaceRangeRequest(view: RNDJDraftJSEditor, enabled: Boolean) {
        view.onReplaceRangeEnabled = enabled
    }

    private fun createEventSender(view: RNDJDraftJSEditor): Function1<Event<*>, Unit> = { event ->
        val reactContext = view.context as ReactContext
        reactContext.getNativeModule(UIManagerModule::class.java).eventDispatcher
                .dispatchEvent(event)
    }

    private fun MapBuilder.Builder<String,Any>.put(eventName: String) =
            put(eventName, MapBuilder.of("registrationName", eventName))
}
