import {keyCommandPlainBackspace} from './reexports'

export default function handleBackspace(editorState) {
  // const selection = editorState.getSelection()
  // const startKey = selection.getStartKey()
  // const content = editorState.getCurrentContent()
  // const blockBefore = content.getBlockBefore(startKey)
  //
  // if (blockBefore && blockBefore.getType() === 'atomic') {
  //   const blockMap = content.getBlockMap().delete(blockBefore.getKey());
  //   const withoutAtomicBlock = content.merge(
  //     {blockMap, selectionAfter: selection}
  //   )
  //   if (withoutAtomicBlock !== content) {
  //     console.log('remove atomic block')
  //     return EditorState.push(
  //       editorState,
  //       withoutAtomicBlock,
  //       'remove-range',
  //     )
  //   }
  // }

  return keyCommandPlainBackspace(editorState)
}
