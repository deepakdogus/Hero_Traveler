/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

package com.herotravelermobile.editor

import com.herotravelermobile.editor.model.DraftJsContent

/**
 * Class that contains the data needed for a text update.
 * Used by both <Text></Text> and <TextInput></TextInput>
 */
data class ReactTextUpdate(
        val content: DraftJsContent,
        val containsImages: Boolean,
        val paddingLeft: Float,
        val paddingTop: Float,
        val paddingRight: Float,
        val paddingBottom: Float,
        val textAlign: Int,
        val textBreakStrategy: Int
)