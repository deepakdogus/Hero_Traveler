import {EditorState, Modifier} from '.'
import insertBlock from './insertBlock'

export default function insertText(editorState, text) {
  const content = editorState.getCurrentContent()
  const selection = editorState.getSelection()

  const selectedKey = selection.getStartKey()
  const selectionType = content.getBlockForKey(selectedKey).getType()

  var newEditorState = editorState

  // If the current selection is an atomic block, create a new unstyled block underneth
  if (selectionType == 'atomic') {
    newEditorState = insertBlock(
      editorState,
      selectedKey,
      {
        type: 'unstyled',
        selectNewBlock: true,
      }
    )
  }

  const newContentState = Modifier.replaceText(
    newEditorState.getCurrentContent(),
    newEditorState.getSelection(),
    text,
    newEditorState.getCurrentInlineStyle()
  )

  return EditorState.push(
    newEditorState,
    newContentState,
    'insert-characters'
  )
}
