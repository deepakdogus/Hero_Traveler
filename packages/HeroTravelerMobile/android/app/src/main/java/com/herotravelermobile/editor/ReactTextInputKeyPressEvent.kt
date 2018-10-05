/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

package com.herotravelermobile.editor

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.RCTEventEmitter
import com.facebook.react.views.textinput.ReactTextInputEvent

/**
 * Event emitted by EditText native view when key pressed
 */
class ReactTextInputKeyPressEvent internal constructor(viewId: Int, private val mKey: String)
    : Event<ReactTextInputEvent>(viewId) {

    override fun getEventName() = EVENT_NAME

    // We don't want to miss any textinput event, as event data is incremental.
    override fun canCoalesce() = false

    override fun dispatch(rctEventEmitter: RCTEventEmitter) =
            rctEventEmitter.receiveEvent(viewTag, eventName, serializeEventData())

    private fun serializeEventData(): WritableMap {
        val eventData = Arguments.createMap()
        eventData.putString("key", mKey)

        return eventData
    }

    companion object {
        val EVENT_NAME = "topKeyPress"
    }
}
