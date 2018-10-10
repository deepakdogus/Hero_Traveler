package com.herotravelermobile.editor

import android.content.Context
import android.graphics.Rect
import android.text.Editable
import android.text.Selection
import android.view.inputmethod.InputMethodManager
import android.widget.EditText
import com.facebook.react.uimanager.events.Event
import com.herotravelermobile.editor.event.OnSelectionChangeRequest
import com.herotravelermobile.editor.model.Address
import com.herotravelermobile.editor.model.DraftJsContent
import com.herotravelermobile.editor.model.DraftJsSelection

class RNDJDraftJSEditor(context: Context) : EditText(context) {
    private lateinit var _content: DraftJsContent

    private lateinit var _selection: DraftJsSelection

    private val filter = DraftJsInputFilter(this)

    private var textWrapper : SelectionBlockingText? = null

    var eventSender: ((Event<*>) -> Unit?)? = null

    private var blockFocusRequest = true

    private val inputMethodManager =
            context.getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager

    init {
        filters = arrayOf(* (filters ?: emptyArray()), filter)
    }

    fun setContent(content : DraftJsContent) {
        val wasInitialized = ::_content.isInitialized
        _content = content
        forceSetText(content.flatText)
        if (!wasInitialized && ::_selection.isInitialized) {
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
            eventSender?.invoke(OnSelectionChangeRequest(id, _selection.copy(hasFocus = true)))
            false
        } else {
            super.requestFocus(direction, previouslyFocusedRect)
        }
    }

    override fun onFocusChanged(focused: Boolean, direction: Int, previouslyFocusedRect: Rect?) {
        super.onFocusChanged(focused, direction, previouslyFocusedRect)
        if (!focused) {
            _selection = _selection.copy(hasFocus = false)
            eventSender?.invoke(OnSelectionChangeRequest(id, _selection))
        }
    }

    override fun getText(): Editable? {
        val text = super.getText()
        if (text !== textWrapper?.delegate) {
            textWrapper = text?.let {
                SelectionBlockingText(it) { start, end ->
                    val (startKey, startOffset) = _content.flatIndexToAddress(start)
                    val (endKey, endOffset) = _content.flatIndexToAddress(end)
                    eventSender?.invoke(OnSelectionChangeRequest(
                            id,
                            DraftJsSelection(startKey, startOffset, endKey, endOffset, hasFocus())
                    ))
                }
            }
        }
        return textWrapper
    }

    private fun forceSetText(text: CharSequence?) {
        filter.enabled = false
        setText(text)
        filter.enabled = true
    }
}

