package com.herotravelermobile.editor.model

import com.facebook.react.bridge.ReadableMap

data class DraftJsSelection(
        val startKey: String,
        val startOffset: Int,
        val endKey: String,
        val endOffset: Int,
        val hasFocus: Boolean
) {
    constructor(rawSelection: ReadableMap) : this(
            rawSelection.getString("startKey"),
            rawSelection.getInt("startOffset"),
            rawSelection.getString("endKey"),
            rawSelection.getInt("endOffset"),
            rawSelection.getBoolean("hasFocus")
    )
}