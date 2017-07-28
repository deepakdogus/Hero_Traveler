import React, {Component} from 'react'
import {
  View,
  StyleSheet,
} from 'react-native'
import PropTypes from 'prop-types'

import Toolbar, {PressTypes} from './Toolbar'
import {KeyTypes} from './util/KeyTypes'
import {
  updateEditorSelection,
  insertText,
  getLastBlockKey,
  handleReturn,
  insertBlock,
  applyStyle,
  toggleStyle,
  removeBlock,
  rawToEditorState,
  editorStateToRaw
} from './draft-js'

import {EditorState, DraftOffsetKey, keyCommandInsertNewline, keyCommandPlainBackspace} from './draft-js/reexports'

import * as DJSConsts from './draft-js/constants'
import Metrics from '../../Themes/Metrics'
// import KeyboardSpacer from 'react-native-keyboard-spacer'
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

  /* Handlers */
  onSelectionChange = (blockKey, start, end, from) => {
    // console.log(`selection! From: ${from}`, blockKey, start, end)
    const editorState = updateEditorSelection(this.state.editorState, blockKey, start, end, true)
    this.setState({editorState})
  }

  onKeyPress = ({key}) => {
    let editorState
    switch (key) {
      case KeyTypes.Backspace:
        editorState = keyCommandPlainBackspace(this.state.editorState)
        this.setIsNewBlock(editorState.getSelection().getAnchorKey())
        break
      case KeyTypes.Return:
        editorState = keyCommandInsertNewline(this.state.editorState)
        console.log('selection after insert', editorState.getSelection().getAnchorKey())
        this.setIsNewBlock(editorState.getSelection().getAnchorKey())
        break
      default:
        editorState = insertText(this.state.editorState, key)
    }

    this.setState({editorState})
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

      case PressTypes.Normal:
        return this.toggleNormal()

      case PressTypes.Italic:
      case PressTypes.Bold:
        return this.toggleStyle(pressType)

      case PressTypes.Image:
        return this.props.onPressImage()

      case PressTypes.Video:
        return this.props.onPressVideo()
    }
  }

  toggleHeader() {
    this.editorState = toggleStyle(this.editorState, DJSConsts.HeaderOne)
    this.forceUpdate()
  }

  toggleNormal() {
    this.editorState = toggleStyle(this.editorState, DJSConsts.Unstyled)
    this.forceUpdate()
  }

  toggleStyle(styleType) {
    this.editorState = applyStyle(this.editorState, styleType)
    this.forceUpdate()
  }

  insertImage = (url) => {
    this.insertAtomicBlock('image', url)
  }

  insertVideo = (url) => {
    this.insertAtomicBlock('video', url)
  }

  insertAtomicBlock(type, url) {
    let insertAfterKey
    let lastBlockKey = getLastBlockKey(this.editorState)

    // If no input is focused, insert image at the end of the content state
    if (!this.focusedBlock) {
      insertAfterKey = lastBlockKey
    } else {
      insertAfterKey = this.focusedBlock
    }

    this.editorState = insertBlock(
      this.editorState,
      insertAfterKey,
      {
        type: 'atomic',
        data: {
          type: type,
          url: url
        }
      }
    )

    // Get the key of the new block
    const newFocusedBlock = this.editorState.getCurrentContent().getBlockAfter(insertAfterKey).getKey()

    // If inserted at the bottom, insert a blank text box after it
    if (lastBlockKey === insertAfterKey) {
      this.editorState = insertBlock(
        this.editorState,
        newFocusedBlock
      )
    }

    this.focusedBlock = newFocusedBlock
    this.forceUpdate()
  }

  // _accessibilityPressed = () => {
  //   const lastBlock = this.editorState.getCurrentContent().getLastBlock()
  //   this.focusedBlock = lastBlock.getKey()
  //   this.editorState = updateEditorSelection(
  //     this.editorState,
  //     this.focusedBlock,
  //     lastBlock.getLength(),
  //     lastBlock.getLength()
  //   )
  //   this.forceUpdate()
  // }

  getEditorStateAsObject() {
    return editorStateToRaw(this.state.editorState)
  }

  removeMediaBlock = (blockKey) => {
    this.editorState = removeBlock(this.editorState, blockKey)
    this.forceUpdate()
  }

  getBlocks() {
    // const selectionState = this.editorState.getSelection()
    // const {blocks, entityMap} = editorStateToRaw(this.editorState)
    const {editorState} = this.state
    const content = editorState.getCurrentContent()
    const decorator = editorState.getDecorator()
    const selectionState = editorState.getSelection()
    const blocksAsArray = content.getBlocksAsArray()
    return blocksAsArray.map(block => {
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
        onKeyPress: this.onKeyPress,
        onDelete: this.removeMediaBlock
      }
      return <ContentBlock {...componentProps} />
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
        <Toolbar
          onPress={this.onToolbarPress}
        />
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
