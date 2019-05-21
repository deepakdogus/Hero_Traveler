import React from 'react'
import PropTypes from 'prop-types'
import { EditorState } from 'draft-js'
import Editor from 'draft-js-plugins-editor'
import 'draft-js/dist/Draft.css'
import {
  ItalicButton,
  BoldButton,
  HeadlineOneButton,
  BlockquoteButton,
} from 'draft-js-buttons'
import styled from 'styled-components'

import { convertFromRaw, convertToRaw } from '../../Shared/Lib/draft-js-helpers'
import { removeMedia, createSelectionWithFocus } from '../../Lib/web-draft-js-helpers'

import createInlineToolbarPlugin, { Separator } from 'draft-js-inline-toolbar-plugin'
import createSideToolbarPlugin from './SidebarPlugin'

import MediaComponent from './EditorMediaComponent'

import colors from '../../Shared/Themes/Colors'
import './Styles/EditorStyles.css'
import './Styles/ToolbarStyles.css'

const EditorWrapper = styled.div`
  margin-bottom: 95px;
  margin-top: 20px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin-left: 15px;
    margin-right: 15px;
  }
`
const inlineToolbarPlugin = createInlineToolbarPlugin()
const { InlineToolbar } = inlineToolbarPlugin

const sideToolbarPlugin = createSideToolbarPlugin()
const { SideToolbar } = sideToolbarPlugin

const styleMap = {
  BOLD: {
    fontWeight: 600,
  },
  UNDERLINE: {
    color: colors.redHighlights, // temporary hack to display links with correct styles
  },
}

export default class BodyEditor extends React.Component {
  static propTypes = {
    onInputChange: PropTypes.func,
    setGetEditorState: PropTypes.func,
    storyId: PropTypes.string,
    value: PropTypes.object,
  }

  constructor(props) {
    super(props)
    let editorState

    if (props.value)
      editorState = EditorState.createWithContent(convertFromRaw(props.value))
    else editorState = EditorState.createEmpty()
    this.state = {
      editorState,
    }
  }

  componentDidMount() {
    this.props.setGetEditorState(this.getEditorStateAsObject)
    this.editor.focus()
    this.setupWindowResizeListener()
  }

  setupWindowResizeListener = () => {
    window.addEventListener('resize', this._onResizeWindow)
  }

  _onResizeWindow = () => {
    this.editor.blur()
    // no 'onDoneResizing' event in JS, can be emulated with reasonable timeout
    clearTimeout(resizeTimer)
    const resizeTimer = setTimeout(() => this.editor.focus(), 250)
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this._onResizeWindow)
  }

  getEditorStateAsObject = () => {
    return convertToRaw(this.state.editorState.getCurrentContent())
  }

  removeMedia = (key, length) => {
    const updatedEditorState = removeMedia(key, this.state.editorState, length)
    this.setState({ editorState: updatedEditorState })
  }

  myBlockRenderer = contentBlock => {
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
      contentBlock.getData().mapEntries(entry => {
        props[entry[0]] = entry[1]
      })

      return {
        component: MediaComponent,
        editable: props.type !== 'loader',
        props: props,
      }
    }
  }

  myBlockStyleFn = contentBlock => {
    const currBlockType = contentBlock.getType()
    const contentState = this.state.editorState.getCurrentContent()
    const nextBlockKey = contentState.getKeyAfter(contentBlock.getKey())
    const nextBlock = contentState.getBlockForKey(nextBlockKey)
    const nextBlockType = nextBlock ? nextBlock.getType() : ''

    let className = ''

    if (currBlockType === 'unstyled') className = 'editorParagraph'
    if (currBlockType === 'header-one') className = 'editorHeaderOne'
    if (currBlockType === 'blockquote') className = 'editorBlockquote'
    if (currBlockType === 'unordered-list-item') className = 'editorUnorderedListItem'
    if (nextBlockType && nextBlockType === 'atomic' && currBlockType !== 'atomic') {
      className += ' editorSpacer'
    }
    return className
  }

  getFocusKey() {
    return this.state.editorState.getSelection().getFocusKey()
  }

  // atomic media caption placeholder only properly works if focusOffset is 0
  // we shoud refocus when that is not the case
  shouldRefocusPlaceholder() {
    const { editorState } = this.state
    const selectionState = editorState.getSelection()
    const focusKey = this.getFocusKey()
    const currentBlock = editorState.getCurrentContent().getBlockForKey(focusKey)
    const blockType = currentBlock.getType()
    const text = currentBlock.getText()
    return blockType === 'atomic' && !text && selectionState.getFocusOffset() !== 0
  }

  componentDidUpdate(prevProps) {
    if (this.props.value && this.props.storyId !== prevProps.storyId) {
      this.setState({
        editorState: EditorState.createWithContent(this.props.value),
      })
    }
    else if (this.shouldRefocusPlaceholder()) {
      this.setState({
        editorState: EditorState.forceSelection(
          this.state.editorState,
          createSelectionWithFocus(this.getFocusKey()),
        ),
      })
    }
  }

  onChange = editorState => {
    this.setState({ editorState })
  }

  onBlur = event => {
    this.props.onInputChange({
      draftjsContent: this.getEditorStateAsObject(),
    })
  }

  focus = () => this.editor.focus()
  setEditorRef = ref => (this.editor = ref)

  render() {
    return (
      <EditorWrapper>
        <Editor
          customStyleMap={styleMap}
          editorState={this.state.editorState}
          placeholder="Tell your story"
          onChange={this.onChange}
          plugins={[sideToolbarPlugin, inlineToolbarPlugin]}
          ref={this.setEditorRef}
          blockRendererFn={this.myBlockRenderer}
          blockStyleFn={this.myBlockStyleFn}
          onBlur={this.onBlur}
        />
        <SideToolbar />
        <InlineToolbar>
        {
          (externalProps) => (
              <div>
                <BoldButton {...externalProps} />
                <ItalicButton {...externalProps} />
                {/* LINK BUTTON HERE */}
                <Separator {...externalProps} />
                <HeadlineOneButton {...externalProps} />
                <BlockquoteButton {...externalProps} />
                {/* <Separator {...externalProps} /> */}
                {/* ALIGN LEFT BUTTON HERE */}
                {/* ALIGN CENTER BUTTON HERE */}
              </div>
            )
          }
        </InlineToolbar>
      </EditorWrapper>
    )
  }
}
