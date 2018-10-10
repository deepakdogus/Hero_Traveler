package com.herotravelermobile.editor

import android.view.inputmethod.InputConnection

class SelectionBlockingConnection(
        private val delegate: InputConnection,
        private val selectionCallback: (Int, Int) -> Unit?
) : InputConnection by delegate {
    override fun setSelection(start: Int, end: Int): Boolean {
        selectionCallback.invoke(start, end)
        return true
    }
}