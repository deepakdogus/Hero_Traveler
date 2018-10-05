package com.herotravelermobile.utils

import com.facebook.react.bridge.ReadableMap

/**
 * Returns a [List] of elements of array with key [[name]], mapped to class [T] by [elementMapper].
 * The elements must be [ReadableMap]s and will be passed to the mapper as receiver
 */
inline fun <T> ReadableMap.list(name : String, elementMapper : ReadableMap.() -> T) =
        getArray(name).run {
            (0 until size()).map {
                getMap(it).run {
                    elementMapper.invoke(this)
                }
            }
        }