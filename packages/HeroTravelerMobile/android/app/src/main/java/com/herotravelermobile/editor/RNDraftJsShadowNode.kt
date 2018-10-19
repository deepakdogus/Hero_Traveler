/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

package com.herotravelermobile.editor

import android.os.Build
import android.support.v4.view.ViewCompat
import android.text.Layout
import android.view.ViewGroup
import android.widget.EditText
import com.facebook.infer.annotation.Assertions
import com.facebook.react.bridge.JSApplicationIllegalArgumentException
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.common.annotations.VisibleForTesting
import com.facebook.react.uimanager.Spacing
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIViewOperationQueue
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.views.text.ReactBaseTextShadowNode
import com.facebook.react.views.textinput.ReactTextInputLocalData
import com.facebook.react.views.view.MeasureUtil
import com.facebook.yoga.YogaMeasureFunction
import com.facebook.yoga.YogaMeasureMode
import com.facebook.yoga.YogaMeasureOutput
import com.facebook.yoga.YogaNode
import com.herotravelermobile.editor.model.BlockFontType
import com.herotravelermobile.editor.model.DraftJsContent
import com.herotravelermobile.editor.model.FontParam
import com.herotravelermobile.utils.dynamicIterator
import com.herotravelermobile.utils.toMap

@VisibleForTesting
class RNDraftJsShadowNode : ReactBaseTextShadowNode(), YogaMeasureFunction {
    private lateinit var dummyEditText: EditText
    private var localData: ReactTextInputLocalData? = null

    private lateinit var content: DraftJsContent

    private var blockFontTypes: Map<String, BlockFontType>? = null

    init {
        mTextBreakStrategy = if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M)
            0
        else
            Layout.BREAK_STRATEGY_SIMPLE

        setMeasureFunction(this)
    }

    @ReactProp(name = "content")
    fun setContent(map: ReadableMap) {
        content = DraftJsContent(DraftJsContent.ContentBlock.fromMap(map), blockFontTypes)
        dirty()
        markUpdated()
    }

    @ReactProp(name = "blockFontTypes")
    fun setBlockFontTypes(types: ReadableMap) {
        this.blockFontTypes = types.toMap {
            HashSet<FontParam>().also { set ->
                dynamicIterator().forEach {
                    set.add(FontParam.fromEntry(it))
                }
            }
        }
        if (::content.isInitialized) {
            content = DraftJsContent(content.blocks, blockFontTypes)
            dirty()
            markUpdated()
        }
    }

    override fun setThemedContext(themedContext: ThemedReactContext) {
        super.setThemedContext(themedContext)

        // {@code EditText} has by default a border at the bottom of its view
        // called "underline". To have a native look and feel of the TextEdit
        // we have to preserve it at least by default.
        // The border (underline) has its padding set by the background image
        // provided by the system (which vary a lot among versions and vendors
        // of Android), and it cannot be changed.
        // So, we have to enforce it as a default padding.
        // TODO #7120264: Cache this stuff better.
        val editText = EditText(getThemedContext())
        setDefaultPadding(Spacing.START, ViewCompat.getPaddingStart(editText).toFloat())
        setDefaultPadding(Spacing.TOP, editText.paddingTop.toFloat())
        setDefaultPadding(Spacing.END, ViewCompat.getPaddingEnd(editText).toFloat())
        setDefaultPadding(Spacing.BOTTOM, editText.paddingBottom.toFloat())

        dummyEditText = editText

        // We must measure the EditText without paddings, so we have to reset them.
        dummyEditText.setPadding(0, 0, 0, 0)

        // This is needed to fix an android bug since 4.4.3 which will throw an NPE in measure,
        // setting the layoutParams fixes it: https://code.google.com/p/android/issues/detail?id=75877
        dummyEditText.layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT
        )
    }

    override fun measure(
            node: YogaNode,
            width: Float,
            widthMode: YogaMeasureMode,
            height: Float,
            heightMode: YogaMeasureMode
    ): Long {
        localData?.apply(dummyEditText) ?: return YogaMeasureOutput.make(0, 0)

        dummyEditText.measure(
                MeasureUtil.getMeasureSpec(width, widthMode),
                MeasureUtil.getMeasureSpec(height, heightMode)
        )

        return YogaMeasureOutput.make(dummyEditText.measuredWidth, dummyEditText.measuredHeight)
    }

    override fun isVirtualAnchor() = true

    override fun isYogaLeafNode() = true

    override fun setLocalData(data: Any?) {
        Assertions.assertCondition(data is ReactTextInputLocalData)
        localData = data as ReactTextInputLocalData?

        // Telling to Yoga that the node should be remeasured on next layout pass.
        dirty()

        // Note: We should NOT mark the node updated (by calling {@code markUpdated}) here
        // because the state remains the same.
    }

    override fun setTextBreakStrategy(textBreakStrategy: String?) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            return
        }

        mTextBreakStrategy = when (textBreakStrategy) {
            null, "simple" -> Layout.BREAK_STRATEGY_SIMPLE
            "highQuality" -> Layout.BREAK_STRATEGY_HIGH_QUALITY
            "balanced" -> Layout.BREAK_STRATEGY_BALANCED
            else -> throw JSApplicationIllegalArgumentException("Invalid textBreakStrategy: $textBreakStrategy")
        }
    }

    override fun onCollectExtraUpdates(uiViewOperationQueue: UIViewOperationQueue) {
        super.onCollectExtraUpdates(uiViewOperationQueue)

        if (::content.isInitialized) {
            val reactTextUpdate = ReactTextUpdate(
                    content,
                    mContainsImages,
                    getPadding(Spacing.LEFT),
                    getPadding(Spacing.TOP),
                    getPadding(Spacing.RIGHT),
                    getPadding(Spacing.BOTTOM),
                    mTextAlign,
                    mTextBreakStrategy
            )
            uiViewOperationQueue.enqueueUpdateExtraData(reactTag, reactTextUpdate)
        }
    }

    override fun setPadding(spacingType: Int, padding: Float) {
        super.setPadding(spacingType, padding)
        markUpdated()
    }
}
