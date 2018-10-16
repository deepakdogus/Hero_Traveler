package com.herotravelermobile.editor

import android.annotation.SuppressLint
import android.text.Editable
import android.text.TextWatcher
import android.util.TypedValue
import android.view.Gravity
import com.facebook.infer.annotation.Assertions
import com.facebook.react.bridge.JSApplicationIllegalArgumentException
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.common.MapBuilder
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.BaseViewManager
import com.facebook.react.uimanager.LayoutShadowNode
import com.facebook.react.uimanager.PixelUtil
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerModule
import com.facebook.react.uimanager.ViewDefaults
import com.facebook.react.uimanager.ViewProps
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.EventDispatcher
import com.facebook.react.views.scroll.ScrollEventType
import com.facebook.react.views.text.ReactTextUpdate
import com.facebook.react.views.text.TextInlineImageSpan
import com.facebook.react.views.textinput.ContentSizeWatcher
import com.facebook.react.views.textinput.ReactContentSizeChangedEvent
import com.facebook.react.views.textinput.ReactTextChangedEvent
import com.facebook.react.views.textinput.ReactTextInputEvent
import com.facebook.react.views.textinput.ReactTextInputShadowNode
import com.herotravelermobile.editor.event.OnBackspaceRequest
import com.herotravelermobile.editor.event.OnInsertTextRequest
import com.herotravelermobile.editor.event.OnNewlineRequest
import com.herotravelermobile.editor.event.OnReplaceRangeRequest
import com.herotravelermobile.editor.event.OnSelectionChangeRequest
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
            view.maybeSetText(extraData)
        }
    }

    @ReactProp(name = "onContentSizeChange", defaultBoolean = false)
    fun setOnContentSizeChange(view: RNDJDraftJSEditor, onContentSizeChange: Boolean) {
        view.contentSizeWatcher =
                if (onContentSizeChange)
                    ReactContentSizeWatcher(view)
                else
                    null
    }

    private inner class ReactContentSizeWatcher(private val mEditText: RNDJDraftJSEditor) : ContentSizeWatcher {
        private val mEventDispatcher: EventDispatcher
        private var mPreviousContentWidth = 0
        private var mPreviousContentHeight = 0

        init {
            val reactContext = mEditText.context as ReactContext
            mEventDispatcher = reactContext.getNativeModule(UIManagerModule::class.java).eventDispatcher
        }

        override fun onLayout() {
            var contentWidth = mEditText.width
            var contentHeight = mEditText.height

            // Use instead size of text content within EditText when available
            if (mEditText.layout != null) {
                contentWidth = mEditText.compoundPaddingLeft + mEditText.layout.width +
                        mEditText.compoundPaddingRight
                contentHeight = mEditText.compoundPaddingTop + mEditText.layout.height +
                        mEditText.compoundPaddingBottom
            }

            if (contentWidth != mPreviousContentWidth || contentHeight != mPreviousContentHeight) {
                mPreviousContentHeight = contentHeight
                mPreviousContentWidth = contentWidth

                mEventDispatcher.dispatchEvent(
                        ReactContentSizeChangedEvent(
                                mEditText.id,
                                PixelUtil.toDIPFromPixel(contentWidth.toFloat()),
                                PixelUtil.toDIPFromPixel(contentHeight.toFloat())
                        )
                )
            }
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

    @SuppressLint("RtlHardcoded")
    @ReactProp(name = ViewProps.TEXT_ALIGN)
    fun setTextAlign(view: RNDJDraftJSEditor, textAlign: String?) {
        if (textAlign == null || "auto" == textAlign) {
            view.setGravityHorizontal(Gravity.NO_GRAVITY)
        } else if ("left" == textAlign) {
            view.setGravityHorizontal(Gravity.LEFT)
        } else if ("right" == textAlign) {
            view.setGravityHorizontal(Gravity.RIGHT)
        } else if ("center" == textAlign) {
            view.setGravityHorizontal(Gravity.CENTER_HORIZONTAL)
        } else if ("justify" == textAlign) {
            // Fallback gracefully for cross-platform compat instead of error
            view.setGravityHorizontal(Gravity.LEFT)
        } else {
            throw JSApplicationIllegalArgumentException("Invalid textAlign: $textAlign")
        }
    }

    @ReactProp(name = ViewProps.FONT_SIZE, defaultFloat = ViewDefaults.FONT_SIZE_SP)
    fun setFontSize(view: RNDJDraftJSEditor, fontSize: Float) {
        view.setTextSize(
                TypedValue.COMPLEX_UNIT_PX,
                Math.ceil(PixelUtil.toPixelFromSP(fontSize).toDouble()).toInt().toFloat()
        )
    }

    override fun addEventEmitters(reactContext: ThemedReactContext, view: RNDJDraftJSEditor) {
        view.addTextChangedListener(ReactTextInputTextWatcher(reactContext, view))
    }

    private fun MapBuilder.Builder<String,Any>.put(eventName: String) =
            put(eventName, MapBuilder.of("registrationName", eventName))

    private inner class ReactTextInputTextWatcher(
            reactContext: ReactContext,
            private val mEditText: RNDJDraftJSEditor
    ) : TextWatcher {
        private val mEventDispatcher: EventDispatcher = reactContext.getNativeModule(UIManagerModule::class.java).eventDispatcher
        private var mPreviousText: String? = null

        override fun beforeTextChanged(s: CharSequence, start: Int, count: Int, after: Int) {
            // Incoming charSequence gets mutated before onTextChanged() is invoked
            mPreviousText = s.toString()
        }

        override fun onTextChanged(s: CharSequence, start: Int, before: Int, count: Int) {
            // Rearranging the text (i.e. changing between singleline and multiline attributes) can
            // also trigger onTextChanged, call the event in JS only when the text actually changed
            if (count == 0 && before == 0) {
                return
            }

            Assertions.assertNotNull(mPreviousText)
            val newText = s.toString().substring(start, start + count)
            val oldText = mPreviousText!!.substring(start, start + before)
            // Don't send same text changes
            if (count == before && newText == oldText) {
                return
            }

            // The event that contains the event counter and updates it must be sent first.
            // TODO: t7936714 merge these events
            mEventDispatcher.dispatchEvent(
                    ReactTextChangedEvent(
                            mEditText.id,
                            s.toString(),
                            mEditText.incrementAndGetEventCounter()
                    )
            )

            mEventDispatcher.dispatchEvent(
                    ReactTextInputEvent(
                            mEditText.id,
                            newText,
                            oldText,
                            start,
                            start + before
                    )
            )
        }

        override fun afterTextChanged(s: Editable) {}
    }
}
