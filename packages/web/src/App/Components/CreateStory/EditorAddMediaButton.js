import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import uploadFile, {
  getAcceptedFormats,
} from '../../Utils/uploadFile'
import {
  insertAtomicBlock,
} from '../../Shared/Lib/draft-js-helpers'
import Icon from '../Icon'
import styled from 'styled-components'
import StoryCreateActions from '../../Shared/Redux/StoryCreateRedux'
import { extractUploadData } from '../../Shared/Sagas/StorySagas'

const HiddenInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
`

class AddMediaButton extends React.Component {
  static propTypes = {
    uploadImage: PropTypes.func,
    getEditorState: PropTypes.func,
    setEditorState: PropTypes.func,
    type: PropTypes.string,
    theme: PropTypes.object,
  }

  uploadFile = (event) => {
    uploadFile(event, this, (file) => {
      if (!file) return
      const {getEditorState, type} = this.props

      const updateCall = (cloudinaryFile) => {
        let update
        if (cloudinaryFile) {
          const formattedFile = extractUploadData(cloudinaryFile)
          update = insertAtomicBlock(
            getEditorState(),
            type,
            formattedFile.url,
            formattedFile.height,
            formattedFile.width,
          )
        }
        else update = insertAtomicBlock(getEditorState(), type, file.uri)
        this.props.setEditorState(update)
      }

      if (file.type.includes('video')) {
        updateCall()
      }
      else {
        this.props.uploadImage(file.uri, updateCall)
      }
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
    <ConnectedAddMediaButton
      {...props}
      type="image"
    />
  )
}

export const AddVideoButton = (props) => {
  return (
    <ConnectedAddMediaButton
      {...props}
      type="video"
    />
  )
}

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    uploadImage: (file, callback) => dispatch(
      StoryCreateActions.uploadImage(file, callback),
    ),
  }
}

const ConnectedAddMediaButton = connect(mapStateToProps, mapDispatchToProps)(AddMediaButton)
