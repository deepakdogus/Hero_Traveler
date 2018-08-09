import {EditorState, Modifier} from '.'
import insertBlock from './insertBlock'

// TODO: Range: splitBlock only works when selection is collapsed, so this will need to change if we allow range selection
export default function keyCommandInsertNewline(editorState) {
  const content = editorState.getCurrentContent()
  const selection = editorState.getSelection()

  const selectedKey = selection.getStartKey()
  const selectionType = content.getBlockForKey(selectedKey).getType()

  if (selectionType == 'atomic') {
    return insertBlock(
      editorState,
      selectedKey,
      {
        type: 'unstyled',
        selectNewBlock: true,
      }
    )
  }

  var contentState = Modifier.splitBlock(
    editorState.getCurrentContent(),
    editorState.getSelection()
  )

  return EditorState.push(
    editorState,
    contentState,
    'split-block'
  )
}
