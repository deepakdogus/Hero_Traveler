package com.herotravelermobile.editor.model

import android.graphics.Color
import android.graphics.Typeface
import android.text.Spannable
import android.text.Spanned
import android.text.style.AbsoluteSizeSpan
import android.text.style.ForegroundColorSpan
import android.text.style.StyleSpan
import com.facebook.react.bridge.Dynamic
import com.facebook.react.bridge.ReadableType

sealed class FontParam {
    abstract fun createSpan(): Any

    fun apply(text: Spannable) {
        text.setSpan(createSpan(), 0, text.length, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
    }

    companion object {
        fun fromEntry(entry: Map.Entry<String, Dynamic>): FontParam {
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
                else -> DummyParam()
            }
        }
    }
}

class DummyParam : FontParam() {
    companion object {
        private val dummySpan = Any()
    }
    override fun createSpan() = dummySpan // No need to create new instance
}

class FontSizeParam(private val fontSize: Int) : FontParam() {
    override fun createSpan() = AbsoluteSizeSpan(fontSize, true)
}

class FontColorParam(private val color: Int) : FontParam() {
    override fun createSpan() =
            ForegroundColorSpan(color)
}

class FontWeightParam(private val weight: Int) : FontParam() {
    override fun createSpan() =
            StyleSpan(if (weight < 500) Typeface.NORMAL else Typeface.BOLD)
}