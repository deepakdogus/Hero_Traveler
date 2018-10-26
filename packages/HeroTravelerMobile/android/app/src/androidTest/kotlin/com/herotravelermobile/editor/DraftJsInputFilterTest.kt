package com.herotravelermobile.editor

import android.text.Selection
import android.text.SpannableString
import android.text.Spanned
import com.nhaarman.mockitokotlin2.any
import com.nhaarman.mockitokotlin2.inOrder
import com.nhaarman.mockitokotlin2.mock
import com.nhaarman.mockitokotlin2.never
import com.nhaarman.mockitokotlin2.times
import com.nhaarman.mockitokotlin2.verify
import org.junit.Test
import org.junit.runner.RunWith
import org.mockito.junit.MockitoJUnitRunner
import kotlin.test.assertEquals

@RunWith(MockitoJUnitRunner::class)
class DraftJsInputFilterTest {
    val text = SpannableString("Foo bar")

    init {
        text.setSpan(Selection.SELECTION_START, 3, 3, Spanned.SPAN_POINT_POINT or Spanned.SPAN_INTERMEDIATE)
        text.setSpan(Selection.SELECTION_END, 3, 3, Spanned.SPAN_POINT_POINT)
    }

    private val onInsertTextMock: (String) -> Unit = mock{}
    private val onBackspaceMock: () -> Unit = mock{}
    private val onNewlineMock: () -> Unit = mock{}
    private val onReplaceRangeMock: (String, IntRange) -> Unit = mock{}

    private val filter = DraftJsInputFilter(
            onInsertTextMock,
            onBackspaceMock,
            onNewlineMock,
            onReplaceRangeMock
    )

    @Test
    fun filter_blocksInsertion() {
        val result = filter.filter("e", 0, 1, text, 3, 3).toString()

        assertEquals("", result, "Filter must return empty string (which means blocking the insertion)")
    }

    @Test
    fun filter_blocksDeletion() {
        val result = filter.filter("", 0, 0, text, 3, 4).toString()

        assertEquals(" ", result)
    }

    @Test
    fun filter_callsOnInsert() {
        filter.filter("Fooe", 3, 4, text, 3, 3)

        verify(onInsertTextMock, times(1))("e")
        verify(onReplaceRangeMock, never())(any(), any())
    }

    @Test
    fun filter_callsOnBackspace() {
        filter.filter("", 0, 0, text, 1, 3)

        verify(onInsertTextMock, never())(any())
        verify(onBackspaceMock, times(2))()
        verify(onReplaceRangeMock, never())(any(), any())
    }

    @Test
    fun filter_callsOnNewline() {
        filter.filter("Foo\n", 3, 4, text, 3, 3)

        verify(onInsertTextMock, never())(any())
        verify(onNewlineMock, times(1))()
        verify(onReplaceRangeMock, never())(any(), any())
    }

    @Test
    fun filter_multilineInsertWorks() {
        val multilineText = "multiline\ntext"
        filter.filter(multilineText, 0, multilineText.length, text, 3, 3)

        inOrder(onInsertTextMock, onNewlineMock) {
            verify(onInsertTextMock, times(1))("multiline")
            verify(onNewlineMock, times(1))()
            verify(onInsertTextMock, times(1))("text")
            verifyNoMoreInteractions()
        }
        verify(onReplaceRangeMock, never())(any(), any())
    }

    @Test
    fun filter_multipleNewlines() {
        filter.filter("\n\n", 0, 2, text, 3, 3)

        verify(onNewlineMock, times(2))()
        verify(onInsertTextMock, never())(any())
    }

    @Test
    fun filter_insertionNotAtCursorCallsReplace() {
        filter.filter("x", 0, 1, text, 2, 2)

        verify(onInsertTextMock, never())(any())
        verify(onReplaceRangeMock, times(1))("x", 2 until 2)
    }

    @Test
    fun filter_removalNotAtCursorCallsReplace() {
        filter.filter("", 0, 0, text, 1, 2)

        verify(onBackspaceMock, never())()
        verify(onReplaceRangeMock, times(1))("", 1 until 2)
    }

    @Test
    fun filter_autoCorrectCallsReplace() {
        filter.filter("x", 0, 1, text, 0, 1)

        verify(onInsertTextMock, never())(any())
        verify(onBackspaceMock, never())()
        verify(onReplaceRangeMock, times(1))("x", 0 until 1)
    }

    @Test
    fun filter_multipleBackspaceCallsReplace() {
        filter.filter("", 0, 0, text, 1, 3)

        verify(onBackspaceMock, never())()
        verify(onReplaceRangeMock, times(1))("", 1 until 3)
    }
}