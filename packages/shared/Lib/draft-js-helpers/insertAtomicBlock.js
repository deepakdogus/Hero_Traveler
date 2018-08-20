import insertBlock from './insertBlock'

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

  const lastBlock = newEditorState.getCurrentContent().getLastBlock()

  if (lastBlock.getType() == 'atomic') {
    newEditorState = insertBlock(
      newEditorState,
      lastBlock.getKey(),
      {
        selectNewBlock: false,
      }
    )
  }

  return newEditorState
}
