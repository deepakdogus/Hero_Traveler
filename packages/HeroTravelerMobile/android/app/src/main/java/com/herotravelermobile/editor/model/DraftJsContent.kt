package com.herotravelermobile.editor.model

import com.facebook.react.bridge.ReadableMap
import com.herotravelermobile.utils.list
import com.herotravelermobile.utils.plusAssign

data class DraftJsContent(
        val blocks: List<ContentBlock>
) {
    val flatText: CharSequence

    private val flatOffsets = IntArray(blocks.size)
    private val keyToIndexMap = HashMap<String, Int>(blocks.size)

    init {
        val flatTextBuilder = StringBuilder()
        var offset = 0

        for (i in 0 until blocks.size) {
            val block = blocks[i]

            keyToIndexMap[block.key] = i

            flatOffsets[i] = offset
            offset += block.text.length + 1

            if (i == 0) {
                flatTextBuilder += block.text
            } else {
                flatTextBuilder += '\n'
                flatTextBuilder += block.text
            }
        }

        flatText = flatTextBuilder
    }

    constructor (rawContent: ReadableMap) : this(
            rawContent.list("blocks") {
                ContentBlock(
                        getString("key"),
                        getString("text")
                )
            }
    )

    operator fun get(key: String) = keyToIndexMap[key]

    fun addressToFlatIndex(addr: Address) = addressToFlatIndex(addr.key, addr.offset)

    fun addressToFlatIndex(key: String, offset: Int): Int {
        val index = keyToIndexMap[key]
        return if (index != null) flatOffsets[index] + offset else -1
    }

    fun flatIndexToAddress(index: Int): Address {
        val blockIndex = flatOffsets.binarySearch(index).let {
            if (it >= 0) it else -it - 2
        }
        return Address(blocks[blockIndex].key, index - flatOffsets[blockIndex])
    }

    data class ContentBlock(val key : String, val text: String)
}

