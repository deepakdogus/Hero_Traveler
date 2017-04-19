import React, {Component, PropTypes} from 'react'
import {
  KeyboardAvoidingView,
  TextInput,
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
  StyleSheet,
} from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import { Actions as NavActions } from 'react-native-router-flux'

import Editor from '../Components/Editor'
import NavBar from './CreateStory/NavBar'
import {Images, Colors, Metrics} from '../Themes'

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
    width: Metrics.screenWidth,
  },
  editorWrapper: {
    flex: 1,
    paddingHorizontal: 10
  },
  container: {
    paddingLeft: Metrics.baseMargin,
    paddingRight: Metrics.baseMargin,
    backgroundColor: 'red',
    flex: 1,
    width: Metrics.screenWidth
  },
  webView: {
    backgroundColor: 'red',
    paddingLeft: Metrics.baseMargin,
    paddingRight: Metrics.baseMargin,
  }
})

export default class EditorTestScreen extends Component {

  static defaultProps = {
    story: {}
  }

  componentDidMount() {
    SplashScreen.hide()
  }

  _onLeft = () => {
    NavActions.pop()
  }

  _onRight = () => {
    NavActions.createStory_details()
  }

  render() {
    return (
      <View style={styles.root}>
        <NavBar
          title='Content'
          rightTitle='Next'
          onRight={this._onRight}
          leftTitle='Cancel'
          onLeft={this._onLeft}
        />
        <Editor
          ref={c => {
            if (c) {
              this.c = c
              this.editor = c.getEditor()
            }
          }}
          content={this.props.story.content}
          onChange={(text) => this.props.change('content', text)}
          onAddImage={this._handlePressAddImage}
        />
      </View>
    )
  }

  // getEditor = () => {
  //   return this.richtext
  // }

  _handlePressAddImage = () => {
    this.editor.prepareInsert()
    setTimeout(() => {
      NavActions.mediaSelectorScreen({
        type: 'push',
        mediaType: 'photo',
        title: 'Add Image',
        leftTitle: 'Cancel',
        onLeft: () => {
          console.log('typeof', NavActions.pop())
          // NavActions.pop()
          console.log(this.editor)
          setTimeout(() => this.editor.restoreSelection(), 1000)
        },
        rightTitle: 'Next',
        onSelectMedia: this._handleAddImage
      })
    }, 1000)
  }

  _handleAddImage = (data) => {
    console.log('_handleAddImage', data)
    this.editor.restoreSelection()
    // this.editor.focusContent()
    setTimeout(() => {
      console.log('insertImage 1')
      this.editor.insertImage({
        src: 'https://c1.staticflickr.com/3/2396/5813752744_17c3a3c46e_b.jpg'
      })
      // this.c.forceUpdate()
      this.editor.getContentHtml().then(console.log)
    }, 1000)
    NavActions.pop()
  }
}
