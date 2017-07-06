import React from 'react'
import _ from 'lodash'

import convertToRaw from 'draft-js/lib/convertFromDraftStateToRaw'

import TextBlock from './TextBlock'

export const getBlocks = (
  editorState,
  focusedBlock,
  customStyles,
  onChange,
  onKeyPress,
  onSelectionChange,
  onFocus,
  onBlur,
) => {
  const selectionState = editorState.getSelection()
  const {blocks, entityMap} = convertToRaw(editorState.getCurrentContent())

  return _.map(blocks, block => {
    const blockData = {
      key: block.key,
      text: block.text,
      type: block.type,
      data: block.data,
      blockKey: block.key,
      inlineStyles: block.inlineStyleRanges,
      entityRanges: block.entityRanges,
      onFocus: onFocus,
      onBlur: onBlur,
      isFocused: block.key === focusedBlock,
      onSelectionChange: onSelectionChange,
      onKeyPress: onKeyPress,
      selection: {
        start: selectionState.getStartOffset(),
        end: selectionState.getEndOffset()
      }
    }

    let type

    if (block.type === 'atomic' && block.data.type) {
      type = block.data.type
    } else {
      type = block.type
    }

    switch(type) {

      case 'header-one':
      case 'paragraph':
      case 'unstyled':
      case 'image':
      case 'video':
        return (
          <TextBlock
            {...blockData}
            type={type}
            customStyles={customStyles}
            onChange={onChange}
            entityMap={entityMap}
          />
        )
    }

  })
}
