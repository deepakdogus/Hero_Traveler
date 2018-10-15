package com.herotravelermobile.editor

import android.content.Context
import android.graphics.Rect
import android.text.Editable
import android.text.Selection
import android.view.Gravity
import android.view.inputmethod.InputMethodManager
import android.widget.EditText
import com.facebook.react.uimanager.events.Event
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
            this,
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

    private var textWrapper : SelectionBlockingText? = null

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

    init {
        filters = arrayOf(* (filters ?: emptyArray()), filter)
    }

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

    override fun getText(): Editable? {
        val text = super.getText()
        if (text !== textWrapper?.delegate) {
            textWrapper = text?.let { SelectionBlockingText(it, selectionCallback) }
        }
        return textWrapper
    }

    override fun getEditableText(): Editable? {
        val text = super.getEditableText()
        if (text !== textWrapper?.delegate) {
            textWrapper = text?.let { SelectionBlockingText(it, selectionCallback) }
        }
        return textWrapper
    }

    private fun forceSetText(text: CharSequence?) {
        filter.enabled = false
        setText(text)
        filter.enabled = true
    }

    private fun Event<*>.sendIf(condition: Boolean) { if (condition) eventSender?.invoke(this) }
}
