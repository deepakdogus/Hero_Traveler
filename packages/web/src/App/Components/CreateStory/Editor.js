import React from 'react'
import PropTypes from 'prop-types'
import {
  EditorState,
  Modifier,
  SelectionState,
  EditorBlock,
} from 'draft-js'
import DraftEditorPlaceholder from 'draft-js/lib/DraftEditorPlaceholder.react'
import 'draft-js/dist/Draft.css'
import 'draft-js-side-toolbar-plugin/lib/plugin.css'
import cx from 'draft-js/node_modules/fbjs/lib/cx'
import Editor from 'draft-js-plugins-editor'
import createSideToolbarPlugin from 'draft-js-side-toolbar-plugin'
import BlockTypeSelect from 'draft-js-side-toolbar-plugin/lib/components/BlockTypeSelect'
import styled from 'styled-components'
import {
  BoldButton,
  HeadlineOneButton,
} from 'draft-js-buttons'

import {
  convertFromRaw,
  convertToRaw,
  insertAtomicBlock,
} from './editorHelpers/draft-js'
import './Styles/EditorStyles.css'
import Image from '../Image'
import Video from '../Video'
import Icon from '../Icon'
import getImageUrl from '../../Shared/Lib/getImageUrl'
import {getVideoUrlBase} from '../../Shared/Lib/getVideoUrl'
import uploadFile from '../../Utils/uploadFile'
import {CloseXContainer} from './Shared'
import CloseX from '../CloseX'

const Caption = styled.p`
  font-weight: 400;
  font-size: 18px;
  color: ${props => props.theme.Colors.grey};
  letter-spacing: .7px;
  font-style: italic;
  text-align: center;
  margin-top: 0;
`

const StyledImage = styled(Image)`
  width: 100%;
`

const HiddenInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`

const BodyMediaDiv = styled.div`
  position: relative;
