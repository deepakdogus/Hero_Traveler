import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  TouchableWithoutOpacity,
  TextInput
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import {RichTextEditor, RichTextToolbar, actions} from 'react-native-zss-rich-text-editor';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import {Colors, Metrics} from '../../Shared/Themes'
import RoundedButton from '../RoundedButton'

const ToolbarIcon = ({name, color, extraStyle = {}}) => {
  return (
    <View style={[styles.toolbarIcon, extraStyle]}>
      <Icon
        name={name}
        color={color || Colors.background}
        size={20}
      />
    </View>
  )
}

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
    width: Metrics.screenWidth,
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
  },
  toolbarIcon: {
    flex:1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.background
  },
  dialogWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
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

  constructor(props) {
    super(props)
    // this._showLinkDialog = this._showLinkDialog.bind(this)
    // this._cancelLinkDialog = this._cancelLinkDialog.bind(this)
    // this._insertLink = this._insertLink.bind(this)
    this.state = {
      linkDialogOpen: false,
      link: '',
      title: ''
    }
  }

  render() {

    const baseButtonStyle = {
      alignItems: 'center',
      justifyContent: 'center'
    }

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
          onPressAddVideo={this._addVideo}
          onPressAddLink={this._showLinkDialog}
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.heading1,
            actions.setParagraph,
            actions.insertImage,
            actions.insertVideo,
          ]}
          iconMap={{
            [actions.setBold]: (<ToolbarIcon name='bold' extraStyle={{borderLeftWidth: 1}}/>),
            [actions.setItalic]: (<ToolbarIcon name='italic' />),
            [actions.heading1]: <ToolbarIcon name='header' />,
            [actions.setParagraph]: <ToolbarIcon name='paragraph' />,
            [actions.insertImage]: <ToolbarIcon name='image' />,
            [actions.insertVideo]: <ToolbarIcon name='video-camera' />,
          }}
          getEditor={() => this.richtext}
          style={styles.toolbar}
          selectedButtonStyle={{
            ...baseButtonStyle,
          }}
          unselectedButtonStyle={{
            ...baseButtonStyle,
          }}
          selectedIconColor={Colors.snow}
        />
        {this.state.linkDialogOpen &&
          <View style={styles.dialogWrapper}>
            <TouchableWithoutOpacity onPress={this._cancelLinkDialog}>
              <View>
                <TextInput />
              </View>
              <View>
                <TextInput />
              </View>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}>
                <RoundedButton
                  style={[styles.cancelBtn, {marginRight: Metrics.baseMargin}]}
                  text='Cancel'
                  onPress={this._cancelLinkDialog}
                />
                <RoundedButton
                  style={styles.insertLinkBtn}
                  text='Insert'
                  onPress={this._insertLink}
                />
              </View>
            </TouchableWithoutOpacity>
          </View>
        }
        <KeyboardSpacer />
      </View>
    )
  }

  getEditor = () => {
    return this.richtext
  }

  _addImage = (...args) => {
    if (this.props.onAddImage) {
      this.props.onAddImage(...args)
    }
  }

  _addVideo = (...args) => {
    if (this.props.onAddVideo) {
      this.props.onAddVideo(...args)
    }
  }

  _cancelLinkDialog() {
    this.setState({
      linkDialogOpen: false,
    })
  }

  _showLinkDialog() {
    this.setState({
      linkDialogOpen: true,
      link: '',
      title: ''
    })
  }

  _insertLink() {
    this.richtext.insertLink('www.google.com', 'Google!')
    // this.editor.insertLink(this.state.link, this.state.title)
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
