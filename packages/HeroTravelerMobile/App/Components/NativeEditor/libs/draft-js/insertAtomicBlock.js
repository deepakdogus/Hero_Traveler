import insertBlock from './insertBlock'
import updateSelectionAnchorAndFocus from './updateSelectionAnchorAndFocus'
import updateSelectionHasFocus from './updateSelectionHasFocus'

export default function insertAtomicBlock(editorState, type, url, height, width) {
  const selectionState = editorState.getSelection()
  const selectedBlockKey = selectionState.getAnchorKey()

  // If no input has yet been focused, insert image at the end of the content state
  var newEditorState = insertBlock(
    editorState,
    selectedBlockKey,
    {
      type: 'atomic',
      data: {
        type: type,
        url: url,
        height: height,
        width: width,
      },
      selectNewBlock: true,
    }
  )

  return newEditorState
}
