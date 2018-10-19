package com.herotravelermobile.editor.model

import android.text.SpannableString
import android.text.SpannableStringBuilder
import com.facebook.react.bridge.ReadableMap
import com.herotravelermobile.utils.list
import com.herotravelermobile.utils.plusAssign

data class DraftJsContent(
        val blocks: List<ContentBlock>,
        private val blockFontTypes: Map<String, BlockFontType>? = null
) {
    val flatText: CharSequence

    private val flatOffsets = IntArray(blocks.size)
    private val keyToIndexMap = HashMap<String, Int>(blocks.size)

    init {
        val flatTextBuilder: Appendable =
                if (blockFontTypes != null) SpannableStringBuilder() else StringBuilder()

        var offset = 0

        for (i in blocks.indices) {
            val block = blocks[i]

            keyToIndexMap[block.key] = i

            val blockFontType = blockFontTypes?.get(block.type)
            val styledText = block.text.run {
                if (blockFontType != null) {
                    SpannableString(this).apply {
                        blockFontType.forEach { it.apply(this) }
                    }
                } else {
                    this
                }
            }

            flatOffsets[i] = offset
            offset += styledText.length + 1

            if (i == 0) {
                flatTextBuilder += styledText
            } else {
                flatTextBuilder += '\n'
                flatTextBuilder += styledText
            }
        }

        flatText = flatTextBuilder as CharSequence
    }

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

    data class ContentBlock(val key : String, val text: String, val type: String){
        companion object {
            fun fromMap(map: ReadableMap) =
                    map.list("blocks") {
                        ContentBlock(
                                getString("key"),
                                getString("text"),
                                getString("type")
                        )
                    }
        }
    }
}

