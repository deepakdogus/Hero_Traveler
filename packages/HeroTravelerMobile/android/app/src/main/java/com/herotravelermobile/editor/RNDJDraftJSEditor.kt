package com.herotravelermobile.editor

import android.content.Context
import android.graphics.Rect
import android.os.Build
import android.text.Editable
import android.text.InputType
import android.text.Selection
import android.text.SpannableStringBuilder
import android.text.Spanned
import android.text.TextUtils
import android.text.TextWatcher
import android.text.style.AbsoluteSizeSpan
import android.text.style.BackgroundColorSpan
import android.text.style.ForegroundColorSpan
import android.view.Gravity
import android.view.inputmethod.InputMethodManager
import android.widget.EditText
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.UIManagerModule
import com.facebook.react.uimanager.events.Event
import com.facebook.react.views.text.CustomStyleSpan
import com.facebook.react.views.text.ReactTagSpan
import com.facebook.react.views.text.ReactTextUpdate
import com.facebook.react.views.textinput.ContentSizeWatcher
import com.facebook.react.views.textinput.ReactTextInputLocalData
import com.herotravelermobile.editor.event.OnBackspaceRequest
import com.herotravelermobile.editor.event.OnInsertTextRequest
import com.herotravelermobile.editor.event.OnNewlineRequest
import com.herotravelermobile.editor.event.OnReplaceRangeRequest
import com.herotravelermobile.editor.event.OnSelectionChangeRequest
import com.herotravelermobile.editor.model.Address
import com.herotravelermobile.editor.model.DraftJsContent
import com.herotravelermobile.editor.model.DraftJsSelection

class RNDJDraftJSEditor(context: Context) : EditText(context) {
    private val defaultGravityHorizontal: Int = gravity and
            (Gravity.HORIZONTAL_GRAVITY_MASK or Gravity.RELATIVE_HORIZONTAL_GRAVITY_MASK)

    private lateinit var _content: DraftJsContent

    private lateinit var _selection: DraftJsSelection

    private val filter = DraftJsInputFilter(
            { OnInsertTextRequest(id, it).sendIf(onInsertTextEnabled) },
            { OnBackspaceRequest(id).sendIf(onBackspaceEnabled) },
            { OnNewlineRequest(id).sendIf(onNewlineEnabled) },
            { replacement, rangeToReplace ->
                OnReplaceRangeRequest(
                        id,
                        replacement,
                        _content.flatIndexToAddress(rangeToReplace.start),
                        _content.flatIndexToAddress(rangeToReplace.endInclusive + 1)
                ).sendIf(onReplaceRangeEnabled)
            }
    )

    private lateinit var textWrapper : SelectionBlockingText

    var onInsertTextEnabled = false
    var onBackspaceEnabled = false
    var onNewlineEnabled = false
    var onSelectionChangedEnabled = false
    var onReplaceRangeEnabled = false

    var eventSender: ((Event<*>) -> Unit?)? = null

    private var blockFocusRequest = true

    private val inputMethodManager =
            context.getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager

    // Workaround. Parent constructor calls getText() before selectionCallback gets initialized
    private var _selectionCallback: ((Int, Int) -> Unit?)? = null
    private val selectionCallback: (Int, Int) -> Unit?
        get() {
            return _selectionCallback ?: ({ start: Int, end: Int ->
                val (startKey, startOffset) = _content.flatIndexToAddress(start)
                val (endKey, endOffset) = _content.flatIndexToAddress(end)
                eventSender?.invoke(
                        OnSelectionChangeRequest(
                                id,
                                DraftJsSelection(startKey, startOffset, endKey, endOffset, hasFocus())
                        )
                )
            }).also { _selectionCallback = it }
        }

    private var mNativeEventCount = 0

    private var containsImages = false

    var contentSizeWatcher: ContentSizeWatcher? = null

    init {
        filters = arrayOf(* (filters ?: emptyArray()), filter)
        addTextChangedListener(ContentSizeNotifier())
    }

    fun incrementAndGetEventCounter(): Int {
        return ++mNativeEventCount
    }

