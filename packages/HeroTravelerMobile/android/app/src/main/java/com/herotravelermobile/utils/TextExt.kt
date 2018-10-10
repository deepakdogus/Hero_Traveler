package com.herotravelermobile.utils

import android.text.Selection

operator fun Appendable.plusAssign(csq: CharSequence) {
    append(csq)
}

operator fun Appendable.plusAssign(c: Char) {
    append(c)
}

fun CharSequence.selectionStart() = Selection.getSelectionStart(this)

fun CharSequence.selectionEnd() = Selection.getSelectionEnd(this)