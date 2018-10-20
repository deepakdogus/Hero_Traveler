package com.herotravelermobile.utils

import android.text.Selection
import java.util.Locale

operator fun Appendable.plusAssign(csq: CharSequence) {
    append(csq)
}

operator fun Appendable.plusAssign(c: Char) {
    append(c)
}

operator fun Appendable.plus(c: Char): java.lang.Appendable = append(c)

operator fun StringBuilder.plus(c: Char): java.lang.StringBuilder = append(c)

fun CharSequence.selectionStart() = Selection.getSelectionStart(this)

fun CharSequence.selectionEnd() = Selection.getSelectionEnd(this)

private val SNAKE_CASE_REGEX = Regex("-(\\w)")

fun String.toCamelCase(): String = this.replace(SNAKE_CASE_REGEX) {
    it.groupValues[1].toUpperCase(Locale.US)
}