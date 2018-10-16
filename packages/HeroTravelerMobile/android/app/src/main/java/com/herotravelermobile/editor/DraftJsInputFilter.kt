package com.herotravelermobile.editor

import android.text.InputFilter
import android.text.Spanned
import com.herotravelermobile.utils.plus
import com.herotravelermobile.utils.selectionEnd
import com.herotravelermobile.utils.selectionStart

class DraftJsInputFilter(
        private val onInsertText: (String) -> Unit,
        private val onBackspace: () -> Unit,
        private val onNewline: () -> Unit,
        private val onReplaceRange: (replacement: String, rangeToReplace: IntRange) -> Unit
) : InputFilter {
    var enabled = true

    override fun filter(
            source: CharSequence,
            start: Int,
            end: Int,
            dest: Spanned,
            dstart: Int,
            dend: Int
    ): CharSequence? {
        val newPiece = source.substring(start until end)

        return dest.takeIf { enabled }?.run {
            val oldPiece = subSequence(dstart until dend)

            val selectionStart = selectionStart()
            val selectionEnd = selectionEnd()

            val isEditingAtCursor = selectionStart == selectionEnd && dend == selectionStart

            if (isEditingAtCursor && newPiece.startsWith(oldPiece)) {
                val addedText = newPiece.substring(oldPiece.length)
                if ('\n' in addedText) {
                    if (addedText.length == 1) {
                        onNewline()
                    } else {
                        addedText.foldIndexed(StringBuilder()) { index, acc, c ->
                            if (acc.isEmpty()) {
                                if (c != '\n') {
                                    (acc + c).also {
                                        if (index == addedText.lastIndex) {
                                            onInsertText(it.toString())
                                        }
                                    }
                                } else {
                                    onNewline()
                                    acc
                                }
                            } else {
                                if (c != '\n') {
                                    (acc + c).also {
                                        if (index == addedText.lastIndex) {
                                            onInsertText(it.toString())
                                        }
                                    }
                                } else {
                                    onInsertText(acc.toString())
                                    onNewline()
                                    acc.apply { setLength(0) }
                                }
                            }
                        }
                    }
                } else {
                    onInsertText(addedText)
                }
            } else if (isEditingAtCursor
                    && oldPiece.isNotEmpty()
                    && newPiece == oldPiece.substring(0 until oldPiece.lastIndex)) {
                onBackspace()
            } else {
                onReplaceRange(newPiece, dstart until dend)
            }

            oldPiece // Block the edit directly
        }
    }
}