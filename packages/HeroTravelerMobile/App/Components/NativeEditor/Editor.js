/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  processColor,
} from 'react-native'

import {
  NativeEditor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  insertText,
  insertTextAtPosition,
  backspace,
  insertNewline,
  insertAtomicBlock,
  updateSelectionHasFocus,
  updateSelectionAnchorAndFocus,
  makeSelectionState,
} from './libs/draft-js'
import * as DJSConsts from './libs/draft-js/constants'

import { PressTypes } from './Toolbar'
import Metrics from '../../Shared/Themes/Metrics'
import Colors from '../../Shared/Themes/Colors'

import {
  DraftJsImage,
  DraftJsVideo,
} from './Components'

const { width } = Dimensions.get('window')

const matchLastWordRegex = /[a-zA-Z]*$/

export default class RNDraftJs extends Component {
  constructor(props) {
    super(props);
    let editorState
    if (props.value) {
      editorState = EditorState.createWithContent(convertFromRaw(props.value))
    } else {
      editorState = EditorState.createEmpty()
    }

    const {hasFocus, blockType} = this.getToolbarInfo(editorState)
    setTimeout(() => {
      this.props.setHasFocus(hasFocus)
      this.props.setBlockType(blockType)
    }, 1)

    this.state = {
      editorState,
    }
  }

  componentWillReceiveProps(nextProps){
    if ((!this.props.value && nextProps.value) ||
      (nextProps.value && nextProps.storyId !== this.props.storyId)
    ){
      this.setState({
        editorState: EditorState.createWithContent(convertFromRaw(nextProps.value))
      })
    }
  }

  getToolbarInfo = (editorState) => {
    const contentState = editorState.getCurrentContent()
    const selectionState = editorState.getSelection()

    const hasFocus = selectionState.getHasFocus()
    const blockType = contentState.getBlockForKey(selectionState.getAnchorKey()).getType()

    return {hasFocus, blockType}
  }

  onChange = (editorState, autocompleteInfo) => {
    if (editorState) {
      const previous = this.getToolbarInfo(this.state.editorState)
      this.setState({editorState, autocompleteInfo})
      const current = this.getToolbarInfo(editorState)

      if (previous.hasFocus != current.hasFocus) {
        this.props.setHasFocus(current.hasFocus)
      }

      if (previous.blockType != current.blockType) {
        this.props.setBlockType(current.blockType)
      }
    }
  }

  _onInsertTextRequest = (event) => {
    let { editorState } = this.state
    let text = event.nativeEvent.text
    let position = event.nativeEvent.position

    if (!text) {
      return
    }

    if (position) {
      this.onChange(insertTextAtPosition(editorState, text, position))
    } else {
      const currentEditorState = insertText(editorState, text)

      const currentSelectionState = currentEditorState.getSelection()
      const currentKey = currentSelectionState.getStartKey()
      const currentOffset = currentSelectionState.getStartOffset()
      const currentContentState = currentEditorState.getCurrentContent()
      const currentContentBlock = currentContentState.getBlockForKey(currentKey)

      const currentText = currentContentBlock.getText()

      const textBeforeSelection = currentText.substring(0, currentOffset)
      const lastWordMatch = textBeforeSelection.match(matchLastWordRegex)

      if (lastWordMatch.length > 0) {
        const matchLength = lastWordMatch[0].length
        if (matchLength > 0) {
          const autocompleteInfo = {
            enabled: true,
            blockKey: currentKey,
            startOffset: lastWordMatch.index,
            endOffset: lastWordMatch.index + matchLength,
          }

          this.onChange(insertText(editorState, text), autocompleteInfo)
          return
        }
      }

      this.onChange(insertText(editorState, text))
    }
  }

  _onBackspaceRequest = () => {
    this.onChange(backspace(this.state.editorState))
  }

  _onNewlineRequest = () => {
    this.onChange(insertNewline(this.state.editorState))
  }

  _onSelectionChangeRequest = (event) => {
    this.updateSelectionState(event.nativeEvent)
  }

  _onReplaceRangeRequest = (incomingEvent) => {
    const { editorState } = this.state
    const event = incomingEvent.nativeEvent
    const word = event.word
    const selection = makeSelectionState(event.startKey, event.endKey, event.startOffset, event.endOffset, true)

    //const editorState = insertTextAtPosition(editorState, word, selection)

    this.onChange(insertTextAtPosition(editorState, word, selection))
  }

  updateSelectionState = (newSelectionState) => {
    let { editorState } = this.state
    let { hasFocus } = newSelectionState

    var currentState = editorState
    var stateChanged = false
    if (hasFocus != undefined) {
      let newState = updateSelectionHasFocus(currentState, hasFocus)
      if (newState) {
        currentState = newState
        stateChanged = true
      }
    }

    let { startKey, startOffset, endKey, endOffset } = newSelectionState
    if (startKey && endKey && startOffset != undefined && endOffset != undefined) {
      let newState = updateSelectionAnchorAndFocus(currentState, startKey, startOffset, endKey, endOffset)
      if (newState) {
        currentState = newState
        stateChanged = true
      }
    }

    if (stateChanged) {
      this.onChange(currentState)
    }
  }

  // will refactor later - for now mirroring NewEditor flow
  insertImage = (url) => {
    this.insertAtomicBlock('image', url)
  }

  insertVideo = (url) => {
    this.insertAtomicBlock('video', url)
  }

  insertAtomicBlock = (type, url) => {
    this.onChange(insertAtomicBlock(this.state.editorState, type, url))
  }

