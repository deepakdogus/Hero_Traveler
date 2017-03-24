import React, {Component, PropTypes} from 'react'
import {reduce} from 'lodash'
import {
  KeyboardAvoidingView,
  TextInput,
  Text,
  TouchableOpacity,
  View,
  Image
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'


import RoundedButton from '../RoundedButton'
import {Images, Colors} from '../../Themes'
import styles from './EditorStyles'

const ItemTypes = {
  TEXT: 'EDITOR_TEXT',
  IMAGE: 'EDITOR_IMAGE',
  VIDEO: 'EDITOR_VIDEO',
}

class IconButton extends Component {
  render() {
    return (
      <TouchableOpacity {...this.props}>
        <Icon name={this.props.name} size={15} color={Colors.background} />
      </TouchableOpacity>
    )
  }
}

class Toolbar extends Component {
  render() {
    return (
      <View
        style={styles.toolbar}
      >
        <IconButton
          style={styles.createMenuButton}
          onPress={this.props.addText}
          name="font"
        />
        <IconButton
          style={styles.createMenuButton}
          onPress={this.props.addLink}
          name="link"
        />
        <IconButton
          style={styles.createMenuButton}
          onPress={this.props.addPhoto}
          name="image"
        />
        <IconButton
          style={styles.createMenuButton}
          onPress={this.props.addVideo}
          name="video-camera"
        />
      </View>
    )
  }
}

export default class Editor extends Component {

  static defaultProps = {

  }

  constructor(props) {
    super(props)

    this.state = {
      content: [],
      height: 0,
    }
  }

  render() {
    return (
      <View style={styles.root}>
        <View style={styles.contentWrapper}>
          {this.state.content.length === 0 &&
            <RoundedButton
              onPress={this._startTyping}
              text='Tap here to start typing'
            />
          }
          {this.state.content.length > 0 && this._renderContent()}
        </View>
        <Toolbar
          addText={this._addText}
          addLink={this._addLink}
          addPhoto={this._addPhoto}
          addVideo={this._addVideo}
        />
      </View>
    )
  }

  _renderContent() {
    const content = reduce(this.state.content, (content, item, index) => {
      switch (item.type) {
        case ItemTypes.TEXT:
          return content.concat(
            <TextInput
              key={index}
              multiline={true}
              style={[styles.textInput, {height: Math.max(100, this.state.height)}]}
            >
              <Text style={styles.baseText}>{item.value}</Text>
            </TextInput>
          )
        case ItemTypes.IMAGE:
          return content.concat(
            <Image
              key={index}
              source={Images.createStory}
              style={styles.baseImage}
            />
          )
      }
    }, [])

    return content
  }

  _replaceContentAtIndex = (index, newItem) => {
    const item = Object.assign({}, this.state.content.slice(index, index + 1), newItem)
    return [
      ...this.state.slice(0, index),
      item,
      ...this.state.slice(this.state.length > index + 1 ? index + 1 : index),
    ]
  }

  _startTyping = () => {
    this.setState({
      content: [{
        type: ItemTypes.TEXT,
        value: 'Change me',
        isEditing: true
      }]
    })
  }

  _addPhoto = () => {
    const content = [
      ...this.state.content,
      {
        type: ItemTypes.IMAGE,
        value: 'Some Image'
      },
      {
        type: ItemTypes.TEXT,
        value: '',
        isEditing: true
      }
    ]

    this.setState({content})
  }

  _addVideo = () => {
    this.setState({
      newContentSection: 'video'
    })
  }

  _addText = () => {
    this.setState({
      newContentSection: 'text'
    })
  }
}
