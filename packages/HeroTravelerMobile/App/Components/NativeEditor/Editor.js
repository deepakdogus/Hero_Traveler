/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Dimensions,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  requireNativeComponent,
  processColor,
} from 'react-native'

import {
  EditorState,
  RichUtils,
  applyStyle,
  convertToRaw,
  insertText,
  insertTextAtPosition,
  backspace,
  insertNewline,
  insertAtomicBlock,
  rawToEditorState,
  updateSelectionHasFocus,
  updateSelectionAnchorAndFocus,
} from './libs/draft-js'
import * as DJSConsts from './libs/draft-js/constants'

import { PressTypes } from '../NewEditor/Toolbar'
import Metrics from '../../Shared/Themes/Metrics'

const DraftJSEditor = requireNativeComponent('RNTDraftJSEditor', null)
const { width } = Dimensions.get('window')

export default class RNDraftJs extends Component {
  constructor(props) {
    super(props);
    let editorState
    if (props.value) {
      editorState = rawToEditorState(props.value)
    } else {
      editorState = EditorState.createEmpty()
    }

    this.state = {
      editorState,
    }
  }

  onChange = (editorState) => {
    if (editorState) {
      this.setState({...this.state, editorState})
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
    let { editorState } = this.state
    let { hasFocus } = event.nativeEvent

    var currentState = editorState
    var stateChanged = false
    if (hasFocus != undefined) {
      let newState = updateSelectionHasFocus(this.state.editorState, hasFocus)
      if (newState) {
        currentState = newState
        stateChanged = true
      }
    }

    let { startKey, startOffset, endKey, endOffset } = event.nativeEvent
    if (startKey && endKey && startOffset != undefined && endOffset != undefined) {
      let newState = updateSelectionAnchorAndFocus(this.state.editorState, startKey, startOffset, endKey, endOffset)
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
    this.onChange(insertAtomicBlock(this.state.editorState, type, url, convertToRaw))
  }

  toggleHeader() {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, DJSConsts.HeaderOne))
  }

  toggleNormal() {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, DJSConsts.Unstyled))
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

  render() {
    let { editorState } = this.state

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
    return (
      <View style={[styles.root, this.props.style]}>
        <View style={styles.innerScroll}>
          <DraftJSEditor
          content={content}
          style={styles.draftTest}
          blockFontTypes={blockFontTypes}
          inlineStyleFontTypes={inlineStyleFontTypes} 
          onInsertTextRequest={this._onInsertTextRequest}
          onBackspaceRequest={this._onBackspaceRequest}
          onNewlineRequest={this._onNewlineRequest}
          onSelectionChangeRequest={this._onSelectionChangeRequest}
          selection={selection}
          placeholderText="Enter text here"
          selectionColor={'#000000'}
          selectionOpacity={1}>
          </DraftJSEditor>
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
  },
  headerOne: {
    fontSize: 30,
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
    color: '#333333',
    marginBottom: 5,
    minHeight: 35,
    fontSize: 18,
    color: '#757575',
    fontWeight: '400',
  }

});
