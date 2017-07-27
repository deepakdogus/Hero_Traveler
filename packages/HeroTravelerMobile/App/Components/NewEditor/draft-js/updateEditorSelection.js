import {EditorState} from './reexports'
import makeSelectionState from './makeSelectionState'

export default function updateEditorSelection(editorState, key, start, end) {
  const newSelectionState = makeSelectionState(key, key, start, end)
  return EditorState.forceSelection(
    editorState,
    newSelectionState
  )
}
