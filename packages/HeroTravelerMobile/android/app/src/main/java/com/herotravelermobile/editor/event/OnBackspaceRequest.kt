package com.herotravelermobile.editor.event

import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.RCTEventEmitter

class OnBackspaceRequest(viewTag: Int) : Event<OnBackspaceRequest>(viewTag) {
    companion object {
        const val EVENT_NAME = "onBackspaceRequest"
    }

    override fun getEventName() = EVENT_NAME

    override fun dispatch(rctEventEmitter: RCTEventEmitter) =
        rctEventEmitter.receiveEvent(viewTag, EVENT_NAME, null)

    override fun canCoalesce() = false
}
