package com.herotravelermobile.editor

import android.text.InputFilter
import android.text.Spanned
import android.widget.EditText
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.UIManagerModule
import com.facebook.react.views.textinput.ReactTextInputLocalData

class Filter(private val editText: EditText) : InputFilter {
    private val dummyEditText = EditText(editText.context)

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