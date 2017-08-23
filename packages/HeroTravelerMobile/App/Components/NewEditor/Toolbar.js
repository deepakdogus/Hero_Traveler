import React from 'react'
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet
} from 'react-native'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/FontAwesome'
import {Colors} from '../../Themes'
import * as DJSConsts from './draft-js/constants'

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
      showTextMenu: false
    }

    this.toggleTextMenu = () =>
      this.setState({showTextMenu: !this.state.showTextMenu})
  }

  onPress(type) {
    this.props.onPress(type)
    this.setState({showTextMenu: false})
  }

  renderMainToolbar() {
    return (
      <View style={styles.list}>
        <Btn
          onPress={this.pressHeader}
          style={styles.borderRight}
        >
          <Text style={{fontSize: 21, fontWeight: 'bold'}}>Title</Text>
        </Btn>
        <Btn
          onPress={this.pressNormal}
          style={styles.borderRight}
        >
          <Text>Normal</Text>
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
    if (!this.state.display) return null
    return (
      <View style={styles.root}>
        {this.state.showTextMenu && this.renderTextOptions()}
        {!this.state.showTextMenu && this.renderMainToolbar()}
      </View>
    )
  }
}

const TOOLBAR_HEIGHT = 50

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'white',
    height: TOOLBAR_HEIGHT,
    borderTopColor: '#dedede',
    borderTopWidth: 1,
    flexDirection: 'row'
  },
  list: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    height: TOOLBAR_HEIGHT,
  },
  btn: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: '#dedede'
  }
})
