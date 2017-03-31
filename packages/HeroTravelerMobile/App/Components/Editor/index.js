import React, {Component, PropTypes} from 'react'
import {reduce} from 'lodash'
import {
  KeyboardAvoidingView,
  TextInput,
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import {RichTextEditor, RichTextToolbar, actions} from 'react-native-zss-rich-text-editor';
import KeyboardSpacer from 'react-native-keyboard-spacer';


import ShadowButton from '../ShadowButton'
import {Images, Colors} from '../../Themes'
import styles from './EditorStyles'

export default class Editor extends Component {

  constructor(props) {
    super(props)
    this.getHTML = this.getHTML.bind(this);
    this.setFocusHandlers = this.setFocusHandlers.bind(this);
  }

  render() {

    const h1Icon = (
      <Icon name='rocket' size={15} />
    )

    return (
      <View style={styles.root}>
        <RichTextEditor
            ref={(r)=> this.richtext = r}
            style={styles.richText}
            hiddenTitle={true}
            enableOnChange={true}
            initialContentHTML={[
              "Hello <b>World</b>",
              "<p>this is a new paragraph</p>",
              "<p>this is another new paragraph</p>",
              "<p>",
              "Hello",
              "</p>",
              "<p>",
              '<img src="https://c1.staticflickr.com/3/2616/5813184171_42dcfb6bb6_o.jpg" />',
              "</p>"
            ].join('')}
            editorInitializedCallback={() => this.onEditorInitialized()}
          />
          <RichTextToolbar
            onPressAddImage={this._addImage}
            actions={[
              actions.setBold,
              actions.setItalic,
              actions.heading1,
              actions.removeFormat,
              actions.insertImage,
              actions.insertLink,
            ]}
            iconMap={{
              [actions.heading1]: require('../../Images/ht-icons/icon_content-text.png'),
              [actions.removeFormat]: require('../../Images/ht-icons/icon_content-x.png')
            }}
            getEditor={() => this.richtext}
            style={styles.toolbar}
          />
          {Platform.OS === 'ios' && <KeyboardSpacer/>}
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

  onEditorInitialized() {
    this.setFocusHandlers();
    this.getHTML();
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
