import React, {Component, PropTypes} from 'react'
import {
  View,
  StyleSheet,
  TouchableWithoutOpacity,
  TextInput
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import {RichTextEditor, RichTextToolbar, actions} from 'react-native-zss-rich-text-editor';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import {Colors, Metrics} from '../../Themes'
import RoundedButton from '../RoundedButton'

const ToolbarIcon = ({name, color}) => {
  return (
    <Icon name={name}
          color={color || Colors.charcoal}
          size={20} />
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
    backgroundColor: Colors.background
  },
  dialogWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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

    // const h1Icon = (
    //   <Icon name='rocket' size={15} />
    // )

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
          onPressAddLink={this._showLinkDialog}
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.heading1,
            actions.setParagraph,
            actions.insertImage,
            // actions.insertLink,
          ]}
          iconMap={{
            [actions.setBold]: (<ToolbarIcon name='bold' />),
            [actions.setItalic]: (<ToolbarIcon name='italic' />),
            [actions.heading1]: <ToolbarIcon name='header' />,
            [actions.setParagraph]: <ToolbarIcon name='paragraph' />,
            [actions.insertImage]: <ToolbarIcon name='image' />,
            // [actions.insertLink]: <ToolbarIcon name='link' />,
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
