package com.herotravelermobile.editor

import android.content.Context
import android.text.Editable

class RNDJDraftJSEditor(context: Context) : BaseRNDJDraftJSEditor(context) {
    init {
         filters = arrayOf(* (filters ?: emptyArray()), Filter(this))
    }

    override fun setContent(content: DraftJsContent) {
        setText(content.blocks.joinToString(separator = "\n") { it.text })
    }

    override fun getText(): Editable? {
        val text = super.getText()
        return if (text != null) {
            SelectionBlockingText(text)
        } else {
            null
        }
    }
}

