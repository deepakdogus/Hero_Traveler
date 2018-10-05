package com.herotravelermobile.editor

import android.text.Editable
import android.text.Selection.SELECTION_END
import android.text.Selection.SELECTION_START

class SelectionBlockingText(private val delegate: Editable) : Editable by delegate {
    override fun setSpan(what: Any?, start: Int, end: Int, flags: Int) {
        when (what) {
            SELECTION_START, SELECTION_END -> return
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
