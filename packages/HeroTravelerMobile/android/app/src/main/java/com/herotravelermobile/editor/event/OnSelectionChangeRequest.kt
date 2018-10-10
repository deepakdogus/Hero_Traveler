package com.herotravelermobile.editor.event

import com.facebook.react.bridge.Arguments
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.RCTEventEmitter
import com.herotravelermobile.editor.model.DraftJsSelection

class OnSelectionChangeRequest(viewTag: Int, private val selection: DraftJsSelection)
    : Event<OnSelectionChangeRequest>(viewTag) {
    companion object {
        const val EVENT_NAME = "onSelectionChangeRequest"
    }

    override fun getEventName() = EVENT_NAME

    override fun dispatch(rctEventEmitter: RCTEventEmitter) {
        Arguments.createMap().run {
            putString("startKey", selection.startKey)
            putInt("startOffset", selection.startOffset)
            putString("endKey", selection.endKey)
            putInt("endOffset", selection.endOffset)
            putBoolean("hasFocus", selection.hasFocus)
            rctEventEmitter.receiveEvent(viewTag, eventName, this)
        }
    }
}
