import React from 'react'
import PropTypes from 'prop-types'
import { CompositeDecorator, EditorState } from 'draft-js'
import Editor from 'draft-js-plugins-editor'
import 'draft-js/dist/Draft.css'
import {
  ItalicButton,
  BlockquoteButton,
  BoldButton,
  HeadlineOneButton,
  UnderlineButton,
  // temporarily hidden
  // UnorderedListButton,
} from 'draft-js-buttons'
import styled from 'styled-components'
import _ from 'lodash'

import { convertFromRaw, convertToRaw } from '../../Shared/Lib/draft-js-helpers'
import { removeMedia, createSelectionWithFocus } from '../../Lib/web-draft-js-helpers'

// temporarily hidden
// import createDividerPlugin from 'draft-js-divider-plugin'
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin'
import createLinkPlugin from 'draft-js-anchor-plugin'
import createSideToolbarPlugin from './SidebarPlugin'

import { AddImageButton, AddVideoButton } from './EditorAddMediaButton'
import MediaComponent from './EditorMediaComponent'

import './Styles/AnchorLinkStyles.css'
import './Styles/DividerStyles.css'
import './Styles/EditorStyles.css'
import './Styles/ToolbarStyles.css'

const LINK_ROLES = ['admin', 'brand', 'founding Member']

const EditorWrapper = styled.div`
  margin-bottom: 95px;
  margin-top: 20px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin-left: 15px;
    margin-right: 15px;
  }
`

const StyledLink = styled.a`
  font-weight: 600;
  color: ${props => props.theme.Colors.redHighlights};
  text-decoration: none;
  font-style: normal;
  cursor: pointer;
  > u,
  * {
    text-decoration: none;
    font-style: normal;
  }
`

// DRAFTJS PLUGINS
const inlineToolbarPlugin = createInlineToolbarPlugin()
const { InlineToolbar } = inlineToolbarPlugin

const sideToolbarPlugin = createSideToolbarPlugin()
const { SideToolbar } = sideToolbarPlugin

// temporarily hidden
// const dividerPlugin = createDividerPlugin()
// const { DividerButton } = dividerPlugin

const linkPlugin = createLinkPlugin({
  placeholder: 'Enter a URL and press enter',
})
const { LinkButton } = linkPlugin

// CUSTOM ENTITIES
const LinkEntity = props => {
  const { url } = props.contentState.getEntity(props.entityKey).getData()
  return (
    <StyledLink
      rel="nofollow noreferrer"
      href={url}
      target="_blank"
    >
      {props.children}
    </StyledLink>
  )
}

LinkEntity.propTypes = {
  children: PropTypes.array,
  contentState: PropTypes.object,
  entityKey: PropTypes.string,
}

function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity()
    return entityKey !== null && contentState.getEntity(entityKey).getType() === 'LINK'
  }, callback)
}

// DRAFTJS EDITOR DECORATOR
const decorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: LinkEntity,
  },
])

export default class BodyEditor extends React.Component {
  static propTypes = {
    author: PropTypes.object,
    onInputChange: PropTypes.func,
    setGetEditorState: PropTypes.func,
    storyId: PropTypes.string,
    value: PropTypes.object,
  }

  constructor(props) {
    super(props)
    let editorState

    if (props.value)
      editorState = EditorState.createWithContent(convertFromRaw(props.value), decorator)
    else editorState = EditorState.createEmpty(decorator)
    this.state = {
      editorState,
    }
  }

  componentDidMount() {
    this.props.setGetEditorState(this.getEditorStateAsObject)
    this.editor.focus()
    this.setupWindowResizeListener()
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

  componentWillUnmount = () => {
    window.removeEventListener('resize', this._onResizeWindow)
  }

  setupWindowResizeListener = () => {
    window.addEventListener('resize', this._onResizeWindow)
  }

  _onResizeWindow = () => {
    this.editor.blur()
    // no 'onDoneResizing' event in JS, can be emulated with timeout
    clearTimeout(resizeTimer)
    const resizeTimer = setTimeout(() => this.editor.focus(), 0)
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
    const currBlockType = contentBlock ? contentBlock.getType() : ''
    const contentState = this.state.editorState.getCurrentContent()
    const nextBlockKey = contentState.getKeyAfter(contentBlock.getKey())
    const nextBlock = contentState.getBlockForKey(nextBlockKey)
    const nextBlockType = nextBlock ? nextBlock.getType() : ''

    let className = ''

    if (currBlockType === 'unstyled') className = 'editorParagraph'
    if (currBlockType === 'header-one') className = 'editorHeaderOne'
    if (currBlockType === 'blockquote') className = 'editorBlockquote'
    if (currBlockType === 'unordered-list-item') className = 'editorUnorderedListItem'

    // remove unnecessary extra space between p and ul
    if (currBlockType === 'unstyled' && nextBlockType === 'unordered-list-item') {
      className += ' editorNoPadding'
    }

    // add exra space surroundying media
    if (nextBlockType === 'atomic' && currBlockType !== 'atomic') {
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

  isPrivilegedUser = () => {
    const role = _.get(this.props, 'author.role', '')
    const isChannel = _.get(this.props, 'author.isChannel', false)
    return LINK_ROLES.includes(role) || isChannel
  }

  onChange = editorState => {
    this.setState({ editorState })
  }

  onBlur = event => {
    this.props.onInputChange({
      draftjsContent: this.getEditorStateAsObject(),
    })
  }

  setEditorRef = ref => (this.editor = ref)

  render() {
    return (
      <EditorWrapper>
        <Editor
          editorState={this.state.editorState}
          placeholder="Tell your story"
          onChange={this.onChange}
          // dividerPlugin hidden from this version
          // plugins={[dividerPlugin, inlineToolbarPlugin, linkPlugin, sideToolbarPlugin]}
          plugins={[inlineToolbarPlugin, linkPlugin, sideToolbarPlugin]}
          ref={this.setEditorRef}
          blockRendererFn={this.myBlockRenderer}
          blockStyleFn={this.myBlockStyleFn}
          onBlur={this.onBlur}
        />
        <SideToolbar>
          {externalProps => (
            <div>
              <AddVideoButton {...externalProps} />
              <AddImageButton {...externalProps} />
              <HeadlineOneButton {...externalProps} />
              <BlockquoteButton {...externalProps} />
              {/* <UnorderedListButton {...externalProps} /> */}
              {/* <DividerButton {...externalProps} /> */}
            </div>
          )}
        </SideToolbar>
        <InlineToolbar>
          {externalProps => (
            <div>
              <BoldButton {...externalProps} />
              <ItalicButton {...externalProps} />
              <UnderlineButton {...externalProps} />
              {this.isPrivilegedUser() && <LinkButton {...externalProps} />}
            </div>
          )}
        </InlineToolbar>
      </EditorWrapper>
    )
  }
}
