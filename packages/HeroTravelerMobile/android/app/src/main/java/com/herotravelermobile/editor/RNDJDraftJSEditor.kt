package com.herotravelermobile.editor

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Rect
import android.os.Build
import android.text.Editable
import android.text.Selection
import android.text.SpannableStringBuilder
import android.text.Spanned
import android.text.TextWatcher
import android.text.style.AbsoluteSizeSpan
import android.text.style.BackgroundColorSpan
import android.text.style.ForegroundColorSpan
import android.view.Gravity
import android.view.inputmethod.EditorInfo
import android.view.inputmethod.InputMethodManager
import android.widget.EditText
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.UIManagerModule
import com.facebook.react.uimanager.events.Event
import com.facebook.react.views.text.CustomStyleSpan
import com.facebook.react.views.text.ReactTagSpan
import com.facebook.react.views.textinput.ContentSizeWatcher
import com.facebook.react.views.textinput.ReactTextInputLocalData
import com.facebook.react.views.view.ReactViewBackgroundManager
import com.herotravelermobile.editor.event.OnBackspaceRequest
import com.herotravelermobile.editor.event.OnInsertTextRequest
import com.herotravelermobile.editor.event.OnNewlineRequest
import com.herotravelermobile.editor.event.OnReplaceRangeRequest
import com.herotravelermobile.editor.event.OnSelectionChangeRequest
import com.herotravelermobile.editor.model.Address
import com.herotravelermobile.editor.model.DraftJsContent
import com.herotravelermobile.editor.model.DraftJsSelection

@SuppressLint("ViewConstructor")
class RNDJDraftJSEditor(val context: ReactContext) : EditText(context) {
    private val defaultGravityHorizontal: Int = gravity and
            (Gravity.HORIZONTAL_GRAVITY_MASK or Gravity.RELATIVE_HORIZONTAL_GRAVITY_MASK)

    private val defaultGravityVertical = gravity and Gravity.VERTICAL_GRAVITY_MASK

    private val reactBackgroundManager = ReactViewBackgroundManager(this)

    private var returnKeyType: String? = null

    private var disableFullscreen = false

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

    private var containsImages = false

    var contentSizeWatcher: ContentSizeWatcher? = null

    init {
        filters = arrayOf(* (filters ?: emptyArray()), filter)
        addTextChangedListener(ContentSizeNotifier())
    }

    fun updateText(reactTextUpdate: ReactTextUpdate) {
        _content = reactTextUpdate.content

        // The current text gets replaced with the text received from JS. However, the spans on the
        // current text need to be adapted to the new text. Since TextView#setText() will remove or
        // reset some of these spans even if they are set directly, SpannableStringBuilder#replace() is
        // used instead (this is also used by the the keyboard implementation underneath the covers).
        val spannableStringBuilder = SpannableStringBuilder(_content.flatText)
        manageSpans(spannableStringBuilder)
        containsImages = reactTextUpdate.containsImages

        filter.enabled = false
        text.replace(0, length(), spannableStringBuilder)
        filter.enabled = true

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (breakStrategy != reactTextUpdate.textBreakStrategy) {
                breakStrategy = reactTextUpdate.textBreakStrategy
            }
        }

        if (::_selection.isInitialized) {
            setSelection(_selection)
        }
    }

    private fun setIntrinsicContentSize() {
        val uiManager = context.getNativeModule(UIManagerModule::class.java)
        val localData = ReactTextInputLocalData(this)
        uiManager.setViewLocalData(id, localData)
    }

    private fun onContentSizeChange() {
        if (contentSizeWatcher != null) {
            contentSizeWatcher!!.onLayout()
        }
    }

    override fun onLayout(changed: Boolean, left: Int, top: Int, right: Int, bottom: Int) =
            setIntrinsicContentSize()

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
            when (spans[spanIdx]) {
                is ForegroundColorSpan,
                is BackgroundColorSpan,
                is AbsoluteSizeSpan,
                is CustomStyleSpan,
                is ReactTagSpan -> text.removeSpan(spans[spanIdx])
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

    internal fun setGravityHorizontal(gravityHorizontal: Int) {
        gravity = gravity and Gravity.HORIZONTAL_GRAVITY_MASK.inv() and
                Gravity.RELATIVE_HORIZONTAL_GRAVITY_MASK.inv() or
                (if (gravityHorizontal != 0) gravityHorizontal else defaultGravityHorizontal)
    }

    internal fun setGravityVertical(gravityVertical: Int) {
        gravity = gravity and Gravity.VERTICAL_GRAVITY_MASK.inv() or
                (if (gravityVertical != 0) gravityVertical else defaultGravityVertical)
    }

    fun setBorderRadius(borderRadius: Float) {
        reactBackgroundManager.setBorderRadius(borderRadius)
    }

    fun setBorderRadius(borderRadius: Float, position: Int) {
        reactBackgroundManager.setBorderRadius(borderRadius, position)
    }

    fun setBorderStyle(style: String?) {
        reactBackgroundManager.setBorderStyle(style)
    }

    fun setBorderWidth(position: Int, width: Float) {
        reactBackgroundManager.setBorderWidth(position, width)
    }

    fun setBorderColor(position: Int, color: Float, alpha: Float) {
        reactBackgroundManager.setBorderColor(position, color, alpha)
    }

    fun setReturnKeyType(returnKeyType: String) {
        this.returnKeyType = returnKeyType
        updateImeOptions()
    }

    fun setDisableFullscreenUI(disableFullscreenUI: Boolean) {
        disableFullscreen = disableFullscreenUI
        updateImeOptions()
    }

    private fun updateImeOptions() {
        // Default to IME_ACTION_DONE
        var returnKeyFlag = EditorInfo.IME_ACTION_DONE
        if (returnKeyType != null) {
            when (returnKeyType) {
                "go" -> returnKeyFlag = EditorInfo.IME_ACTION_GO
                "next" -> returnKeyFlag = EditorInfo.IME_ACTION_NEXT
                "none" -> returnKeyFlag = EditorInfo.IME_ACTION_NONE
                "previous" -> returnKeyFlag = EditorInfo.IME_ACTION_PREVIOUS
                "search" -> returnKeyFlag = EditorInfo.IME_ACTION_SEARCH
                "send" -> returnKeyFlag = EditorInfo.IME_ACTION_SEND
                "done" -> returnKeyFlag = EditorInfo.IME_ACTION_DONE
            }
        }

        imeOptions = if (disableFullscreen) {
            returnKeyFlag or EditorInfo.IME_FLAG_NO_FULLSCREEN
        } else {
            returnKeyFlag
        }
    }

    fun setSelection(selection: DraftJsSelection) {
        _selection = selection
        selection.let {
            if (::_content.isInitialized) {
                val text = super.getText()
                val startIndex = _content.addressToFlatIndex(Address(it.startKey, it.startOffset))
                val endIndex = _content.addressToFlatIndex(Address(it.endKey, it.endOffset))
                if (startIndex >= 0 && endIndex >= 0 && startIndex <= text.length && endIndex <= text.length) {
                    Selection.setSelection(text, startIndex, endIndex)
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

    private inner class ContentSizeNotifier : TextWatcher {
        override fun beforeTextChanged(s: CharSequence, start: Int, count: Int, after: Int) {}

        override fun onTextChanged(s: CharSequence, start: Int, before: Int, count: Int) {
            onContentSizeChange()
        }

        override fun afterTextChanged(s: Editable) {}
    }


    private fun Event<*>.sendIf(condition: Boolean) { if (condition) eventSender?.invoke(this) }
}
