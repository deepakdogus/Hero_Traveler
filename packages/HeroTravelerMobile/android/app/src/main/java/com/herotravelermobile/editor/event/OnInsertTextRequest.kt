package com.herotravelermobile.editor.event

import com.facebook.react.bridge.Arguments
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.RCTEventEmitter

class OnInsertTextRequest(viewTag: Int, private val text: String):
        Event<OnInsertTextRequest>(viewTag) {
    companion object {
        const val EVENT_NAME = "onInsertTextRequest"
    }

    override fun getEventName() = EVENT_NAME

    override fun dispatch(rctEventEmitter: RCTEventEmitter) {
        Arguments.createMap().run {
            putString("text", text)
            rctEventEmitter.receiveEvent(viewTag, eventName, this)
        }
    }

    override fun canCoalesce() = false
}