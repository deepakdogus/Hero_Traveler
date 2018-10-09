package com.herotravelermobile.editor.event

import com.facebook.react.bridge.Arguments
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.RCTEventEmitter
import com.herotravelermobile.editor.model.DraftJsSelection

const val EVENT_NAME = "onSelectionChangeRequest"

class OnSelectionChangeRequest(viewTag: Int, private val selection: DraftJsSelection)
    : Event<OnSelectionChangeRequest>(viewTag) {
    override fun getEventName() = EVENT_NAME

    override fun dispatch(rctEventEmitter: RCTEventEmitter) {
        val event = Arguments.createMap().apply {
            putString("startKey", selection.startKey)
            putInt("startOffset", selection.startOffset)
            putString("endKey", selection.endKey)
            putInt("endOffset", selection.endOffset)
            putBoolean("hasFocus", selection.hasFocus)
        }

        rctEventEmitter.receiveEvent(viewTag, eventName, event)
    }
}
