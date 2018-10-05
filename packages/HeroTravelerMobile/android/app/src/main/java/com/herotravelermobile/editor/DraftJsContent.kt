package com.herotravelermobile.editor

import com.facebook.react.bridge.ReadableMap
import com.herotravelermobile.utils.list

class DraftJsContent(rawContent: ReadableMap) {
    private val entityMap: Any = Any()
    val blocks: List<BlockType>

    init {
        blocks = rawContent.list("blocks") {
            BlockType(
                    getString("text")
            )
        }
    }

    data class BlockType(val text: String)
}