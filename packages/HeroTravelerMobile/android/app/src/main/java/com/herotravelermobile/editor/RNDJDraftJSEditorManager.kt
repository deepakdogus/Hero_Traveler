package com.herotravelermobile.editor

import android.annotation.SuppressLint
import android.graphics.PorterDuff
import android.graphics.Typeface
import android.graphics.drawable.Drawable
import android.support.v4.content.ContextCompat
import android.text.Editable
import android.text.InputFilter
import android.text.TextWatcher
import android.util.TypedValue
import android.view.Gravity
import android.widget.TextView
import com.facebook.infer.annotation.Assertions
import com.facebook.react.bridge.JSApplicationIllegalArgumentException
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.common.MapBuilder
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.BaseViewManager
import com.facebook.react.uimanager.LayoutShadowNode
import com.facebook.react.uimanager.PixelUtil
import com.facebook.react.uimanager.Spacing
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerModule
import com.facebook.react.uimanager.ViewDefaults
import com.facebook.react.uimanager.ViewProps
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.uimanager.annotations.ReactPropGroup
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.EventDispatcher
import com.facebook.react.views.imagehelper.ResourceDrawableIdHelper
import com.facebook.react.views.scroll.ScrollEventType
import com.facebook.react.views.text.DefaultStyleValuesUtil
import com.facebook.react.views.text.ReactFontManager
import com.facebook.react.views.textinput.ContentSizeWatcher
import com.facebook.react.views.textinput.ReactContentSizeChangedEvent
import com.facebook.react.views.textinput.ReactTextInputEvent
import com.facebook.yoga.YogaConstants
import com.herotravelermobile.editor.event.OnBackspaceRequest
import com.herotravelermobile.editor.event.OnInsertTextRequest
import com.herotravelermobile.editor.event.OnNewlineRequest
import com.herotravelermobile.editor.event.OnReplaceRangeRequest
import com.herotravelermobile.editor.event.OnSelectionChangeRequest
import com.herotravelermobile.editor.model.DraftJsSelection
import java.util.*

/**
 * Manages instances of TextInput.
 */
@ReactModule(name = RNDJDraftJSEditorManager.REACT_CLASS)
class RNDJDraftJSEditorManager : BaseViewManager<RNDJDraftJSEditor, LayoutShadowNode>() {
    companion object {
        const val REACT_CLASS = "RNDJDraftJSEditor"

        private const val UNSET = -1

        private const val IME_ACTION_ID = 0x670

        private val EMPTY_FILTERS = emptyArray<InputFilter?>()

        private val SPACING_TYPES = intArrayOf(Spacing.ALL, Spacing.LEFT, Spacing.RIGHT, Spacing.TOP, Spacing.BOTTOM)

        @Suppress("DIVISION_BY_ZERO")
        private const val YOGA_CONSTANTS_UNDEFINED = 0.0f / 0.0f
    }

    override fun getName(): String {
        return REACT_CLASS
    }

