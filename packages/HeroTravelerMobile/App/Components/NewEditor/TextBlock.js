import React from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native'
import PropTypes from 'prop-types'
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome'

import Image from '../Image'
import loadAttributes from './loadAttributes'
import Video from '../Video'
import {Colors, Metrics} from '../../Themes'
import {getVideoUrlBase} from "../../Lib/getVideoUrl"
import {getImageUrlBase} from "../../Lib/getImageUrl"

export default class TextBlock extends React.Component {
  buildText = true

  static propTypes = {
    debug: PropTypes.bool,
    blockKey: PropTypes.string.isRequired,
    selectionStart: PropTypes.number,
    selectionEnd: PropTypes.number,
    text: PropTypes.node,
    data: PropTypes.object,
    customStyles: PropTypes.object,
    onChange: PropTypes.func,
    onKeyPress: PropTypes.func,
    onSelectionChange: PropTypes.func,
  }

  static defaultProps = {
    customStyles: {},
    debug: false,
  }

  constructor(props) {
    super(props)
    this.wasManuallyFocused = false
    this.blurredByReturn = false
    this.state = {
      text: this.props.text || '',
      height: 35,
      selection: {
        start: 0,
        end: 0,
      }
    }
  }

  componentDidMount() {
    if (this.props.isFocused) {
      this._input.focus()
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    console.log('build text', this.state.text !== nextState.text)
    this.buildText = this.state.text !== nextState.text
  }

  componentWillUpdate(nextProps, nextState) {
    if ((this.props.isFocused || nextProps.isFocused) && !this._input.isFocused()) {
      this.wasManuallyFocused = true
      this._input.focus()
    }
  }

  onChange = (text) => {
    this.buildText = true
    this.setState({text}, () => {
      this.buildText = false
    })
  }

  onContentSizeChange = (event) => {
    console.log('onContentSizeChange', event.nativeEvent)
    if (this.state.height !== event.nativeEvent.contentSize.height) {
      this.setState({
        height: Math.max(this.props.defaultHeight, event.nativeEvent.contentSize.height),
      });
    }
  }

  onFocus = (e) => {
    if (this.wasManuallyFocused) {
      this.wasManuallyFocused = false
    } else {
      this.props.onFocus(
        this.props.blockKey
      )
    }
  }

  onBlur = (e) => {
    this.props.onBlur(
      this.props.blockKey,
      'text',
      this.state.text,
      this.blurredByReturn
    )

    this.blurredByReturn = false
  }

  onReturn = (e) => {
    this.blurredByReturn = true
  }

  onKeyPress = (e) => {
    this.props.onKeyPress(e, this._input)
  }

  changeSelection = (e) => {
    const {start, end} = e.nativeEvent.selection

    if (!this.wasManuallyFocused) {
      this.setState({
        selection: {start, end}
      })
      this.props.onSelectionChange(
        this.props.blockKey,
        start,
        end
      )
    }

    this.wasManuallyFocused = false
  }

  onPressDelete = () => {
    this.props.onDelete(this.props.blockKey)
  }

  toggleImageFocus = () => {
    this.setState({isImageFocused: !this.state.isImageFocused})
  }

  renderImage() {
    if (this.props.type === 'image') {

      const imageEditOverlay = (
        <TouchableWithoutFeedback onPress={this.toggleImageFocus}>
          <View style={styles.assetEditOverlay}>
            <TouchableOpacity onPress={this.onPressDelete}>
              <Icon name='trash' color={Colors.snow} size={30} />
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      )

      return (
        <View style={[
          styles.imageView
        ]}>
          <TouchableWithoutFeedback
            style={{flex: 1}}
            onPress={this.toggleImageFocus}
          >
            <Image
              fullWidth={true}
              source={{ uri: `${getImageUrlBase()}/${this.props.data.url}` }}
            >
              {this.state.isImageFocused && imageEditOverlay}
            </Image>
          </TouchableWithoutFeedback>
        </View>
      )
    }
  }

  renderVideo() {
    if (this.props.type === 'video') {
      const videoUrl = `${getVideoUrlBase()}/${this.props.data.url}`
      const videoEditOverlay = (
        <TouchableWithoutFeedback onPress={this.toggleImageFocus}>
          <View style={styles.assetEditOverlay}>
            <TouchableOpacity onPress={this.onPressDelete}>
              <Icon name='trash' color={Colors.snow} size={30} />
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      )
      return (
        <View style={styles.videoView}>
          <TouchableWithoutFeedback
            style={{flex: 1}}
            onPress={this.toggleImageFocus}
          >
            <View style={styles.abs}>
              <Video
                path={videoUrl}
                allowVideoPlay={true}
                autoPlayVideo={false}
                showMuteButton={false}
                showPlayButton={true}
                videoFillSpace={true}
              />
              {this.state.isImageFocused && videoEditOverlay}
            </View>
          </TouchableWithoutFeedback>
        </View>
      )
    }
  }

  isCaptionable() {
    return _.includes(['image', 'video'], this.props.type)
  }

  getText() {
    if (this.buildText) {
      this.buildText = false
      this.textElements = loadAttributes(
        this.state.text,
        this.props.customStyles,
        this.props.inlineStyles,
        this.props.entityRanges,
        this.props.entityMap,
        this.props.navigate,
      )
    }

    return this.textElements
  }

  isTextBlank() {
    return _.size(_.trim(this.state.text)) === 0
  }

  render() {
    const customStyle = this.props.customStyles[this.props.type]

    // Disabling autocorrect until we can find a workaround for
    // the extra insert of characters
    return (
      <View style={styles.root}>
        {this.props.debug && <Text style={styles.debugText}>{this.props.blockKey}</Text>}
        {this.renderImage()}
        {this.renderVideo()}
        <TextInput
          ref={i => this._input = i}
          multiline={true}
          onSelectionChange={this.changeSelection}
          onKeyPress={this.onKeyPress}
          onChangeText={this.onChange}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          selection={this.state.selection}
          style={[
            styles.input,
            this.isCaptionable() && styles.placeholderStyle,
            {height: this.state.height}
          ]}
          placeholder={this.isCaptionable() ? 'Add a caption...' : ''}
          placeholderTextColor={'#757575'}
          autoCorrect={false}
          blurOnSubmit={true}
          onSubmitEditing={this.onReturn}
          onContentSizeChange={this.onContentSizeChange}
        >
          {!this.isTextBlank() &&
            <Text style={customStyle}>
              {this.getText()}
            </Text>
          }
        </TextInput>
      </View>
    )
  }
}

const absStretch = {
  position: 'absolute',
  top: 0,
  right:0,
  bottom: 0,
  left: 0,
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column'
  },
  input: {
    paddingTop: 10,
    paddingBottom: 10
  },
  debugText: {
    color: 'red'
  },
  assetEditOverlay: {
    backgroundColor: 'rgba(0,0,0,.6)',
    ...absStretch,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  abs: {
    ...absStretch
  },
  placeholderStyle: {
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#757575',
    padding: 20
  },
  videoView: {
    // flex: 1,
    position: 'relative',
    width: Metrics.screenWidth - 20,
    height: 200
  }
})
