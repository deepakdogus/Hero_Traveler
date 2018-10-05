package com.herotravelermobile.editor

import android.content.Context
import android.text.InputFilter
import android.text.Spanned
import android.widget.EditText
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.UIManagerModule
import com.facebook.react.views.textinput.ReactTextInputLocalData

class RNDJDraftJSEditor(context: Context) : BaseRNDJDraftJSEditor(context) {
    init {
         filters = arrayOf(* (filters ?: emptyArray()), Filter(this))
    }

    override fun setContent(content: DraftJsContent) {
        setText(content.blocks.joinToString(separator = "\n") { it.text })
    }
}

private class Filter(val editText: EditText) : InputFilter {
    val dummyEditText = EditText(editText.context)

    override fun filter(
            source: CharSequence,
            start: Int,
            end: Int,
            dest: Spanned,
            dstart: Int,
            dend: Int
    ): CharSequence {
        val newSubstring = source.substring(start, end)

        dummyEditText.setText(dest.replaceRange(dstart, dend, newSubstring))

        editText.run {
            val uiManager = (context as ReactContext).getNativeModule(UIManagerModule::class.java)
            val localData = ReactTextInputLocalData(dummyEditText)
            uiManager.setViewLocalData(id, localData)
        }

        return newSubstring
    }
}
