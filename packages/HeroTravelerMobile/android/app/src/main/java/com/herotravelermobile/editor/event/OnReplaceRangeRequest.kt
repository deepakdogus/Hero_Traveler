package com.herotravelermobile.editor.event

import com.facebook.react.bridge.Arguments
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.RCTEventEmitter
import com.herotravelermobile.editor.model.Address

class OnReplaceRangeRequest(
        viewTag: Int,
        private val replacement: String,
        private val startAddress: Address,
        private val endAddress: Address
) : Event<OnReplaceRangeRequest>(viewTag) {
    companion object {
        const val EVENT_NAME = "onReplaceRangeRequest"
    }

    override fun getEventName() = EVENT_NAME

    override fun dispatch(rctEventEmitter: RCTEventEmitter) {
        Arguments.createMap().apply {
            putString("word", replacement)
            putString("startKey", startAddress.key)
            putInt("startOffset", startAddress.offset)
            putString("endKey", endAddress.key)
            putInt("endOffset", endAddress.offset)
            rctEventEmitter.receiveEvent(viewTag, EVENT_NAME, this)
        }
    }

    override fun canCoalesce() = false
}