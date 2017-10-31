/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule OldDraftModifier
 * @typechecks
 *
 */

'use strict';
import {removeEntitiesAtEdges, removeRangeFromContentState} from './reexports'
var oldCustomSplitBlockInContentState = require('./oldCustomSplitBlockInContentState');

/**
 * `DraftModifier` provides a set of convenience methods that apply
 * modifications to a `ContentState` object based on a target `SelectionState`.
 *
 * Any change to a `ContentState` should be decomposable into a series of
 * transaction functions that apply the required changes and return output
 * `ContentState` objects.
 *
 * These functions encapsulate some of the most common transaction sequences.
 */

var oldCustomDraftModifier = {
  splitBlock: function splitBlock(contentState, selectionState, textType) {
    var withoutEntities = removeEntitiesAtEdges(contentState, selectionState);
    var withoutText = removeRangeFromContentState(withoutEntities, selectionState);

    return oldCustomSplitBlockInContentState(withoutText, withoutText.getSelectionAfter(), textType);
  },
};

module.exports = oldCustomDraftModifier;
