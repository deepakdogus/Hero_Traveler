import React from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  // Image,
  TouchableWithoutFeedback
} from 'react-native'
import PropTypes from 'prop-types'
import _ from 'lodash'
import Image from '../Image'

import loadAttributes from './loadAttributes'
import Video from '../Video'
import Metrics from '../../Shared/Themes/Metrics'

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
    debug: false
  }

  constructor(props) {
    super(props)
    this.wasManuallyFocused = false
    this.blurredByReturn = false
    this.state = {
      text: this.props.text || '',
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
    this.buildText = this.state.text !== nextState.text
  }

  componentWillUpdate(nextProps, nextState) {
    if ((this.props.isFocused || nextProps.isFocused) && !this._input.isFocused()) {
      this.wasManuallyFocused = true
      this._input.focus()
    }
  }

  onChange = (text) => {
    this.setState({text})
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

  toggleImageFocus = () => {
    this.setState({isImageFocused: !this.state.isImageFocused})
  }

  renderImage() {
    if (this.props.type === 'image') {
      return (
        <View style={styles.imageView}>
          <TouchableWithoutFeedback
            style={{flex: 1}}
            onPress={this.toggleImageFocus}
          >
            <Image
              fullWidth={true}
              source={{ uri: this.props.data.url }}
            />
          </TouchableWithoutFeedback>
        </View>
      )
    }
  }

  renderVideo() {
    if (this.props.type === 'video') {
      return (
        <View style={styles.videoView}>
          <TouchableWithoutFeedback
            style={{flex: 1}}
            onPress={this.toggleVideoFocus}
          >
            <Video
              path={this.props.data.url}
              style={{
              }}
              allowVideoPlay={true}
              autoPlayVideo={false}
              showMuteButton={false}
              showPlayButton={true}
              videoFillSpace={true}
            />
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
            this.isCaptionable() && styles.placeholderStyle
          ]}
          placeholder={this.isCaptionable() ? 'Add a caption...' : ''}
          placeholderTextColor={'#757575'}
          autoCorrect={false}
          blurOnSubmit={true}
          onSubmitEditing={this.onReturn}
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column'
  },
  input: {
    paddingVertical: 7
  },
  debugText: {
    color: 'red'
  },
  imageFocused: {
    borderColor: 'green',
    borderWidth: 2
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
