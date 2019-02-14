import {
  EditorState,
  Modifier,
  SelectionState,
} from 'draft-js'
import { createSelectionWithFocus } from '.'

// see https://github.com/facebook/draft-js/issues/1510
// for remove atomic block logic
export default function removeMedia(key, editorState, length) {
  const contentState = editorState.getCurrentContent()
  let selectKey = contentState.getKeyAfter(key) || contentState.getKeyBefore(key)

  const selection = createSelectionWithFocus(selectKey)

  const newSelectionStateOptions = {
    anchorKey: key,
    anchorOffset: 0,
    focusKey: key,
  }
  if (length) newSelectionStateOptions.focusOffset = length

  const withoutAtomicEntity = Modifier.removeRange(
    contentState,
    new SelectionState(newSelectionStateOptions),
    'backward',
  )

  const blockMap = withoutAtomicEntity.getBlockMap().delete(key)
  var withoutAtomic = withoutAtomicEntity.merge({
    blockMap,
    selectionAfter: selection,
  })

  const newEditorState = EditorState.push(
    editorState,
    withoutAtomic,
    'remove-range',
  )

  return newEditorState
}
