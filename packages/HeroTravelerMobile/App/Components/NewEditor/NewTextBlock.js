import React from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native'
import PropTypes from 'prop-types'
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome'

import {DraftOffsetKey} from './draft-js/reexports'
import Image from '../Image'
// import loadAttributes, {NewText} from './util/loadAttributes'
import Video from '../Video'
import {Colors, Metrics} from '../../Themes'
import {getVideoUrlBase} from "../../Lib/getVideoUrl"
import {getImageUrlBase} from "../../Lib/getImageUrl"
import Fonts from '../../Themes/Fonts'

export default class NewTextBlock extends React.Component {
  static propTypes = {
    customStyleMap: PropTypes.object,
    isSelected: PropTypes.bool,
    offsetKey: PropTypes.string.isRequired,
  }

  static defaultProps = {
    defaultHeight: 35,
    customStyleMap: {},
  }

  constructor(props) {
    super(props)
    this.state = {
      height: this.props.defaultHeight
    }
  }

  // componentDidMount() {
  //   if (this.props.isFocused) {
  //     this._input.focus()
  //   }
  // }

  // componentWillReceiveProps(nextProps, nextState) {
  // }

  // componentWillUpdate(nextProps, nextState) {
  //   if ((this.props.isFocused || nextProps.isFocused) && !this._input.isFocused()) {
  //     this.wasManuallyFocused = true
  //     this._input.focus()
  //   }
  // }

  // onChange = (text) => {
  //   this.buildText = true
  //   this.setState({text}, () => {
  //     this.buildText = false
  //   })
  // }

  onContentSizeChange = (event) => {
    if (this.state.height !== event.nativeEvent.contentSize.height) {
      this.setState({
        height: Math.max(this.props.defaultHeight, event.nativeEvent.contentSize.height),
      });
    }
  }

  // onFocus = (e) => {
  //   if (this.wasManuallyFocused) {
  //     this.wasManuallyFocused = false
  //   } else {
  //     this.props.onFocus(
  //       this.props.blockKey
  //     )
  //   }
  // }

  // onBlur = (e) => {
  //   this.props.onBlur(
  //     this.props.blockKey,
  //     'text',
  //     this.state.text,
  //     this.blurredByReturn
  //   )
  //
  //   this.blurredByReturn = false
  // }

  // onReturn = (e) => {
  //   this.blurredByReturn = true
  // }

  // onKeyPress = (e) => {
  //   this.props.onKeyPress(e, this._input)
  // }

  // changeSelection = (e) => {
  //   const {start, end} = e.nativeEvent.selection
  //
  //   if (!this.wasManuallyFocused) {
  //     this.setState({
  //       selection: {start, end}
  //     })
  //     this.props.onSelectionChange(
  //       this.props.blockKey,
  //       start,
  //       end
  //     )
  //   }
  //
  //   this.wasManuallyFocused = false
  // }

  // onPressDelete = () => {
  //   this.props.onDelete(this.props.blockKey)
  // }

  toggleImageFocus = () => {
    this.setState({isImageFocused: !this.state.isImageFocused})
  }

  renderImage() {
    const {block} = this.props
    const type = block.getType()
    const data = block.getData()
    // console.log('b data', data)
    if (type === 'atomic' && data.get('type') === 'image') {
      const url = data.get('url')
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
              source={{ uri: `${getImageUrlBase()}/${url}` }}
            >
              {this.state.isImageFocused && imageEditOverlay}
            </Image>
          </TouchableWithoutFeedback>
        </View>
      )
    }
  }

  // renderVideo() {
  //   if (this.props.type === 'video') {
  //     const videoUrl = `${getVideoUrlBase()}/${this.props.data.url}`
  //     const videoEditOverlay = (
  //       <TouchableWithoutFeedback onPress={this.toggleImageFocus}>
  //         <View style={styles.assetEditOverlay}>
  //           <TouchableOpacity onPress={this.onPressDelete}>
  //             <Icon name='trash' color={Colors.snow} size={30} />
  //           </TouchableOpacity>
  //         </View>
  //       </TouchableWithoutFeedback>
  //     )
  //     return (
  //       <View style={styles.videoView}>
  //         <TouchableWithoutFeedback
  //           style={{flex: 1}}
  //           onPress={this.toggleImageFocus}
  //         >
  //           <View style={styles.abs}>
  //             <Video
  //               path={videoUrl}
  //               allowVideoPlay={true}
  //               autoPlayVideo={false}
  //               showMuteButton={false}
  //               showPlayButton={true}
  //               videoFillSpace={true}
  //             />
  //             {this.state.isImageFocused && videoEditOverlay}
  //           </View>
  //         </TouchableWithoutFeedback>
  //       </View>
  //     )
  //   }
  // }

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
    const lastLeafSet = this.props.tree.size - 1
    return this.props.tree.map((leafSet, ii) => {
      const leavesForLeafSet = leafSet.get('leaves')
      const leaves = leavesForLeafSet.map((leaf, jj) => {
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

      return leaves
    })
  }

  // const customStyle = this.props.customStyles[this.props.type]
  // Disabling autocorrect until we can find a workaround for
  // the extra insert of characters
  // {this.props.debug && <Text style={styles.debugText}>{this.props.blockKey}</Text>}
  // {this.renderImage()}
  // {this.renderVideo()}
  // onSelectionChange={this.changeSelection}
  // onKeyPress={this.onKeyPress}
  // onChangeText={this.onChange}
  // onFocus={this.onFocus}
  // onBlur={this.onBlur}
  // selection={this.state.selection}
  // onSubmitEditing={this.onReturn}
  render() {
    const text = this.getText()
    const {isSelected, selection} = this.props
    const inputSelection = isSelected ?
      {start: selection.getAnchorOffset(), end: selection.getFocusOffset()} : undefined
    return (
      <View style={[
        styles.root,
        this.getAtomicType() && styles.atomicStyles,
      ]}>
        {this.renderImage()}
        <View style={[
          styles.inputWrapper,
        ]}>
          <TextInput
            ref={i => this._input = i}
            multiline={true}
            style={[
              styles.input,
              this.isCaptionable() && styles.placeholderStyle,
              {height: this.state.height}
            ]}
            placeholder={this.isCaptionable() ? 'Add a caption...' : ''}
            placeholderTextColor={'#757575'}
            autoCorrect={false}
            blurOnSubmit={true}
            onContentSizeChange={this.onContentSizeChange}
            selection={inputSelection}
          >
            {!this.isTextBlank() &&
              <Text>
                <Text style={[
                  styles.inputText,
                  this.getTypeStyles()
                ]}>
                  {text}
                </Text>
              </Text>
            }
          </TextInput>
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
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#757575',
    marginTop: Metrics.baseMargin,
  },
  atomicStyles: {
    marginTop: 20,
  },
  videoView: {
    // flex: 1,
    position: 'relative',
    width: Metrics.screenWidth - 20,
    height: 200
  }
})
