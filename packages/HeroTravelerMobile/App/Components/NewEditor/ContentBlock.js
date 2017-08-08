import React, {PureComponent} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native'
import PropTypes from 'prop-types'
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome'
import {AutoGrowingTextInput} from '@hero/react-native-autogrow-textinput';

import {DraftOffsetKey} from './draft-js/reexports'
import Image from '../Image'
import Video from '../Video'
import {Colors, Metrics} from '../../Themes'
import {getVideoUrlBase} from "../../Lib/getVideoUrl"
import {getImageUrlBase} from "../../Lib/getImageUrl"
import Fonts from '../../Themes/Fonts'

const logSelection = (msg, selection) => {
  console.log(
    msg,
    '\n',
    `start: key(${selection.getAnchorKey()}) offset(${selection.getAnchorOffset()})`,
    '\n',
    `end:   key(${selection.getFocusKey()}) offset(${selection.getFocusOffset()})`,
    '\n',
    `focus: ${selection.getHasFocus()}`
  )
}

export default class NewTextBlock extends PureComponent {
  static propTypes = {
    customStyleMap: PropTypes.object,
    offsetKey: PropTypes.string.isRequired,
    onSelectionChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    defaultHeight: 35,
    customStyleMap: {},
  }

  constructor(props) {
    super(props)
    this.hasIgnoredFirstSelection = false
    this.state = {
      height: this.props.defaultHeight
    }
  }

  componentWillUpdate(nextProps) {
    if (!this.input.isFocused() && nextProps.isSelected) {
      this.input.focus()
    }
  }

  /*
    Fire a selection change event if this view comes into focus
    if the selection has not changed since last focus
   */
  onFocus = () => {
    if (!this.selectionChangeFired && this.lastSelectionChange) {
      const {selection, isSelected} = this.props
      let start, end

      if (isSelected && selection.getAnchorOffset() !== this.lastSelectionChange) {
        start = selection.getAnchorOffset()
        end = selection.getFocusOffset()
      } else {
        start = this.lastSelectionChange.start
        end = this.lastSelectionChange.end
      }

      this.props.onSelectionChange(
        this.props.block.getKey(),
        start,
        end,
        'focus'
      )
    }
  }

  // Reset this.selectionChangeFired so next focus at the last saved
  // cursor position fires a selection change event
  onBlur = (e) => {
    this.selectionChangeFired = false
  }

  onSelectionChange = ({nativeEvent}) => {
    const {start, end} = nativeEvent.selection
    this.lastSelectionChange = {start, end}

    // Only fire if focused - ignores the initial event on mount
    // so we don't update the EditorState unnecessarily
    if (this.input.isFocused()) {
      this.selectionChangeFired = true
      this.props.onSelectionChange(
        this.props.block.getKey(),
        start,
        end,
        'selection'
      )
    }
  }

  onKeyPress = ({nativeEvent}) => {
    this.props.onKeyPress(nativeEvent)
  }

  onDelete = () => {
    this.props.onDelete(this.props.blockKey)
  }

  toggleImageFocus = () => {
    this.setState({isImageFocused: !this.state.isImageFocused})
  }

  renderImage() {
    const {block} = this.props
    const type = block.getType()
    const data = block.getData()
    if (type === 'atomic' && data.get('type') === 'image') {
      const url = data.get('url')
      const imageEditOverlay = (
        <TouchableWithoutFeedback onPress={this.toggleImageFocus}>
          <View style={styles.assetEditOverlay}>
            <TouchableOpacity onPress={this.onDelete}>
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
              source={{ uri: `${getImageUrlBase()}/${url}` }}
            >
              {this.state.isImageFocused && imageEditOverlay}
            </Image>
          </TouchableWithoutFeedback>
        </View>
      )
    }
  }

  renderVideo() {
    const {block} = this.props
    const type = block.getType()
    const data = block.getData()
    if (type === 'atomic' && data.get('type') === 'video') {
      const url = data.get('url')
      const videoUrl = `${getVideoUrlBase()}/${url}`
      const videoEditOverlay = (
        <TouchableWithoutFeedback onPress={this.toggleImageFocus}>
          <View style={styles.assetEditOverlay}>
            <TouchableOpacity onPress={this.onDelete}>
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

  getAtomicType(): ?string {
    const {block} = this.props
    if (block.getType() === 'atomic') {
      const data = block.getData()
      return data.get('type')
    }
  }

  isCaptionable() {
    return _.includes(['image', 'video'], this.getAtomicType())
  }

  isTextBlank() {
    return _.size(_.trim(this.props.block.getText())) === 0
  }

  getTypeStyles(): ?Object {
    return this.props.customStyleMap[this.props.block.getType()]
  }

  getText(): Array<React.Element<any>> {
    const block = this.props.block
    const blockKey = block.getKey()
    const text = block.getText()
    return this.props.tree.map((leafSet, ii) => {
      const leavesForLeafSet = leafSet.get('leaves')
      return leavesForLeafSet.map((leaf, jj) => {
        const offsetKey = DraftOffsetKey.encode(blockKey, ii, jj)
        const start = leaf.get('start')
        const end = leaf.get('end')
        const inlineStyleSet = block.getInlineStyleAt(start)
        let styleObj = inlineStyleSet.toJS().reduce((map, styleName) => {
          return Object.assign(
            map,
            djStyles[styleName],
            this.getTypeStyles()
          );
        }, {});
        return (
          <Text
            key={offsetKey}
            style={styleObj}
          >
            {text.slice(start, end)}
          </Text>
        )
      }).toArray()
    })
  }

  render() {
    const text = this.getText()
    const {selection} = this.props
    const inputSelection = this.props.isSelected ?
      {start: selection.getAnchorOffset(), end: selection.getFocusOffset()} : undefined

    return (
      <View style={[
        styles.root,
        this.getAtomicType() && styles.atomicStyles,
      ]}>
        {this.renderImage()}
        {this.renderVideo()}
        <View style={[
          styles.inputWrapper,
        ]}>
          <AutoGrowingTextInput
            ref={i => this.input = i}
            multiline={true}
            style={[
              styles.input,
              this.isCaptionable() && styles.placeholderStyle,
            ]}
            placeholder={this.isCaptionable() ? 'Add a caption...' : ''}
            onLayout={this.onLayout}
            placeholderTextColor={'#757575'}
            autoFocus={this.props.autoFocus}
            autoCorrect={false}
            autoCapitalize={'none'}
            spellCheck={false}
            blurOnSubmit={true}
            selection={inputSelection}
            onKeyPress={this.onKeyPress}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            onSelectionChange={this.onSelectionChange}
            onHeightChange={this.onHeightChanged}
          >
            {!this.isTextBlank() &&
              <Text style={[
                styles.inputText,
                this.getTypeStyles()
              ]}>
                {text}
              </Text>
            }
          </AutoGrowingTextInput>
        </View>
      </View>
    )
  }
}

const djStyles = {
  ITALIC: {
    fontStyle: 'italic'
  },
  BOLD: {
    fontWeight: '600'
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
    // flex: 1,
    flexDirection: 'column',
    // marginBottom: 20,
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: 20
  },
  input: {
    fontSize: 18,
    minHeight: 35
  },
  inputText: {
    fontWeight: '300',
    color: Colors.grey,
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
    fontSize: 15,
    fontWeight: '300',
    color: Colors.grey,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: Metrics.baseMargin,
  },
  atomicStyles: {
    marginTop: 20,
  },
  videoView: {
    // flex: 1,
    position: 'relative',
    width: Metrics.screenWidth,
    height: 200
  }
})
