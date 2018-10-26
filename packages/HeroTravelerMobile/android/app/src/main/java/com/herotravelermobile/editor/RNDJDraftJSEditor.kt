package com.herotravelermobile.editor

import android.annotation.SuppressLint
import android.widget.FrameLayout
import com.facebook.react.bridge.ReactContext

@SuppressLint("ViewConstructor")
class RNDJDraftJSEditor(val context: ReactContext) : FrameLayout(context) {
    val editText: RNDJDraftJSEditText = RNDJDraftJSEditText(context, id)

    init {
        addView(editText)
    }

    override fun setId(id: Int) {
        super.setId(id)
        editText.tag = id
    }
}
