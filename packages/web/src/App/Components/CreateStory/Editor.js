import React from 'react'
import PropTypes from 'prop-types'
import {
  EditorState,
  Modifier,
  SelectionState,
} from 'draft-js'
import 'draft-js/dist/Draft.css'
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
} from '../../Shared/Lib/draft-js-helpers'
import './Styles/EditorStyles.css'
import './Styles/ToolbarStyles.css'
import {
  AddImageButton,
  AddVideoButton,
} from './EditorAddMediaButton'
import MediaComponent from './EditorMediaComponent'

const EditorWrapper = styled.div`
  margin-bottom: 95px;
  margin-top: 20px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin-left: 15px;
    margin-right: 15px;
  }
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

CustomBlockTypeSelect.propTypes = {
  getEditorState: PropTypes.func,
  setEditorState: PropTypes.func,
  theme: PropTypes.object,
}

const sideToolbarPlugin = createSideToolbarPlugin({
  structure: [CustomBlockTypeSelect]
})

const { SideToolbar } = sideToolbarPlugin

const styleMap = {
  'BOLD': {
    fontWeight: 600,
  }
}

export default class BodyEditor extends React.Component {
  static propTypes = {
    value: PropTypes.object,
    setGetEditorState: PropTypes.func,
    storyId: PropTypes.string,
  }

  constructor(props) {
    super(props)
    let editorState

    if (props.value) editorState = EditorState.createWithContent(convertFromRaw(props.value))
    else editorState = EditorState.createEmpty()
    this.state = {
      editorState,
    }
  }

  componentDidMount() {
    this.props.setGetEditorState(this.getEditorStateAsObject)
    this.editor.focus()
  }

  getEditorStateAsObject = () => {
    return convertToRaw(this.state.editorState.getCurrentContent())
  }

  createSelectionWithFocus = (key) => {
    return new SelectionState({
      anchorKey: key,
      anchorOffset: 0,
      focusKey: key,
      focusOffset: 0,
      hasFocus: true,
    })
  }

  // see https://github.com/facebook/draft-js/issues/1510
  // for remove atomic block logic
  removeMedia = (key, length) => {
    const contentState = this.state.editorState.getCurrentContent()
    let selectKey = contentState.getKeyAfter(key) || contentState.getKeyBefore(key)

    const selection = this.createSelectionWithFocus(selectKey)

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
    })

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
      }
    }
  }

  myBlockStyleFn = (contentBlock) => {
    const currBlockType = contentBlock.getType()
    const contentState = this.state.editorState.getCurrentContent()
    const nextBlockKey = contentState.getKeyAfter(contentBlock.getKey())
    const nextBlock = contentState.getBlockForKey(nextBlockKey)
    const nextBlockType = nextBlock ? nextBlock.getType() : ''

    let className = ''

    if (currBlockType === 'unstyled') className = 'editorParagraph'
    if (currBlockType === 'header-one') className = 'editorHeaderOne'
    if (
      nextBlockType
      && nextBlockType === 'atomic'
      && currBlockType !== 'atomic'
    ) {
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
        editorState: EditorState.createWithContent((this.props.value)),
      })
    }
    else if (this.shouldRefocusPlaceholder()) {
      this.setState({
        editorState: EditorState.forceSelection(
          this.state.editorState,
          this.createSelectionWithFocus(this.getFocusKey()),
        ),
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
      <EditorWrapper>
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
        <SideToolbar/>
      </EditorWrapper>
    )
  }
}
