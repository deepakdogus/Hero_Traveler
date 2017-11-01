/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule oldCustomKeyCommandInsertNewline
 *
 */

'use strict';

import {EditorState} from './reexports'
import oldCustomDraftModifier from './oldCustomDraftModifier'

export default function oldCustomKeyCommandInsertNewline(editorState, textType) {
  var contentState = oldCustomDraftModifier.splitBlock(editorState.getCurrentContent(), editorState.getSelection(), textType);
  return EditorState.push(editorState, contentState, 'split-block');
}

module.exports = oldCustomKeyCommandInsertNewline;
