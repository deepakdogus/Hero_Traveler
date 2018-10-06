package com.herotravelermobile.editor


import android.support.test.runner.AndroidJUnit4
import android.text.Selection.SELECTION_END
import android.text.Selection.SELECTION_START
import android.text.SpannableStringBuilder
import android.text.Spanned.*
import android.text.style.SubscriptSpan
import android.text.style.UnderlineSpan
import org.junit.Test
import org.junit.runner.RunWith
import kotlin.test.assertEquals
import kotlin.test.assertTrue


@RunWith(AndroidJUnit4::class)
class SelectionBlockingTextTest {
    private val spannable = SpannableStringBuilder("foo")

    @Test
    fun setSpanBlocksSelection() {
        val editable = SelectionBlockingText(spannable)

        editable.setSpan(SELECTION_START, 1, 1, SPAN_POINT_POINT)

        assertTrue(
                editable.getSpans(0, editable.length, SELECTION_START.javaClass).isEmpty(),
                "SELECTION_START must be blocked"
        )
    }

    @Test
    fun setSpanAddsOther() {
        val editable = SelectionBlockingText(spannable)
        val span = UnderlineSpan()

        editable.setSpan(span, 1, 2, SPAN_EXCLUSIVE_EXCLUSIVE)

        assertEquals(1, editable.getSpanStart(span), "UnderlineSpan must not be blocked")
    }

    @Test
    fun removeSpanLeavesSelection() {
        spannable.setSpan(SELECTION_START, 1, 1, SPAN_POINT_POINT)
        val editable = SelectionBlockingText(spannable)

        editable.removeSpan(SELECTION_START)

        assertEquals(1, editable.getSpanStart(SELECTION_START), "removeSpan() removes selection")
    }

    @Test
    fun removeSpanRemovesOther() {
        val span = UnderlineSpan()
        spannable.setSpan(span, 1, 2, SPAN_EXCLUSIVE_EXCLUSIVE)
        val editable = SelectionBlockingText(spannable)

        editable.removeSpan(span)

        assertTrue(
                editable.getSpans(0, editable.length, UnderlineSpan::class.java).isEmpty(),
                "UnderlineSpan must be removable"
        )
    }

    @Test
    fun clearSpanRemovesOtherOnly() {
        spannable.setSpan(SELECTION_START, 0, 0, SPAN_POINT_POINT or SPAN_INTERMEDIATE)
        spannable.setSpan(SELECTION_END, 3, 3, SPAN_POINT_POINT)
        spannable.setSpan(UnderlineSpan(), 0, 1, SPAN_EXCLUSIVE_EXCLUSIVE)
        spannable.setSpan(SubscriptSpan(), 2, 3, SPAN_EXCLUSIVE_EXCLUSIVE)
        val editable = SelectionBlockingText(spannable)

        editable.clearSpans()

        val spans = editable.getSpans(0, 3, Object::class.java)
        assertEquals(2, spans.size, "Only two spans must remain")
        assertTrue(SELECTION_START in spans, "SELECTION_START must remain")
        assertTrue(SELECTION_END in spans, "SELECTION_END must remain")
    }

    @Test
    fun clearSpanRemovesAllIfNoSelection() {
        spannable.setSpan(UnderlineSpan(), 0, 1, SPAN_EXCLUSIVE_EXCLUSIVE)
        spannable.setSpan(SubscriptSpan(), 2, 3, SPAN_EXCLUSIVE_EXCLUSIVE)
        val editable = SelectionBlockingText(spannable)

        editable.clearSpans()

        assertTrue(
                editable.getSpans(0, editable.length, Object::class.java).isEmpty(),
                "clearSpans() must clear all spans"
        )
    }
}