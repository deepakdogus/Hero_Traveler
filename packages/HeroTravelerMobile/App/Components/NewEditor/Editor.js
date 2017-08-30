import React, {Component} from 'react'
import {
  View,
  StyleSheet,
} from 'react-native'
import PropTypes from 'prop-types'

import {PressTypes} from './Toolbar'
import {
  updateEditorSelection,
  getLastBlockKey,
  insertBlock,
  applyStyle,
  toggleStyle,
  removeBlock,
  rawToEditorState,
  editorStateToRaw,
} from './draft-js'

import {SelectionState, EditorState, DraftOffsetKey, Modifier, keyCommandInsertNewline, keyCommandPlainBackspace} from './draft-js/reexports'

import * as DJSConsts from './draft-js/constants'
import Metrics from '../../Themes/Metrics'
import ContentBlock from './ContentBlock'

// const logSelection = (msg, selection) => {
//   console.log(
//     msg,
//     '\n',
//     `start: key(${selection.getAnchorKey()}) offset(${selection.getAnchorOffset()})`,
//     '\n',
//     `end:   key(${selection.getFocusKey()}) offset(${selection.getFocusOffset()})`,
//     '\n',
//     `focus: ${selection.getHasFocus()}`
//   )
// }


export default class Editor extends Component {

  static propTypes = {
    customStyleMap: PropTypes.object,
    // onPressImage: PropTypes.func.isRequired,
    // onPressVideo: PropTypes.func.isRequired,
    // Raw state
    value: PropTypes.object
  }

  static defaultProps = {
    customStyleMap: {}
  }

  constructor(props) {
    super(props)
    let editorState

    if (props.value) {
      editorState = rawToEditorState(props.value)
    } else {
      editorState = EditorState.createEmpty()
    }

    this.state = {
      editorState
    }
  }

  setStateDebug = (state) => {
    this.setState(state)
  }

  /* Handlers */
  onSelectionChange = (blockKey, start, end, from) => {
    const editorState = updateEditorSelection(this.state.editorState, blockKey, start, end, true)
    this.setStateDebug({editorState})
  }

  onRangeChange = ({src, blockId}) => {
    const {replaceRange, text} = src

    if (text == '\n') {
      const editorState = keyCommandInsertNewline(this.state.editorState)
      this.setIsNewBlock(editorState.getSelection().getAnchorKey())
      this.setStateDebug({editorState})
    } else if (text == '' && replaceRange.start == 0 && replaceRange.end == 0) {
      const editorState = keyCommandPlainBackspace(this.state.editorState)
      this.setIsNewBlock(editorState.getSelection().getAnchorKey())
      this.setStateDebug({editorState})
    } else {
      let selectionState = SelectionState.createEmpty(blockId).merge({
        anchorKey: blockId,
        anchorOffset: replaceRange.start,
        focusKey: blockId,
        focusOffset: replaceRange.end,
      })

      let newContentState = Modifier.replaceText(
        this.state.editorState.getCurrentContent(),
        selectionState,
        text,
        this.state.editorState.getCurrentInlineStyle()
      )

      let editorState = EditorState.push(
        this.state.editorState,
        newContentState,
        'insert-characters'
        )

      this.setStateDebug({editorState})
    }
  }

  setIsNewBlock(blockKey) {
    this.newBlock = blockKey
  }

  getIsNewBlock(blockKey) {
    const isNew = blockKey === this.newBlock
    if (isNew) {
      this.newBlock = null
    }
    return isNew
  }

  onToolbarPress = (pressType) => {
    switch (pressType) {
      case PressTypes.HeaderOne:
        return this.toggleHeader()
      case PressTypes.Image:
        return this.props.onPressImage()
      case PressTypes.Video:
        return this.props.onPressVideo()
      case PressTypes.Normal:
      default:
        return this.toggleNormal()
    }
  }

  toggleHeader() {
    const editorState = toggleStyle(this.state.editorState, DJSConsts.HeaderOne)
    this.setStateDebug({editorState})
  }

  toggleNormal() {
    const editorState = toggleStyle(this.state.editorState, DJSConsts.Unstyled)
    this.setStateDebug({editorState})
  }

