import {EditorState, keyCommandInsertNewline} from './reexports'

import makeSelectionState from './makeSelectionState'
import insertBlock from './insertBlock'

export default function handleReturn(editorState) {
  const content = editorState.getCurrentContent()
  const selection = editorState.getSelection()
  const selectedBlock = content.getBlockForKey(selection.getStartKey())

  // Return on atomics inserts and focuses a new block
  if (selectedBlock.getType() === 'atomic') {
    let newEditorState = insertBlock(editorState, selectedBlock.getKey())
    const newBlock = newEditorState.getCurrentContent().getLastBlock()
    newEditorState = EditorState.acceptSelection(newEditorState, makeSelectionState(newBlock.getKey(), newBlock.getKey(), 0, 0))
    return newEditorState
  }

  return keyCommandInsertNewline(editorState)
}
