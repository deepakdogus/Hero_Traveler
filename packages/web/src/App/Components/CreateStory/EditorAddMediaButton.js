import React from 'react'
import PropTypes from 'prop-types'
import uploadFile, {
  getAcceptedFormats,
} from '../../Utils/uploadFile'
import {
  insertAtomicBlock,
} from '../../Shared/Lib/draft-js-helpers'
import Icon from '../Icon'
import styled from 'styled-components'

const HiddenInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
`

export class AddMediaButton extends React.Component {
  static propTypes = {
    getEditorState: PropTypes.func,
    setEditorState: PropTypes.func,
    type: PropTypes.string,
    theme: PropTypes.object,
  }

  uploadFile = (event) => {
    uploadFile(event, this, (file) => {
      if (!file) return
      const {getEditorState, type} = this.props
      const update = insertAtomicBlock(getEditorState(), type, file.uri)
      this.props.setEditorState(update)
    })
  }

  preventBubblingUp = (event) => event.preventDefault()
  setAddImageInputRef = (ref) => this.addImageInputRef = ref

  render() {
    const { theme, type } = this.props
    const className = theme.button

    return (
      <div
        className={theme.buttonWrapper}
        onMouseDown={this.preventBubblingUp}
      >
        <button
          className={className}
          type="button"
        >
          <label htmlFor={`${type}_upload`}>
            <Icon name={type === 'image' ? 'createPhoto' : 'createVideo' } />
            <HiddenInput
              ref={this.setAddImageInputRef}
              className={theme.buttonWrapper}
              type='file'
              accept={getAcceptedFormats(type)}
              id={`${type}_upload`}
              name='storyImage'
              onChange={this.uploadFile}
            />
          </label>
        </button>
      </div>
    )
  }
}

export const AddImageButton = (props) => {
  return (
    <AddMediaButton
      {...props}
      type="image"
    />
  )
}

export const AddVideoButton = (props) => {
  return (
    <AddMediaButton
      {...props}
      type="video"
    />
  )
}
