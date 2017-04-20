import React, {Component, PropTypes} from 'react'
import {reduce} from 'lodash'
import {
  KeyboardAvoidingView,
  TextInput,
  Text,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  Platform
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import {RichTextEditor, RichTextToolbar, actions} from 'react-native-zss-rich-text-editor';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import ShadowButton from '../ShadowButton'
import {Images, Colors, Metrics} from '../../Themes'

const styles = StyleSheet.create({
  root: {
    flex: 1,
    // flexDirection: 'column',
    backgroundColor: Colors.white,
    // paddingTop: Metrics.baseMargin
  },
  editorWrapper: {
    flex: 1,
    padding: 10,
    // paddingHorizontal: Metrics.baseMargin,
  },
  richText: {
    flex: 1,
    width: Metrics.screenWidth - Metrics.doubleBaseMargin,
    paddingLeft: 10,
    paddingRight: 10,
  },
  toolbar: {
    // flex: 1,
    backgroundColor: Colors.background
  }
})


customEditorCSS = `
  html, body {
    // font-size: 18px;
    font-weight: 300;
    color: #757575;
  }

  h1 {
    // font-size: 21px;
    color: #1a1c21;
    letter-spacing: .7px;
  }

  .caption {
    font-family: 'Source Sans Pro';
    font-style: italic;
    text-align: center;
    margin: 10px;
  }
`

export default class Editor extends Component {

  render() {

    // const h1Icon = (
    //   <Icon name='rocket' size={15} />
    // )

    console.log('rendering')

    return (
      <View style={styles.root}>
        <View style={styles.editorWrapper}>
          <RichTextEditor
            ref={(r)=> this.richtext = r}
            style={styles.richText}
            hiddenTitle={true}
            initialContentHTML={this.props.content}
            customCSS={customEditorCSS}
          />
        </View>
        <RichTextToolbar
          onPressAddImage={this._addImage}
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.heading1,
            actions.setParagraph,
            actions.removeFormat,
            actions.insertImage,
            actions.insertLink,
          ]}
          iconMap={{
            [actions.heading1]: require('../../Images/ht-icons/icon_content-text.png'),
            [actions.removeFormat]: require('../../Images/ht-icons/icon_content-x-white.png'),
            [actions.setParagraph]: require('../../Images/ht-icons/icon_content-x-white.png'),
          }}
          getEditor={() => this.richtext}
          style={styles.toolbar}
        />
        <KeyboardSpacer />
      </View>
    )
  }

  getEditor = () => {
    return this.richtext
  }

  _addImage = () => {
    if (this.props.onAddImage) {
      this.props.onAddImage()
    }
  }

  async getHTML() {
    const titleHtml = await this.richtext.getTitleHtml();
    const contentHtml = await this.richtext.getContentHtml();
    //alert(titleHtml + ' ' + contentHtml)
  }

  setFocusHandlers() {
    // this.richtext.setTitleFocusHandler(() => {
    //   //alert('title focus');
    // });
    this.richtext.setContentFocusHandler(() => {
      //alert('content focus');
    });
  }
}