  toggleStyle(styleType) {
    const editorState = applyStyle(this.state.editorState, styleType)
    this.setStateDebug({editorState})
  }

  insertImage = (url) => {
    this.insertAtomicBlock('image', url)
  }

  insertVideo = (url) => {
    this.insertAtomicBlock('video', url)
  }

  insertAtomicBlock(type, url) {
    let insertAfterKey
    const selectedBlockKey = this.state.editorState.getSelection().getAnchorKey()
    let lastBlockKey = getLastBlockKey(this.state.editorState)

    // If no input has yet been focused, insert image at the end of the content state
    if (this.state.focusedBlock === undefined) {
      insertAfterKey = lastBlockKey
    } else {
      insertAfterKey = selectedBlockKey
    }

    let editorState = insertBlock(
      this.state.editorState,
      insertAfterKey,
      {
        type: 'atomic',
        data: {
          type: type,
          url: url
        },
        focusNewBlock: true
      }
    )

    // Get the key of the new block
    const newFocusedBlock = editorState.getCurrentContent().getBlockAfter(insertAfterKey).getKey()

    // If inserted at the bottom, insert a blank text box after it
    if (lastBlockKey === insertAfterKey) {
      editorState = insertBlock(
        editorState,
        newFocusedBlock
      )
    }

    this.setStateDebug({editorState})
  }

  getEditorStateAsObject() {
    return editorStateToRaw(this.state.editorState)
  }

  removeMediaBlock = (blockKey) => {
    this.setStateDebug({
      editorState: removeBlock(this.state.editorState, blockKey)
    })
  }

  shouldUnfocus = true

  // Editor Toolbar should only render when a block is focused
  onFocus = (blockKey) => {
    if (!this.state.focusedBlock && blockKey) {
      this.shouldUnfocus = false
      this.props.setToolbarDisplay(true)
    }
    else if (this.state.focusedBlock && !blockKey) {
      this.shouldUnfocus = true
      /*
      adding slight timeout to avoid the flicker caused by the split amount of time between
      contentBlock focus change. This would hide the toolbar for a split second
      */
      setTimeout(() => {
        if (this.shouldUnfocus) {
          this.props.setToolbarDisplay(false)
        }
      }, 50);
    }
    this.setState({focusedBlock: blockKey})
  }

  getBlocks() {
    const {editorState} = this.state
    const content = editorState.getCurrentContent()
    const decorator = editorState.getDecorator()
    const selectionState = editorState.getSelection()
    const blocksAsArray = content.getBlocksAsArray()
    return blocksAsArray.map((block, index) => {
      const key = block.getKey()
      const isSelected = key === selectionState.getAnchorKey() && key === selectionState.getFocusKey()
      const selection = isSelected ? selectionState : undefined
      const offsetKey = DraftOffsetKey.encode(key, 0, 0)
      const autoFocus = this.getIsNewBlock(key)
      const componentProps = {
        key,
        block,
        decorator,
        offsetKey,
        isSelected,
        selection,
        autoFocus,
        customStyleMap: this.props.customStyleMap,
        tree: editorState.getBlockTree(key),
        onSelectionChange: this.onSelectionChange,
        onRangeChange: this.onRangeChange,
        onDelete: this.removeMediaBlock,
        onFocus: this.onFocus,
        isFocused: this.state.focusedBlock === key,
      }
      return <ContentBlock {...componentProps} index={index}/>
    })
  }

    // <TouchableOpacity
    //   onPress={this._accessibilityPressed}
    //   style={styles.accessibilitySpacer}><Text> </Text></TouchableOpacity>
  render() {
    // logSelection('Main render selection', this.state.editorState.getSelection())
    return (
      <View style={[styles.root, this.props.style]}>
        <View style={styles.innerScroll}>
          {this.getBlocks()}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
  },
  scrollView: {
    flex: 1,
    flexDirection: 'column',
    // marginHorizontal: Metrics.baseMargin
  },
  innerScroll: {
    marginBottom: Metrics.doubleBaseMargin,
  },
  accessibilitySpacer: {
    // backgroundColor: 'pink',
    alignItems: 'stretch',
    minHeight: 50,
    flex: 1,
  }
})
