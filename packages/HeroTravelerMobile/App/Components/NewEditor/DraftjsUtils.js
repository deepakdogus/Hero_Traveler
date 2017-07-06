import {Map, List} from 'immutable'
import EditorState from 'draft-js/lib/EditorState'
import RichUtils from 'draft-js/lib/RichTextEditorUtil'
import SelectionState from 'draft-js/lib/SelectionState'
import Modifier from 'draft-js/lib/DraftModifier'
import genKey from 'draft-js/lib/generateRandomKey'
import ContentBlock from 'draft-js/lib/ContentBlock'
import AtomicBlockUtils from 'draft-js/lib/AtomicBlockUtils'
import keyCommandInsertNewline from 'draft-js/lib/keyCommandInsertNewline'
import keyCommandPlainBackspace from 'draft-js/lib/keyCommandPlainBackspace'
import _ from 'lodash'

export const makeSelectionState = (key, start, end, hasFocus) => {
  return SelectionState
    .createEmpty(key)
    .merge({
      anchorKey: key,
      anchorOffset: start,
      focusKey: key,
      focusOffset: end,
      hasFocus: hasFocus || false
    })
}

export const updateEditorSelection = (editorState, key, start, end) => {
  const newSelectionState = makeSelectionState(key, start, end)
  return EditorState.forceSelection(
    editorState,
    newSelectionState
  )
}

export const insertText = (editorState, text) => {
  const newContentState = Modifier.replaceText(
    editorState.getCurrentContent(),
    editorState.getSelection(),
    text,
    editorState.getCurrentInlineStyle()
  )

  return EditorState.push(
    editorState,
    newContentState,
    'insert-characters'
  )
}

export const updateBlockText = (editorState, key, text) => {
  const contentState = editorState.getCurrentContent()
  const block = contentState.getBlockForKey(key)
  editorState = updateEditorSelection(editorState, key, 0, _.size(block.getText()))

  const newContentState = Modifier.replaceText(
    contentState,
    editorState.getSelection(),
    text,
    editorState.getCurrentInlineStyle()
  )

  return EditorState.push(
    editorState,
    newContentState,
    'insert-characters'
  )
}

export const getLastBlockKey = (editorState) => {
  return editorState.getCurrentContent().getLastBlock().getKey()
}

// export const getNextBlockKey = (editorState)  => {
//   return editorState.getSelection().getLastBlock().getKey()
// }

export const insertBlock = (editorState, blockKey, options = {}) => {
  _.defaults(options, {
    type: 'unstyled',
    direction: 'after',
    text: ' ',
    data: {},
    selection: editorState.getSelection(),
    focusNewBlock: false
  })
  const contentState = editorState.getCurrentContent()
  const currentBlock = contentState.getBlockForKey(blockKey)
  const blockMap = contentState.getBlockMap()

  const blocksBefore = blockMap.toSeq().takeUntil(v => v === currentBlock)
  const blocksAfter = blockMap.toSeq().skipUntil(v => v === currentBlock).rest()
  const newBlockKey = genKey()
  const newBlock = new ContentBlock({
    key: newBlockKey,
    type: options.type,
    text: options.text,
    characterList: List(),
    data: Map(options.data)
  })

  let newBlocks = options.direction === 'before' ? [
    [newBlockKey, newBlock],
    [currentBlock.getKey(), currentBlock],
  ] : [
    [currentBlock.getKey(), currentBlock],
    [newBlockKey, newBlock],
  ]

  let nextSelection

  if (options.focusNewBlock === true) {
    nextSelection = makeSelectionState(newBlockKey, 0, 0)
  } else {
    nextSelection = options.selection
  }

  const newBlockMap = blocksBefore.concat(newBlocks, blocksAfter).toOrderedMap()
  const newContentState = contentState.merge({
    blockMap: newBlockMap,
    selectionBefore: nextSelection,
    selectionAfter: nextSelection,
  })
  let newState = EditorState.push(editorState, newContentState, 'insert-fragment')
  newState = EditorState.acceptSelection(newState, nextSelection)
  return newState
}

export const insertImage = (editorState, blockKey, url) => {
  const type = 'image'
  const contentState = editorState.getCurrentContent()
  const contentStateWithEntity = contentState.createEntity(type, 'IMMUTABLE', {src: url})
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
  const newEditorState = AtomicBlockUtils.insertAtomicBlock(
    editorState,
    entityKey,
    ' '
  )

  return newEditorState
}

export const applyStyle = (editorState, styleType) => {
  return RichUtils.handleKeyCommand(editorState, styleType)
}

export const handleReturn = (editorState) => {
  const content = editorState.getCurrentContent()
  const selection = editorState.getSelection()
  const selectedBlock = content.getBlockForKey(selection.getStartKey())

  // Return on atomics inserts and focuses a new block
  if (selectedBlock.getType() === 'atomic') {
    let newEditorState = insertBlock(editorState, selectedBlock.getKey())
    const newBlock = newEditorState.getCurrentContent().getLastBlock()
    newEditorState = EditorState.acceptSelection(newEditorState, makeSelectionState(newBlock.getKey(), 0, 0))
    return newEditorState
  }

  return keyCommandInsertNewline(editorState)
}

export const toggleStyle = (editorState, style) => {
  return RichUtils.toggleBlockType(editorState, style)
}

export const handleBackspace = (editorState) => {
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