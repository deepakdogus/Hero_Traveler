import React from 'react'
import {
  TouchableOpacity,
  View,
  StyleSheet
} from 'react-native'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/FontAwesome'
import TabIcon from '../TabIcon'
import {Colors, Metrics} from '../../Shared/Themes'
import * as DJSConsts from '../../Shared/Lib/draft-js-helpers/constants'

const ToolbarIcon = ({name, color, isTabIcon, extraStyle = {}}) => {
  return (
    <View style={[styles.toolbarIcon, extraStyle]}>
      { !isTabIcon &&
      <Icon
        name={name}
        color={color || Colors.background}
        size={20}
      />
      }
      { isTabIcon &&
        <TabIcon
          name={name}
          style={{image: styles.textIcon}}
        />
      }
    </View>
  )
}

export const PressTypes = {
  HeaderOne: DJSConsts.HeaderOne,
  Normal: DJSConsts.Unstyled,
  Image: 'press-image',
  Video: 'press-video',
}

const Btn = (props) => {
  return (
    <TouchableOpacity
      {...props}
      style={[styles.btn, props.style]}
    />
  )
}

export default class Toolbar extends React.Component {

  static propTypes = {
    onPress: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.pressHeader = () => this.onPress(PressTypes.HeaderOne)
    this.pressNormal = () => this.onPress(PressTypes.Normal)
    this.pressImage = () => this.onPress(PressTypes.Image)
    this.pressVideo = () => this.onPress(PressTypes.Video)

    this.state = {
      showTextMenu: false,
      display: false,
      blockType: null,
    }

    this.toggleTextMenu = () =>
      this.setState({showTextMenu: !this.state.showTextMenu})
  }

  onPress(type) {
    this.props.onPress(type)
    this.setState({showTextMenu: false})
  }

  setBlockType = (blockType) => {
    this.setState({blockType})
  }

  toggleText = () => {
    if (this.state.blockType == 'unstyled') {
      this.pressHeader()
    }
    else {
      this.pressNormal()
    }
  }

  renderMainToolbar() {
    const {blockType} = this.state
    var textIconName = null
    if (blockType === 'unstyled' || blockType === 'atomic') {
      textIconName = 'normalText'
    } else if (blockType === 'header-one') {
      textIconName = 'headerText'
    }

    return (
      <View style={styles.list}>
        <Btn
          onPress={this.toggleText}
          style={styles.borderRight}
        >
          {!!this.state.blockType && <ToolbarIcon name={textIconName} isTabIcon/>}
        </Btn>
        <Btn onPress={this.pressImage} style={styles.borderRight}>
          <ToolbarIcon name='image' />
        </Btn>

        <Btn onPress={this.pressVideo}>
          <ToolbarIcon name='video-camera' />
        </Btn>
      </View>
    )
  }

  render() {
    if (!this.props.display) return null
    return (
      <View style={styles.root}>
        {this.state.showTextMenu && this.renderTextOptions()}
        {!this.state.showTextMenu && this.renderMainToolbar()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'white',
    height: Metrics.editorToolbarHeight,
    borderTopColor: Colors.dividerGrey,
    borderTopWidth: 1,
    flexDirection: 'row',
  },
  list: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    height: Metrics.editorToolbarHeight,
  },
  btn: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: Colors.dividerGrey,
  },
  textIcon: {
    width: 30,
    height: 20,
  },
})
