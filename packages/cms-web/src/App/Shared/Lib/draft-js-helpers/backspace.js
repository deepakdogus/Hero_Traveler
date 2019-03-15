import { EditorState } from '.'
import { keyCommandPlainBackspace, keyCommandBackspaceWord, keyCommandBackspaceToStartOfLine } from '.'
import makeSelectionState from './makeSelectionState'

export default function backspace(editorState, command) {
  const contentState = editorState.getCurrentContent()
  const selectionState = editorState.getSelection()

  const selectedKey = selectionState.getStartKey()
  const selectedOffset = selectionState.getStartOffset()

  var atomicBlockKeyToDelete = null

  if (contentState.getBlockForKey(selectedKey).getType() == 'atomic' && selectedOffset == 0) {
    atomicBlockKeyToDelete = selectedKey
  } else if (selectedOffset == 0) {
    const blockBeforeSelection = contentState.getBlockBefore(selectedKey)
    if (!blockBeforeSelection) {
      return null
    }

    if (blockBeforeSelection.getType() == 'atomic') {
      atomicBlockKeyToDelete = blockBeforeSelection.getKey()
    }
  }

  if (atomicBlockKeyToDelete) {
    const blockMap = contentState.getBlockMap();
    const atomicBlock = contentState.getBlockForKey(atomicBlockKeyToDelete)
    const newBlock = atomicBlock
      .delete('data')
      .merge({
        type: 'unstyled',
      })

    const newContentState = contentState.merge({
      blockMap: blockMap.set(atomicBlockKeyToDelete, newBlock),
      selectionAfter: makeSelectionState(atomicBlockKeyToDelete, atomicBlockKeyToDelete, 0, 0, true)
    })

    return EditorState.push(
      editorState,
      newContentState,
      'backspace'
    )
  }

  if (!command) {
    return keyCommandPlainBackspace(editorState);
  }

  switch (command) {
    // I do not believe you need delete or delete-word but leaving just it to your discretion
    // case 'delete':
    //   return keyCommandPlainDelete(editorState);
    // case 'delete-word':
    //   return keyCommandDeleteWord(editorState);
    case 'backspace':
      return keyCommandPlainBackspace(editorState);
    case 'backspace-word':
      return keyCommandBackspaceWord(editorState);
    case 'backspace-to-start-of-line':
      return keyCommandBackspaceToStartOfLine(editorState);
    default:
      return keyCommandPlainBackspace(editorState);
  }
}