`

const CustomBlockTypeSelect = ({ getEditorState, setEditorState, theme }) => (
  <BlockTypeSelect
    getEditorState={getEditorState}
    setEditorState={setEditorState}
    theme={theme}
    structure={[
      BoldButton,
      AddImageButton,
      HeadlineOneButton,
      AddVideoButton,
    ]}
  />
)

const sideToolbarPlugin = createSideToolbarPlugin({
  structure: [CustomBlockTypeSelect]
})

const { SideToolbar } = sideToolbarPlugin

class CustomPlaceholder extends DraftEditorPlaceholder {
  shouldComponentUpdate(nextProps) {
    return this.props.text !== nextProps.text
  }

  render() {
    const className = cx({
      'public/DraftEditorPlaceholder/root': true,
      'public/DraftEditorPlaceholder/hasFocus': true,
    })

    const contentStyle = {
      whiteSpace: 'pre-wrap',
    };

    return (
      <div className={className}>
        <div
          className={cx('public/DraftEditorPlaceholder/inner')}
          id={this.props.accessibilityID}
          style={contentStyle}>
          {this.props.text}
        </div>
      </div>
    );
  }
}


class MediaComponent extends EditorBlock {
  onClickDelete = () => {
    const {key , onClickDelete} = this.props.blockProps
    onClickDelete(key, this.props.block.getLength())
  }

  setErrorState = () => this.setState({error: 'Failed to load asset'})

  getMediaComponent() {
    let {type, url, key} = this.props.blockProps
    const imageUrl = url.startsWith('data:')
      ? url
      : getImageUrl(url, 'contentBlock')
    const videoUrl = url.startsWith('data:')
      ? url
      : `${getVideoUrlBase()}/${url}`
    switch (type) {
      case 'image':
        return (
          <BodyMediaDiv key={key}>
            <CloseXContainer>
              <CloseX
                onClick={this.onClickDelete}
              />
            </CloseXContainer>
            <StyledImage src={imageUrl} />
          </BodyMediaDiv>
        )
      case 'video':
        return (
          <BodyMediaDiv key={key}>
            <Video
              src={videoUrl}
              withPrettyControls
              onError={this.onClickDelete}
            />
          </BodyMediaDiv>
        )
    }

  }

  render() {
    const {offsetKey, direction} = this.props
    const {text} = this.props.blockProps
    const className = cx({
      'public/DraftStyleDefault/block': true,
      'public/DraftStyleDefault/ltr': direction === 'LTR',
      'public/DraftStyleDefault/rtl': direction === 'RTL',
    })

    return (
      <div
        data-offset-key={offsetKey}
        className={className}
      >
        {this.getMediaComponent()}
        {!text && <CustomPlaceholder text='placeholder'/>}
        {this._renderChildren()}
      </div>
    )
  }
}

class AddMediaButton extends React.Component {
  uploadFile = (event) => {
    uploadFile(event, this, (file) => {
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
            <Icon name='like-active' />
            <HiddenInput
              ref={this.setAddImageInputRef}
              className={theme.buttonWrapper}
              type='file'
              accept={`${type}/*`}
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

const AddImageButton = (props) => {
  return (
    <AddMediaButton
      {...props}
      type="image"
    />
  )
}

const AddVideoButton = (props) => {
  return (
    <AddMediaButton
      {...props}
      type="video"
    />
  )
}

const styleMap = {
  'BOLD': {
    fontWeight: 600,
  }
}

export default class BodyEditor extends React.Component {
  constructor(props) {
    super(props)
    let editorState

    if (props.value) editorState = EditorState.createWithContent(convertFromRaw(props.value))
    else editorState = EditorState.createEmpty()
    this.state = {
      editorState
    }
  }

  componentDidMount() {
    this.props.setGetEditorState(this.getEditorStateAsObject)
  }

  getEditorStateAsObject = () => {
    return convertToRaw(this.state.editorState.getCurrentContent())
  }


  // see https://github.com/facebook/draft-js/issues/1510
  // for remove atomic block logic
  removeMedia = (key, length) => {
    const contentState = this.state.editorState.getCurrentContent()
    let selectKey = contentState.getKeyBefore(key) || contentState.getKeyAfter(key)

    const selection = new SelectionState({
      anchorKey: selectKey,
      anchorOffset: 0,
      focusKey: selectKey,
      focusOffset: 0,
    })

    const withoutAtomicEntity = Modifier.removeRange(
      contentState,
      new SelectionState({
        anchorKey: key,
        anchorOffset: 0,
        focusKey: key,
        focusOffset: length,
      }),
      'backward',
    )

    const blockMap = withoutAtomicEntity.getBlockMap().delete(key)
    var withoutAtomic = withoutAtomicEntity.merge({
      blockMap,
      selectionAfter: selection,
    });

    const newEditorState = EditorState.push(
      this.state.editorState,
      withoutAtomic,
      'remove-range',
    )

    this.setState({editorState: newEditorState})
  }

  myBlockRenderer = (contentBlock) => {
    const type = contentBlock.getType()
    const focusKey = this.state.editorState.getSelection().getFocusKey()
    const blockKey = contentBlock.getKey()

    if (type === 'atomic') {
      const props = {
        text: contentBlock.getText(),
        key: contentBlock.getKey(),
        isFocused: focusKey === blockKey,
        onClickDelete: this.removeMedia,
        direction: 'LTR',
      }
      contentBlock.getData().mapEntries((entry) => {
        props[entry[0]] = entry[1]
      })

      return {
        component: MediaComponent,
        editable: true,
        props: props,
      };
    }
  }

  myBlockStyleFn(contentBlock) {
    const type = contentBlock.getType()
    if (type === 'header-one') return 'editorHeaderOne'
    else if (type === 'unstyled') return 'editorParagraph'
  }

  componentDidUpdate(prevProps){
    if (this.props.value && this.props.storyId !== prevProps.storyId) {
      this.setState({
        editorState: EditorState.createWithContent((this.props.value))
      })
    }
  }


  onChange = (editorState) => {
    this.setState({editorState})
  }

  focus = () => this.editor.focus()
  setEditorRef = (ref) => this.editor = ref

  render() {

    return (
      <div>
        <Editor
          customStyleMap={styleMap}
          editorState={this.state.editorState}
          placeholder='Tell your story'
          onChange={this.onChange}
          plugins={[sideToolbarPlugin]}
          ref={this.setEditorRef}
          blockRendererFn={this.myBlockRenderer}
          blockStyleFn={this.myBlockStyleFn}
        />
        <SideToolbar />
      </div>
    )
  }
}