    public override fun createViewInstance(context: ThemedReactContext): RNDJDraftJSEditor {
        return RNDJDraftJSEditor(context).apply {
            eventSender = createEventSender(this)
        }
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

            if (extraData.containsImages) {
                /*val spannable = extraData.text
                TextInlineImageSpan.possiblyUpdateInlineImageSpans(spannable, view)*/
            }
            view.updateText(extraData)
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

    private inner class ReactContentSizeWatcher(private val editText: RNDJDraftJSEditor) : ContentSizeWatcher {
        private val eventDispatcher: EventDispatcher = editText.context
                .getNativeModule(UIManagerModule::class.java).eventDispatcher
        private var mPreviousContentWidth = 0
        private var mPreviousContentHeight = 0

        override fun onLayout() {
            var contentWidth = editText.width
            var contentHeight = editText.height

            // Use instead size of text content within EditText when available
            if (editText.layout != null) {
                contentWidth = editText.compoundPaddingLeft + editText.layout.width +
                        editText.compoundPaddingRight
                contentHeight = editText.compoundPaddingTop + editText.layout.height +
                        editText.compoundPaddingBottom
            }

            if (contentWidth != mPreviousContentWidth || contentHeight != mPreviousContentHeight) {
                mPreviousContentHeight = contentHeight
                mPreviousContentWidth = contentWidth

                eventDispatcher.dispatchEvent(
                        ReactContentSizeChangedEvent(
                                editText.id,
                                PixelUtil.toDIPFromPixel(contentWidth.toFloat()),
                                PixelUtil.toDIPFromPixel(contentHeight.toFloat())
                        )
                )
            }
        }
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
        view.context.getNativeModule(UIManagerModule::class.java).eventDispatcher
                .dispatchEvent(event)
    }

    @SuppressLint("RtlHardcoded")
    @ReactProp(name = ViewProps.TEXT_ALIGN)
    fun setTextAlign(view: RNDJDraftJSEditor, textAlign: String?) {
        when (textAlign) {
            null, "auto" -> view.setGravityHorizontal(Gravity.NO_GRAVITY)
            "left" -> view.setGravityHorizontal(Gravity.LEFT)
            "right" -> view.setGravityHorizontal(Gravity.RIGHT)
            "center" -> view.setGravityHorizontal(Gravity.CENTER_HORIZONTAL)
            "justify" -> // Fallback gracefully for cross-platform compat instead of error
                view.setGravityHorizontal(Gravity.LEFT)
            else -> throw JSApplicationIllegalArgumentException("Invalid textAlign: $textAlign")
        }
    }

    @ReactProp(name = ViewProps.FONT_SIZE, defaultFloat = ViewDefaults.FONT_SIZE_SP)
    fun setFontSize(view: RNDJDraftJSEditor, fontSize: Float) {
        view.setTextSize(
                TypedValue.COMPLEX_UNIT_PX,
                Math.ceil(PixelUtil.toPixelFromSP(fontSize).toDouble()).toInt().toFloat()
        )
    }

    @ReactProp(name = ViewProps.COLOR, customType = "Color")
    fun setColor(view: RNDJDraftJSEditor, color: Int?) {
        if (color == null) {
            view.setTextColor(DefaultStyleValuesUtil.getDefaultTextColor(view.context))
        } else {
            view.setTextColor(color)
        }
    }

    @SuppressLint("WrongConstant")
    @ReactProp(name = ViewProps.FONT_WEIGHT)
    fun setFontWeight(view: RNDJDraftJSEditor, fontWeightString: String?) {
        val fontWeightNumeric = when (fontWeightString) {
            null -> -1
            else -> parseNumericFontWeight(fontWeightString)
        }
        val fontWeight = when {
            fontWeightNumeric >= 500 || "bold" == fontWeightString -> Typeface.BOLD
            "normal" == fontWeightString || fontWeightNumeric != -1 && fontWeightNumeric < 500 -> Typeface.NORMAL
            else -> UNSET
        }
        val currentTypeface: Typeface = view.typeface ?: Typeface.DEFAULT
        if (fontWeight != currentTypeface.style) {
            view.setTypeface(currentTypeface, fontWeight)
        }
    }

    private fun parseNumericFontWeight(fontWeightString: String): Int {
        // This should be much faster than using regex to verify input and Integer.parseInt
        return if (fontWeightString.length == 3 && fontWeightString.endsWith("00")
                && fontWeightString[0] <= '9' && fontWeightString[0] >= '1')
            100 * (fontWeightString[0] - '0')
        else
            -1
    }

    @ReactProp(name = ViewProps.FONT_FAMILY)
    fun setFontFamily(view: RNDJDraftJSEditor, fontFamily: String) {
        var style = Typeface.NORMAL
        if (view.typeface != null) {
            style = view.typeface.style
        }
        val newTypeface = ReactFontManager.getInstance().getTypeface(
                fontFamily,
                style,
                view.context.assets
        )
        view.typeface = newTypeface
    }

    @SuppressLint("WrongConstant")
    @ReactProp(name = ViewProps.FONT_STYLE)
    fun setFontStyle(view: RNDJDraftJSEditor, fontStyleString: String?) {
        var fontStyle = UNSET
        if ("italic" == fontStyleString) {
            fontStyle = Typeface.ITALIC
        } else if ("normal" == fontStyleString) {
            fontStyle = Typeface.NORMAL
        }

        var currentTypeface: Typeface? = view.typeface
        if (currentTypeface == null) {
            currentTypeface = Typeface.DEFAULT
        }
        if (fontStyle != currentTypeface!!.style) {
            view.setTypeface(currentTypeface, fontStyle)
        }
    }

    @ReactProp(name = "placeholderText")
    fun setPlaceholder(view: RNDJDraftJSEditor, placeholder: String?) {
        view.hint = placeholder
    }

    @ReactProp(name = "placeholderTextColor", customType = "Color")
    fun setPlaceholderTextColor(view: RNDJDraftJSEditor, color: Int?) {
        if (color == null) {
            view.setHintTextColor(DefaultStyleValuesUtil.getDefaultTextColorHint(view.context))
        } else {
            view.setHintTextColor(color)
        }
    }

    @ReactProp(name = "selectionColor", customType = "Color")
    fun setSelectionColor(view: RNDJDraftJSEditor, color: Int?) {
        if (color == null) {
            view.highlightColor = DefaultStyleValuesUtil.getDefaultTextColorHighlight(view.context)
        } else {
            view.highlightColor = color
        }

        setCursorColor(view, color)
    }

    private fun setCursorColor(view: RNDJDraftJSEditor, color: Int?) {
        // Evil method that uses reflection because there is no public API to changes
        // the cursor color programmatically.
        // Based on http://stackoverflow.com/questions/25996032/how-to-change-programatically-edittext-cursor-color-in-android.
        try {
            // Get the original cursor drawable resource.
            val cursorDrawableResField = TextView::class.java.getDeclaredField("mCursorDrawableRes")
            cursorDrawableResField.isAccessible = true
            val drawableResId = cursorDrawableResField.getInt(view)

            // The view has no cursor drawable.
            if (drawableResId == 0) {
                return
            }

            val drawable: Drawable = ContextCompat.getDrawable(view.context, drawableResId)!!
            if (color != null) {
                drawable.setColorFilter(color, PorterDuff.Mode.SRC_IN)
            }
            val drawables = arrayOf(drawable, drawable)

            // Update the current cursor drawable with the new one.
            val editorField = TextView::class.java.getDeclaredField("mEditor")
            editorField.isAccessible = true
            val editor = editorField.get(view)
            val cursorDrawableField = editor.javaClass.getDeclaredField("mCursorDrawable")
            cursorDrawableField.isAccessible = true
            cursorDrawableField.set(editor, drawables)
        } catch (ex: NoSuchFieldException) {
            // Ignore errors to avoid crashing if these private fields don't exist on modified
            // or future android versions.
        } catch (ex: IllegalAccessException) {
        }

    }

    @ReactProp(name = "caretHidden", defaultBoolean = false)
    fun setCaretHidden(view: RNDJDraftJSEditor, caretHidden: Boolean) {
        view.isCursorVisible = !caretHidden
    }

    @ReactProp(name = "selectTextOnFocus", defaultBoolean = false)
    fun setSelectTextOnFocus(view: RNDJDraftJSEditor, selectTextOnFocus: Boolean) {
        view.setSelectAllOnFocus(selectTextOnFocus)
    }

    @ReactProp(name = "underlineColorAndroid", customType = "Color")
    fun setUnderlineColor(view: RNDJDraftJSEditor, underlineColor: Int?) {
        // Drawable.mutate() can sometimes crash due to an AOSP bug:
        // See https://code.google.com/p/android/issues/detail?id=191754 for more info
        val background = view.background
        val drawableToMutate = if (background.constantState != null)
            background.mutate()
        else
            background

        if (underlineColor == null) {
            drawableToMutate.clearColorFilter()
        } else {
            drawableToMutate.setColorFilter(underlineColor, PorterDuff.Mode.SRC_IN)
        }
    }

    @ReactProp(name = ViewProps.TEXT_ALIGN_VERTICAL)
    fun setTextAlignVertical(view: RNDJDraftJSEditor, textAlignVertical: String?) {
        when (textAlignVertical) {
            null, "auto" -> view.setGravityVertical(Gravity.NO_GRAVITY)
            "top" -> view.setGravityVertical(Gravity.TOP)
            "bottom" -> view.setGravityVertical(Gravity.BOTTOM)
            "center" -> view.setGravityVertical(Gravity.CENTER_VERTICAL)
            else -> throw JSApplicationIllegalArgumentException("Invalid textAlignVertical: $textAlignVertical")
        }
    }

    @ReactProp(name = "inlineImageLeft")
    fun setInlineImageLeft(view: RNDJDraftJSEditor, resource: String?) {
        val id = ResourceDrawableIdHelper.getInstance().getResourceDrawableId(view.context, resource)
        view.setCompoundDrawablesWithIntrinsicBounds(id, 0, 0, 0)
    }

    @ReactProp(name = "inlineImagePadding")
    fun setInlineImagePadding(view: RNDJDraftJSEditor, padding: Int) {
        view.compoundDrawablePadding = padding
    }

    @ReactProp(name = "editable", defaultBoolean = true)
    fun setEditable(view: RNDJDraftJSEditor, editable: Boolean) {
        view.isEnabled = editable
    }

    @ReactProp(name = ViewProps.NUMBER_OF_LINES, defaultInt = 1)
    fun setNumLines(view: RNDJDraftJSEditor, numLines: Int) {
        view.setLines(numLines)
    }

    @ReactProp(name = "maxLength")
    fun setMaxLength(view: RNDJDraftJSEditor, maxLength: Int?) {
        val currentFilters = view.filters
        var newFilters = EMPTY_FILTERS

        if (maxLength == null) {
            if (currentFilters.isNotEmpty()) {
                val list = LinkedList<InputFilter>()
                for (i in currentFilters.indices) {
                    if (currentFilters[i] !is InputFilter.LengthFilter) {
                        list.add(currentFilters[i])
                    }
                }
                if (!list.isEmpty()) {
                    newFilters = list.toTypedArray()
                }
            }
        } else {
            if (currentFilters.isNotEmpty()) {
                newFilters = currentFilters
                var replaced = false
                for (i in currentFilters.indices) {
                    if (currentFilters[i] is InputFilter.LengthFilter) {
                        currentFilters[i] = InputFilter.LengthFilter(maxLength)
                        replaced = true
                    }
                }
                if (!replaced) {
                    newFilters = arrayOfNulls(currentFilters.size + 1)
                    System.arraycopy(currentFilters, 0, newFilters, 0, currentFilters.size)
                    currentFilters[currentFilters.size] = InputFilter.LengthFilter(maxLength)
                }
            } else {
                newFilters = arrayOfNulls(1)
                newFilters[0] = InputFilter.LengthFilter(maxLength)
            }
        }

        view.filters = newFilters
    }

    @ReactPropGroup(names = [ViewProps.BORDER_RADIUS, ViewProps.BORDER_TOP_LEFT_RADIUS, ViewProps.BORDER_TOP_RIGHT_RADIUS, ViewProps.BORDER_BOTTOM_RIGHT_RADIUS, ViewProps.BORDER_BOTTOM_LEFT_RADIUS], defaultFloat = YOGA_CONSTANTS_UNDEFINED)
    fun setBorderRadius(view: RNDJDraftJSEditor, index: Int, borderRadius: Float) {
        var br = borderRadius
        if (!YogaConstants.isUndefined(br)) {
            br = PixelUtil.toPixelFromDIP(br)
        }

        if (index == 0) {
            view.setBorderRadius(br)
        } else {
            view.setBorderRadius(br, index - 1)
        }
    }

    @ReactProp(name = "borderStyle")
    fun setBorderStyle(view: RNDJDraftJSEditor, borderStyle: String?) {
        view.setBorderStyle(borderStyle)
    }

    @ReactPropGroup(names = [ViewProps.BORDER_WIDTH, ViewProps.BORDER_LEFT_WIDTH, ViewProps.BORDER_RIGHT_WIDTH, ViewProps.BORDER_TOP_WIDTH, ViewProps.BORDER_BOTTOM_WIDTH], defaultFloat = YOGA_CONSTANTS_UNDEFINED)
    fun setBorderWidth(view: RNDJDraftJSEditor, index: Int, width: Float) {
        view.setBorderWidth(
                SPACING_TYPES[index],
                width.takeIf { YogaConstants.isUndefined(width) } ?: PixelUtil.toPixelFromDIP(width)
        )
    }

    @ReactPropGroup(names = ["borderColor", "borderLeftColor", "borderRightColor", "borderTopColor", "borderBottomColor"], customType = "Color")
    fun setBorderColor(view: RNDJDraftJSEditor, index: Int, color: Int?) {
        val rgbComponent = if (color == null) YogaConstants.UNDEFINED else (color and 0x00FFFFFF).toFloat()
        val alphaComponent = if (color == null) YogaConstants.UNDEFINED else (color.ushr(24)).toFloat()
        view.setBorderColor(SPACING_TYPES[index], rgbComponent, alphaComponent)
    }

    @ReactProp(name = "returnKeyType")
    fun setReturnKeyType(view: RNDJDraftJSEditor, returnKeyType: String) {
        view.setReturnKeyType(returnKeyType)
    }

    @ReactProp(name = "disableFullscreenUI", defaultBoolean = false)
    fun setDisableFullscreenUI(view: RNDJDraftJSEditor, disableFullscreenUI: Boolean) {
        view.setDisableFullscreenUI(disableFullscreenUI)
    }

    @ReactProp(name = "returnKeyLabel")
    fun setReturnKeyLabel(view: RNDJDraftJSEditor, returnKeyLabel: String) {
        view.setImeActionLabel(returnKeyLabel, IME_ACTION_ID)
    }

    override fun addEventEmitters(reactContext: ThemedReactContext, view: RNDJDraftJSEditor) {
        view.addTextChangedListener(ReactTextInputTextWatcher(reactContext, view))
    }

    private fun MapBuilder.Builder<String, Any>.put(eventName: String) =
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
            // Rearranging the text (i.e. changing between single-line and multiline attributes) can
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
