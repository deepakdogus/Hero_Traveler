package com.herotravelermobile.editor

import android.text.InputFilter
import android.text.SpannableStringBuilder
import android.text.Spanned
import android.text.TextUtils
import android.widget.EditText
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.UIManagerModule
import com.facebook.react.views.textinput.ReactTextInputLocalData
import com.herotravelermobile.utils.selectionEnd
import com.herotravelermobile.utils.selectionStart

class DraftJsInputFilter(
        private val editText: EditText,
        private val onInsertText: (String) -> Unit
) : InputFilter {
    private val dummyEditText = EditText(editText.context)

    var enabled = true

    override fun filter(
            source: CharSequence,
            start: Int,
            end: Int,
            dest: Spanned,
            dstart: Int,
            dend: Int
    ): CharSequence? {
        val newSubstring = source.substring(start, end)

        val newText = SpannableStringBuilder(dest.replaceRange(dstart, dend, newSubstring))

        if (source is Spanned) {
            TextUtils.copySpansFrom(source, start, end, Object::class.java, newText, dstart)
        }

        dummyEditText.text = newText

        editText.run {
            val uiManager = (context as ReactContext).getNativeModule(UIManagerModule::class.java)
            val localData = ReactTextInputLocalData(dummyEditText)
            uiManager.setViewLocalData(id, localData)
        }

        return if (enabled) {
            dest.run {
                val oldPiece = subSequence(dstart, dend)

                val selectionStart = selectionStart()

                if (selectionStart == selectionEnd()
                        && dend == selectionStart
                        && newSubstring.startsWith(oldPiece)) {
                    onInsertText.invoke(newSubstring.substring(oldPiece.length))
                }

                oldPiece
            }
        } else {
            null
        }
    }
}