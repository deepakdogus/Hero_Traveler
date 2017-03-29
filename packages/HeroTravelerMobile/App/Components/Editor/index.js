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

// const ItemTypes = {
//   TEXT: 'EDITOR_TEXT',
//   IMAGE: 'EDITOR_IMAGE',
//   VIDEO: 'EDITOR_VIDEO',
// }
//
// class IconButton extends Component {
//   render() {
//     return (
//       <TouchableOpacity {...this.props}>
//         <Icon name={this.props.name} size={15} color={Colors.background} />
//       </TouchableOpacity>
//     )
//   }
// }
//
// class Toolbar extends Component {
//   render() {
//     return (
//       <View
//         style={styles.toolbar}
//       >
//         <IconButton
//           style={styles.createMenuButton}
//           onPress={this.props.addText}
//           name="font"
//         />
//         <IconButton
//           style={styles.createMenuButton}
//           onPress={this.props.addLink}
//           name="link"
//         />
//         <IconButton
//           style={styles.createMenuButton}
//           onPress={this.props.addPhoto}
//           name="image"
//         />
//         <IconButton
//           style={styles.createMenuButton}
//           onPress={this.props.addVideo}
//           name="video-camera"
//         />
//       </View>
//     )
//   }
// }

export default class Editor extends Component {

  static defaultProps = {

  }

  constructor(props) {
    super(props)

    this.getHTML = this.getHTML.bind(this);
    this.setFocusHandlers = this.setFocusHandlers.bind(this);

    // this.state = {
    //   content: [],
    //   height: 0,
    // }
  }

  // <View style={styles.contentWrapper}>
  //   {this.state.content.length === 0 &&
  //     <ShadowButton
  //       onPress={this._startTyping}
  //       style={{margin: 20}}
  //       text='Tap here to start typing'
  //     />
  //   }
  //   {this.state.content.length > 0 && this._renderContent()}
  // </View>
  // <Toolbar
  //   addText={this._addText}
  //   addLink={this._addLink}
  //   addPhoto={this._addPhoto}
  //   addVideo={this._addVideo}
  // />
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
            initialContentHTML={'Hello <b>World</b> <p>this is a new paragraph</p> <p>this is another new paragraph</p>'}
            editorInitializedCallback={() => this.onEditorInitialized()}
          />
          <RichTextToolbar
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