    fun maybeSetText(reactTextUpdate: ReactTextUpdate) {
        if (isSecureText() && TextUtils.equals(text, reactTextUpdate.text)) {
            return
        }

        // Only set the text if it is up to date.
        if (reactTextUpdate.jsEventCounter < mNativeEventCount) {
            return
        }

        // The current text gets replaced with the text received from JS. However, the spans on the
        // current text need to be adapted to the new text. Since TextView#setText() will remove or
        // reset some of these spans even if they are set directly, SpannableStringBuilder#replace() is
        // used instead (this is also used by the the keyboard implementation underneath the covers).
        val spannableStringBuilder = SpannableStringBuilder(reactTextUpdate.text)
        manageSpans(spannableStringBuilder)
        containsImages = reactTextUpdate.containsImages()

        text.replace(0, length(), spannableStringBuilder)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (breakStrategy != reactTextUpdate.textBreakStrategy) {
                breakStrategy = reactTextUpdate.textBreakStrategy
            }
        }
    }

    private fun setIntrinsicContentSize() {
        val reactContext = context as ReactContext
        val uiManager = reactContext.getNativeModule(UIManagerModule::class.java)
        val localData = ReactTextInputLocalData(this)
        uiManager.setViewLocalData(id, localData)
    }

    private fun onContentSizeChange() {
        if (contentSizeWatcher != null) {
            contentSizeWatcher!!.onLayout()
        }

        setIntrinsicContentSize()
    }

    override fun onLayout(changed: Boolean, left: Int, top: Int, right: Int, bottom: Int) =
            onContentSizeChange()

    /**
     * Remove and/or add [Spanned.SPAN_EXCLUSIVE_EXCLUSIVE] spans, since they should only exist
     * as long as the text they cover is the same. All other spans will remain the same, since they
     * will adapt to the new text, hence why [SpannableStringBuilder.replace] never removes
     * them.
     */
    private fun manageSpans(spannableStringBuilder: SpannableStringBuilder) {
        val spans = text.getSpans(0, length(), Any::class.java)
        for (spanIdx in spans.indices) {
            // Remove all styling spans we might have previously set
            if (ForegroundColorSpan::class.java.isInstance(spans[spanIdx]) ||
                    BackgroundColorSpan::class.java.isInstance(spans[spanIdx]) ||
                    AbsoluteSizeSpan::class.java.isInstance(spans[spanIdx]) ||
                    CustomStyleSpan::class.java.isInstance(spans[spanIdx]) ||
                    ReactTagSpan::class.java.isInstance(spans[spanIdx])) {
                text.removeSpan(spans[spanIdx])
            }

            if (text.getSpanFlags(spans[spanIdx]) and Spanned.SPAN_EXCLUSIVE_EXCLUSIVE != Spanned.SPAN_EXCLUSIVE_EXCLUSIVE) {
                continue
            }
            val span = spans[spanIdx]
            val spanStart = text.getSpanStart(spans[spanIdx])
            val spanEnd = text.getSpanEnd(spans[spanIdx])
            val spanFlags = text.getSpanFlags(spans[spanIdx])

            // Make sure the span is removed from existing text, otherwise the spans we set will be
            // ignored or it will cover text that has changed.
            text.removeSpan(spans[spanIdx])
            if (sameTextForSpan(text, spannableStringBuilder, spanStart, spanEnd)) {
                spannableStringBuilder.setSpan(span, spanStart, spanEnd, spanFlags)
            }
        }
    }

    private fun sameTextForSpan(
            oldText: Editable,
            newText: SpannableStringBuilder,
            start: Int,
            end: Int
    ): Boolean {
        if (start > newText.length || end > newText.length) {
            return false
        }
        for (charIdx in start until end) {
            if (oldText[charIdx] != newText[charIdx]) {
                return false
            }
        }
        return true
    }


    private fun isSecureText() =
        inputType and (InputType.TYPE_NUMBER_VARIATION_PASSWORD or InputType.TYPE_TEXT_VARIATION_PASSWORD) != 0

    internal fun setGravityHorizontal(gravityHorizontal: Int) {
        gravity = gravity and Gravity.HORIZONTAL_GRAVITY_MASK.inv() and
                Gravity.RELATIVE_HORIZONTAL_GRAVITY_MASK.inv() or
                (if (gravityHorizontal != 0) gravityHorizontal else defaultGravityHorizontal)
    }

    fun setContent(content : DraftJsContent) {
        _content = content
        forceSetText(content.flatText)
        if (::_selection.isInitialized) {
            setSelection(_selection)
        }
    }

    fun setSelection(selection: DraftJsSelection) {
        _selection = selection
        selection.let {
            if (::_content.isInitialized) {
                val startIndex = _content.addressToFlatIndex(Address(it.startKey, it.startOffset))
                val endIndex = _content.addressToFlatIndex(Address(it.endKey, it.endOffset))
                if (startIndex >= 0 && endIndex >= 0) {
                    Selection.setSelection(super.getText(), startIndex, endIndex)
                }
            }
            if (it.hasFocus) {
                blockFocusRequest = false
                requestFocus()
                inputMethodManager.showSoftInput(this, 0)
                blockFocusRequest = true
            } else {
                clearFocus()
            }
        }
    }

    override fun requestFocus(direction: Int, previouslyFocusedRect: Rect?): Boolean {
        return if (blockFocusRequest && !hasFocus()) {
            OnSelectionChangeRequest(id, _selection.copy(hasFocus = true)).sendIf(onSelectionChangedEnabled)
            false
        } else {
            super.requestFocus(direction, previouslyFocusedRect)
        }
    }

    override fun onFocusChanged(focused: Boolean, direction: Int, previouslyFocusedRect: Rect?) {
        super.onFocusChanged(focused, direction, previouslyFocusedRect)
        if (!focused) {
            _selection = _selection.copy(hasFocus = false)
            OnSelectionChangeRequest(id, _selection).sendIf(onSelectionChangedEnabled)
        }
    }

    override fun getText(): Editable {
        val text = super.getText()
        if (!::textWrapper.isInitialized || text !== textWrapper.delegate) {
            textWrapper = SelectionBlockingText(text, selectionCallback)
        }
        return textWrapper
    }

    override fun getEditableText() = text

    private fun forceSetText(text: CharSequence?) {
        filter.enabled = false
        setText(text)
        filter.enabled = true
    }

    private inner class ContentSizeNotifier : TextWatcher {
        override fun beforeTextChanged(s: CharSequence, start: Int, count: Int, after: Int) {}

        override fun onTextChanged(s: CharSequence, start: Int, before: Int, count: Int) {
            onContentSizeChange()
        }

        override fun afterTextChanged(s: Editable) {}
    }


    private fun Event<*>.sendIf(condition: Boolean) { if (condition) eventSender?.invoke(this) }
}
