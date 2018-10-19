package com.herotravelermobile.utils

import com.facebook.react.bridge.Dynamic
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableMapKeySetIterator

/**
 * Returns a [List] of elements of array with key [[name]], mapped to class [T] by [elementMapper].
 * The elements must be [ReadableMap]s and will be passed to the mapper as receiver
 */
inline fun <T> ReadableMap.list(name: String, elementMapper: ReadableMap.() -> T) =
        getArray(name).run {
            (0 until size()).map {
                getMap(it).run {
                    elementMapper(this)
                }
            }
        }

inline fun <T> ReadableMap.toMap(elementMapper: ReadableMap.() -> T): Map<String, T> =
        HashMap<String, T>().also { map ->
            mapsIterator().forEach { map[it.key] = elementMapper(it.value) }
        }

private inline fun <T> ReadableMap.iterator(crossinline elementMapper: (String) -> T) =
        object : Iterator<Map.Entry<String, T>> {
            private val iter: ReadableMapKeySetIterator = keySetIterator()

            override fun hasNext() = iter.hasNextKey()

            override fun next(): Map.Entry<String, T> =
                    object : Map.Entry<String, T> {
                        private val k = iter.nextKey()

                        override val key = k
                        override val value = elementMapper(k)
                    }
        }

fun ReadableMap.mapsIterator(): Iterator<Map.Entry<String, ReadableMap>> = iterator(this::getMap)

fun ReadableMap.dynamicIterator(): Iterator<Map.Entry<String, Dynamic>> = iterator(this::getDynamic)