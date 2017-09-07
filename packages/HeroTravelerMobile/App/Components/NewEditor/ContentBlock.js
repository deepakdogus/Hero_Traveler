import React, {PureComponent} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  NativeModules,
} from 'react-native'
import PropTypes from 'prop-types'
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome'
import {AutoGrowingTextInput} from '@hero/react-native-autogrow-textinput';

import {DraftOffsetKey} from './draft-js/reexports'
import Image from '../Image'
import Video from '../Video'
import {Colors, Metrics} from '../../Shared/Themes'
import {getVideoUrlBase} from "../../Shared/Lib/getVideoUrl"
import {getImageUrlBase} from "../../Shared/Lib/getImageUrl"

const AutoGrowTextInputManager = NativeModules.AutoGrowTextInputManager;

AutoGrowTextInputManager.setupNotifyChangeOnSetText();

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
    if (!this.input.isFocused() && nextProps.isSelected && !this.props.isSelected) {
      this.input.focus()
    }
  }

  /*
    Fire a selection change event if this view comes into focus
    if the selection has not changed since last focus
   */
  onFocus = () => {
    this.props.onFocus(this.props.block.key)
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
    this.props.onFocus("")
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

  onRangeChange = ({nativeEvent}) => {
    if (this.props.onRangeChange) {
      this.props.onRangeChange({...nativeEvent, blockId: this.props.block.key})
    }
  }

  onDelete = () => {
    this.props.onDelete(this.props.block.key)
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
                playButtonSize={'small'}
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

  getPlaceholder() {
    if (this.isCaptionable()) return 'Add a caption...'
    else if (this.props.index === 0) return 'Tell your story here...'
    return ''
  }

  render() {
    const text = this.getText()
    const {selection , isSelected, isFocused} = this.props
    const inputSelection = isSelected ?
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
            onLayout={this.onLayout}
            placeholderTextColor={'#757575'}
            autoFocus={this.props.autoFocus}
            blurOnSubmit={true}
            selection={inputSelection}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            onSelectionChange={this.onSelectionChange}
            onHeightChange={this.onHeightChanged}
            onRangeChange={this.onRangeChange}
          >
            {!this.isTextBlank() &&
              <Text style={[
                styles.inputText,
                this.getTypeStyles()
              ]}>
                {text}
              </Text>
            }
            {this.isTextBlank() && !isFocused &&
              // placeholder is here instead of as an AutoGrowingTextInput prop in order to properly center
              <Text>
                {this.getPlaceholder()}
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
