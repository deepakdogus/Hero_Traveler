package com.herotravelermobile.editor

import android.text.Editable

import android.text.Selection.SELECTION_END
import android.text.Selection.SELECTION_START
import android.text.Spanned

class SelectionBlockingText(
        private val delegate: Editable,
        private val selectionCallback: (Int, Int) -> Unit
) : Editable by delegate {
    private var selectionStart: Int
    private var selectionEnd: Int

    init {
        selectionStart = getSpanStart(SELECTION_START)
        selectionEnd = getSpanStart(SELECTION_END)
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
        if (getSpanStart(SELECTION_START) != -1 || getSpanStart(SELECTION_END) != -1) {
            getSpans(0, length, Object::class.java)
                    .filterNot { it === SELECTION_START || it === SELECTION_END }
                    .forEach { delegate.removeSpan(it) }
        } else {
            delegate.clearSpans()
        }
    }
}
