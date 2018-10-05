package com.herotravelermobile.editor

import com.facebook.react.bridge.ReadableMap

class DraftJsContent(rawContent: ReadableMap) {
    private val entityMap: Any = Any()
    val blocks: List<BlockType>

    init {

        blocks = rawContent.getArray("blocks").run {
            (0 until size()).map {
                getMap(it).run {
                    BlockType(
                            getString("text")
                    )
                }
            }
        }
    }

    data class BlockType(val text: String)
}