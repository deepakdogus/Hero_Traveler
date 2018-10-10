package com.herotravelermobile.editor

import android.text.Editable
import android.text.Selection.SELECTION_END
import android.text.Selection.SELECTION_START
import android.text.Spanned
import com.herotravelermobile.utils.selectionEnd
import com.herotravelermobile.utils.selectionStart

class SelectionBlockingText(
        val delegate: Editable,
        private val selectionCallback: (Int, Int) -> Unit?
) : Editable by delegate {
    private var selectionStart: Int
    private var selectionEnd: Int

    init {
        selectionStart = 0
        selectionEnd = 0
        initSelectionIndices()
    }

    private fun initSelectionIndices() {
        selectionStart = selectionStart()
        selectionEnd = selectionEnd()
    }

    override fun setSpan(what: Any?, start: Int, end: Int, flags: Int) {
        when (what) {
            SELECTION_START, SELECTION_END -> {
                if (what === SELECTION_START) {
                    selectionStart = start
                } else {
                    selectionEnd = start
                }
                if (flags and Spanned.SPAN_INTERMEDIATE != Spanned.SPAN_INTERMEDIATE) {
                    selectionCallback.invoke(selectionStart, selectionEnd)
                    initSelectionIndices()
                }
            }
            else -> delegate.setSpan(what, start, end, flags)
        }
    }

    override fun removeSpan(what: Any?) {
        when (what) {
            SELECTION_START, SELECTION_END -> return
            else -> delegate.removeSpan(what)
        }
    }

    override fun clearSpans() {
        if (selectionStart() != -1 || selectionEnd() != -1) {
            getSpans(0, length, Object::class.java)
                    .filterNot { it === SELECTION_START || it === SELECTION_END }
                    .forEach { delegate.removeSpan(it) }
        } else {
            delegate.clearSpans()
        }
    }

    override fun toString(): String {
        return delegate.toString()
    }
}
