package com.herotravelermobile.editor.model

import android.graphics.Color
import android.graphics.Typeface
import android.text.Layout
import android.text.Spannable
import android.text.Spanned
import android.text.style.AbsoluteSizeSpan
import android.text.style.AlignmentSpan
import android.text.style.ForegroundColorSpan
import android.text.style.StyleSpan
import com.facebook.react.bridge.Dynamic
import com.facebook.react.bridge.ReadableType

sealed class FontParam {
    abstract fun createSpan(): Any?

    fun apply(text: Spannable) {
        createSpan()?.apply { text.setSpan(this, 0, text.length, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE) }
    }

    companion object {
        fun fromEntry(entry: Map.Entry<String, Dynamic>): FontParam? {
            return when (entry.key) {
                "fontSize" -> FontSizeParam(entry.value.asInt())
                "color" -> FontColorParam(
                        entry.value.run {
                            if (type == ReadableType.Number)
                                asInt()
                            else
                                Color.parseColor(asString())
                        }
                )
                "fontWeight" -> FontWeightParam(
                        entry.value.run {
                            if (type == ReadableType.Number) {
                                asInt()
                            } else {
                                when (asString()) {
                                    "normal" -> 400
                                    "bold" -> 700
                                    else -> asString().toInt()
                                }
                            }
                        }
                )
                "fontStyle" -> FontStyleParam(entry.value.asString())
                "textAlign" -> TextAlignParam(entry.value.asString())
                else -> null
            }
        }
    }
}

class FontSizeParam(private val fontSize: Int) : FontParam() {
    override fun createSpan() = AbsoluteSizeSpan(fontSize, true)
}

class FontColorParam(private val color: Int) : FontParam() {
    override fun createSpan() =
            ForegroundColorSpan(color)
}

class FontWeightParam(private val weight: Int) : FontParam() {
    override fun createSpan() = if (weight >= 500) StyleSpan(Typeface.BOLD) else null
}

class FontStyleParam(private val style: String) : FontParam() {
    override fun createSpan() = if (style == "italic") StyleSpan(Typeface.ITALIC) else null
}

class TextAlignParam(private val value: String) : FontParam() {
    override fun createSpan() = when (value) {
        "left" -> Layout.Alignment.ALIGN_NORMAL
        "right" -> Layout.Alignment.ALIGN_OPPOSITE
        "center" -> Layout.Alignment.ALIGN_CENTER
        else -> null
    }?.let { AlignmentSpan { it } }
}