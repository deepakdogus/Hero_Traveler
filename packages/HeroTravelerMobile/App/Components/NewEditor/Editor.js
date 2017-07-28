import React, {Component} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet, ScrollView
} from 'react-native'
import PropTypes from 'prop-types'
import _ from 'lodash'

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
  handleBackspace,
  removeBlock,
  rawToEditorState,
  editorStateToRaw
} from './draft-js'

import {EditorState, DraftOffsetKey} from './draft-js/reexports'

import * as DJSConsts from './draft-js/constants'
import Metrics from '../../Themes/Metrics'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import NewTextBlock from './NewTextBlock'

export default class Editor extends Component {

  static propTypes = {
    customStyleMap: PropTypes.object,
    onPressImage: PropTypes.func.isRequired,
    onPressVideo: PropTypes.func.isRequired,
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
      // this.focusedBlock = null
    } else {
      editorState = EditorState.createEmpty()
      // Focus the first block when we load
      // this.focusedBlock = getLastBlockKey(editorState)
    }

    this.state = {
      editorState: editorState,
    }

    // this.editorState = editorState
    // this.selectionStates = {}
    // this.lastEventCount = null
  }

  /* Lifecycle methods */

  /* Handlers */
  _onChange = (key, text) => {

  }

  _onKeyPress = (e, inputRef) => {
    const {key, eventCount} = e.nativeEvent

    // This was to handle double spacebar tap to insert a period. is it needed?
    if (key === KeyTypes.Backspace && eventCount === this.lastEventCount) {
      return
    }

    switch (key) {
      case KeyTypes.Backspace:
        this.editorState = handleBackspace(this.editorState)
        break

      // Return is ignored here, and actually handled in _onBlur
      case KeyTypes.Return:
        break

      default:
        this.editorState = insertText(this.editorState, key)
        break
    }

    this.lastEventCount = eventCount
  }

  _onSelectionChange = (key, start, end) => {
    this.selectionStates[key] = {
      start,
      end
    }

    this.editorState = updateEditorSelection(
      this.editorState,
      key,
      start,
      end
    )
  }

  _onFocus = (key) => {
    const selectionState = this.selectionStates[key]
    let start, end
    // Newly added blocks don't have selection states yet
    if (selectionState) {
      start = selectionState.start
      end = selectionState.end
    } else {
      start = 0
      end = 0
    }
    this.editorState = updateEditorSelection(
      this.editorState,
      key,
      start,
      end
    )

    this.focusedBlock = key
  }

  _onBlur = (key, type, text, blurredByReturn) => {
    // We want to insert the new block after the old block blurs
    // because it appears any input blur will cause all inputs to blur
    if (blurredByReturn) {
      this.editorState = handleReturn(this.editorState)
      this.focusedBlock = this.editorState.getSelection().getFocusKey()
      this.forceUpdate()
    } else {
      this.focusedBlock = null
    }
  }

  _onToolbarPress = (pressType) => {
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

  _accessibilityPressed = () => {
    const lastBlock = this.editorState.getCurrentContent().getLastBlock()
    this.focusedBlock = lastBlock.getKey()
    this.editorState = updateEditorSelection(
      this.editorState,
      this.focusedBlock,
      lastBlock.getLength(),
      lastBlock.getLength()
    )
    this.forceUpdate()
  }

  getEditorState() {
    return this.editorState
  }

  getFocusedBlock() {
    return this.focusedBlock
  }

  getEditorStateAsObject() {
    return editorStateToRaw(this.editorState)
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
    const selection = editorState.getSelection()
    const blocksAsArray = content.getBlocksAsArray()

    return blocksAsArray.map(block => {
      const key = block.getKey()
      const offsetKey = DraftOffsetKey.encode(key, 0, 0)
      const componentProps = {
        key,
        contentState: content,
        block,
        decorator,
        offsetKey,
        selection,
        customStyleMap: this.props.customStyleMap,
        tree: editorState.getBlockTree(key)
      }

      return (
        <NewTextBlock
          {...componentProps}
        />
      )

      // return (
      //   <TextBlock
      //     key={block.key}
      //     text={block.text}
      //     type={block.type !== 'atomic' ? block.type : block.data.type}
      //     data={block.data}
      //     blockKey={block.key}
      //     inlineStyles={block.inlineStyleRanges}
      //     entityRanges={block.entityRanges}
      //     onKeyPress={this._onKeyPress}
      //     onDelete={this.removeMediaBlock}
      //     onSelectionChange={this._onSelectionChange}
      //     customStyles={this.props.customStyles}
      //     onChange={this._onChange}
      //     isFocused={block.key === this.getFocusedBlock()}
      //     onFocus={this._onFocus}
      //     onBlur={this._onBlur}
      //     entityMap={entityMap}
      //     selection={{
      //       start: selectionState.getStartOffset(),
      //       end: selectionState.getEndOffset()
      //     }}
      //   />
      // )
    })
  }

    // <TouchableOpacity
    //   onPress={this._accessibilityPressed}
    //   style={styles.accessibilitySpacer}><Text> </Text></TouchableOpacity>
  render() {
    return (
      <View style={[styles.root, this.props.style]}>
        <ScrollView keyboardShouldPersistTaps='handled' style={styles.scrollView}>
          <View style={styles.innerScroll}>
            {this.getBlocks()}
          </View>
        </ScrollView>
        <Toolbar
          onPress={this._onToolbarPress}
        />
        <KeyboardSpacer/>
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
