/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule keyCommandInsertNewline
 *
 */

'use strict';

import {EditorState} from './reexports'
import DraftModifier from './DraftModifier'

export default function keyCommandInsertNewline(editorState) {
  var contentState = DraftModifier.splitBlock(editorState.getCurrentContent(), editorState.getSelection());
  return EditorState.push(editorState, contentState, 'split-block');
}

module.exports = keyCommandInsertNewline;
