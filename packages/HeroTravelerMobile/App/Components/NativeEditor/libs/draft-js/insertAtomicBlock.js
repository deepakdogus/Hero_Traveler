import insertBlock from './insertBlock'
import updateSelectionAnchorAndFocus from './updateSelectionAnchorAndFocus'
import updateSelectionHasFocus from './updateSelectionHasFocus'

export default function insertAtomicBlock(editorState, type, url) {
  const selectionState = editorState.getSelection()

  const hasFocus = selectionState.getHasFocus()
  const selectedBlockKey = selectionState.getAnchorKey()
  const lastBlockKey = editorState.getCurrentContent().getLastBlock().getKey()

  // If no input has yet been focused, insert image at the end of the content state
  const insertAfterKey = hasFocus ? selectedBlockKey : lastBlockKey

  var newEditorState = insertBlock(
    editorState,
    insertAfterKey,
    {
      type: 'atomic',
      data: {
        type: type,
        url: url
      },
    }
  )

  // If new atomic block is the last block, create a text block at the end
  const newAtomicBlockKey = newEditorState.getCurrentContent().getBlockAfter(insertAfterKey).getKey()
  const newLastBlockKey = newEditorState.getCurrentContent().getLastBlock().getKey()

  if (newAtomicBlockKey == newLastBlockKey) {
    newEditorState = insertBlock(
      newEditorState,
      newLastBlockKey,
      {
        type: 'unstyled'
      }
    )
  }

  // Take focus and move cursor after the image
  const blockToSelect = newEditorState.getCurrentContent().getBlockAfter(newAtomicBlockKey).getKey()
  newEditorState = updateSelectionHasFocus(newEditorState, true)
  newEditorState = updateSelectionAnchorAndFocus(newEditorState, blockToSelect, 0, blockToSelect, 0)

  return newEditorState
}