  toggleHeader = () => {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, DJSConsts.HeaderOne))
  }

  toggleNormal = () => {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, DJSConsts.Unstyled))
  }

  deleteAtomicBlock = (blockKey) => {
    var newState = updateSelectionAnchorAndFocus(this.state.editorState, blockKey, 0, blockKey, 0)
    if (!newState) {
      return
    }

    newState = backspace(newState, 'backspace')
    if (!newState) {
      return
    }

    this.onChange(newState)
  }

  atomicHandler = (block) => {
    const editorState = this.state.editorState
    const selection = editorState.getSelection()
    const selectedKey = selection.getStartKey()

    // TODO: Range: When range selection is added, this will need to take range into account
    const isSelected = block.key == selectedKey

    switch (block.data.type) {
      case 'image':
        return (
          <DraftJsImage
            style={styles.imageView}
            key={block.key}
            url={block.data.url}
            isSelected={isSelected}
            onPress={()=>this.updateSelectionState({startKey: block.key, endKey: block.key, startOffset: 0, endOffset: 0})}
            onDelete={()=>this.deleteAtomicBlock(block.key)}
            />
          )
      case 'video':
        return (
          <DraftJsVideo
            style={styles.videoView}
            key={block.key}
            url={block.data.url}
            isSelected={isSelected}
            onPress={()=>this.updateSelectionState({startKey: block.key, endKey: block.key, startOffset: 0, endOffset: 0})}
            onDelete={()=>this.deleteAtomicBlock(block.key)}
            />
        )
    }
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


  getEditorStateAsObject() {
    return convertToRaw(this.state.editorState.getCurrentContent())
  }

  render = () => {
    let { editorState, autocompleteInfo } = this.state
    let contentState = editorState.getCurrentContent()
    let selectionState = editorState.getSelection()

    let selection = {
      hasFocus: selectionState.getHasFocus(),
      startKey: selectionState.getStartKey(),
      startOffset: selectionState.getStartOffset(),
      endKey: selectionState.getEndKey(),
      endOffset: selectionState.getEndOffset(),
    }

    let content = convertToRaw(contentState)
    let blocks = content.blocks || []
    let blockViews = blocks
              .filter(block => block.type == 'atomic')
              .map(block => this.atomicHandler(block))

    return (
      <View style={[styles.root, this.props.style]}>
        <View style={styles.innerScroll}>
          <NativeEditor
          style={styles.draftTest}
          content={content}
          selection={selection}
          blockFontTypes={blockFontTypes}
          inlineStyleFontTypes={inlineStyleFontTypes}
          onInsertTextRequest={this._onInsertTextRequest}
          onBackspaceRequest={this._onBackspaceRequest}
          onNewlineRequest={this._onNewlineRequest}
          onSelectionChangeRequest={this._onSelectionChangeRequest}
          onReplaceRangeRequest={this._onReplaceRangeRequest}
          placeholderText="Tap here to start telling your story..."
          selectionColor={'#000000'}
          selectionOpacity={1}
          defaultAtomicWidth={Metrics.screenWidth}
          defaultAtomicHeight={200}
          paragraphSpacing={25}
          autocomplete={autocompleteInfo}
          >
          {
            blockViews
          }
          </NativeEditor>
        </View>
      </View>
    );
  }
}

// Uses naming from https://github.com/facebook/draft-js/blob/master/docs/Advanced-Topics-Custom-Block-Render.md
// List items not supported
// Styles property is treated as the base and more specific types are applied on top of that
// Can add other types as needed
// Must call 'processColor' on any colors used here
const blockFontTypes = {
  unstyled: { // No real need to use since values from styles are already used
    fontSize: 18,
  },
  placeholder: {
   color: processColor(Colors.redHighlights),
   opacity: 0.8,
  },
  headerOne: {
    fontSize: 21,
    fontWeight: '600',
    color: processColor('#1a1c21'),
  },
  headerTwo: {
    fontSize: 22
  },
  headerThree: {
    fontSize: 22
  },
  headerFour: {
    fontSize: 22
  },
  headerFive: {
    fontSize: 22
  },
  headerSix: {
    fontSize: 22
  },
  blockquote: {
  },
  codeBlock: {
  },
  atomic: {
    fontSize: 15,
    color: processColor('#757575'),
    fontStyle: 'italic',
    textAlign: 'center',
    placeholderText: 'Add a caption...',
    placeholderStyle: {
      opacity: 0.5,
    },
  },
}

// See https://github.com/facebook/draft-js/blob/master/docs/Advanced-Topics-Inline-Styles.md
// Applied on top of font settings from blockFontTypes above
// Keep in mind that inline styles can possibly overlap, so
//    if they override the same value it is undefined which one it will use
//    (for example UNDERLINE and STRIKETHROUGH)
// Must call 'processColor' on any colors used here
const inlineStyleFontTypes = {
  ITALIC: {
    fontStyle: 'italic',
  },
  BOLD: {
    fontWeight: '600',
  },
  UNDERLINE: {
    textDecorationLine: 'underline',
  },
  STRIKETHROUGH: {
    textDecoration: 'line-through',
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
  },
  innerScroll: {
    marginBottom: Metrics.doubleBaseMargin,
  },
  accessibilitySpacer: {
    alignItems: 'stretch',
    minHeight: 50,
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  draftTest: {
    width: width,
    textAlign: 'left',
    minHeight: 38,
    fontSize: 18,
    color: Colors.background,
    fontWeight: '400',
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  imageView: {
    width: Metrics.screenWidth,
    height: 200,
  },
  videoView: {
    width: Metrics.screenWidth,
    height: 200,
  }
});
