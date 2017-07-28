import {EditorState, Modifier} from './reexports'

export default function insertText(editorState, text) {
  const newContentState = Modifier.replaceText(
    editorState.getCurrentContent(),
    editorState.getSelection(),
    text,
    editorState.getCurrentInlineStyle()
  )

  console.log('newContentState', newContentState.getBlockForKey('0').getText())

  return EditorState.push(
    editorState,
    newContentState,
    'insert-characters'
  )
}
