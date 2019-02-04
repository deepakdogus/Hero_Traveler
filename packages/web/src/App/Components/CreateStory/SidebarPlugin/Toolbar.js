/* eslint-disable react/no-array-index-key */
import React from 'react'
import PropTypes from 'prop-types'
import DraftOffsetKey from 'draft-js/lib/DraftOffsetKey'
import {
  BoldButton,
  HeadlineOneButton,
} from 'draft-js-buttons'
import {
  AddImageButton,
  AddVideoButton,
} from '../EditorAddMediaButton'
import BlockTypeSelect from './BlockTypeSelect'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: absolute;
  top: ${({ top }) => `${top}px` || 'unset'};
  left: ${({ left }) => `${left}px` || 'unset'};
  transform: ${({ transform }) => transform || 'unset'};
`

class Toolbar extends React.Component {
  static propTypes = {
    children: PropTypes.func,
    store: PropTypes.object,
    position: PropTypes.string,
  }

  static defaultProps = {
    children: externalProps => (
      // may be use React.Fragment instead of div to improve perfomance after React 16
      <div>
        <BoldButton {...externalProps} />
        <AddImageButton {...externalProps} />
        <HeadlineOneButton {...externalProps} />
        <AddVideoButton {...externalProps} />
      </div>
    ),
  }

  state = {
    position: {},
  }

  componentDidMount() {
    this.props.store.subscribeToItem('editorState', this.onEditorStateChange)
  }

  componentWillUnmount() {
    this.props.store.unsubscribeFromItem('editorState', this.onEditorStateChange)
  }

  getNextBlock() {

  }

  onEditorStateChange = editorState => {
    const selection = editorState.getSelection()
    if (!selection.getHasFocus()) return

    const currentContent = editorState.getCurrentContent()
    const currentBlock = currentContent.getBlockForKey(selection.getStartKey())
    // TODO verify that always a key-0-0 exists
    const offsetKey = DraftOffsetKey.encode(currentBlock.getKey(), 0, 0)
    // Note: need to wait on tick to make sure the DOM node has been create by Draft.js

    setTimeout(() => {
      let node = document.querySelectorAll(`[data-offset-key="${offsetKey}"]`)[0] || {}

      // Atomic elements with captions create editorParagraph nodes after them
      // when enter is pressed in a caption, find the next node and position sidebar beside it
      if (!node.tagName) {
        const nextKey = currentContent.getKeyAfter(selection.getStartKey())
        const nextBlockOffsetKey = DraftOffsetKey.encode(nextKey, 0, 0)
        const lastNode = document.querySelectorAll(`[data-offset-key="${nextBlockOffsetKey}"]`)[0] || {}
        node = lastNode
      }

      // The editor root should be two levels above the node from
      // `getEditorRef`. In case this changes in the future, we
      // attempt to find the node dynamically by traversing upwards.
      const editorRef = this.props.store.getItem('getEditorRef')()
      if (!editorRef) return

      // this keeps backwards-compatibility with react 15
      let editorRoot
        = editorRef.refs && editorRef.refs.editor ? editorRef.refs.editor : editorRef.editor
      while (editorRoot.className.indexOf('DraftEditor-root') === -1) {
        editorRoot = editorRoot.parentNode
      }

      const position = {
        top: node.offsetTop + editorRoot.offsetTop,
      }
      // TODO: remove the hard code(width for the hover element)
      if (this.props.position === 'right') {
        // eslint-disable-next-line no-mixed-operators
        position.left = editorRoot.offsetLeft + editorRoot.offsetWidth + 80 - 36
      }
      else {
        position.left = editorRoot.offsetLeft - 80
      }

      if (node.tagName === 'FIGURE') position.transform = 'scale(0)'

      this.setState({
        position,
      })
    }, 0)
  }

  render() {
    const { store } = this.props
    const { position: { top, left, transform } } = this.state

    return (
      <Wrapper
        top={top}
        left={left}
        transform={transform}
      >
        <BlockTypeSelect
          getEditorState={store.getItem('getEditorState')}
          setEditorState={store.getItem('setEditorState')}
        >
          {this.props.children}
        </BlockTypeSelect>
      </Wrapper>
    )
  }
}

export default Toolbar
