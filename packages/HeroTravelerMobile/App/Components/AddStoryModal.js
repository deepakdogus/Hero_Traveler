'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, Text, Animated } from 'react-native'
import { Colors, Metrics } from '../Shared/Themes/'
import { isIPhoneX } from '../Themes/Metrics'
import TabIcon from './TabIcon'

const visibleButtonHeight = 60
const marginBottom = 0
const maxOffSet = Metrics.tabBarHeight + 2 * visibleButtonHeight + 2 * marginBottom
const hiddenView = -Metrics.screenHeight
const visibleView = -(Metrics.screenHeight - maxOffSet - (isIPhoneX() ? 50 : 0)) + 50

export default class AddStoryModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      viewHeight: new Animated.Value(hiddenView),
    }
  }

  static propTypes = {
    addStory: PropTypes.func,
    addSlideshow: PropTypes.func,
    closeModal: PropTypes.func,
    showModal: PropTypes.bool,
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.showModal && nextProps.showModal) {
      this.setState({showModal: true})
      this.setViewHeight(visibleView)
    }
    else if (this.props.showModal && !nextProps.showModal) {
      this.setViewHeight(hiddenView)
      setTimeout(() => {
        this.setState({showModal: false})
      }, 200)
    }
  }

  setViewHeight(height) {
    Animated.timing(
      this.state.viewHeight,
      {
        toValue: height,
        duration: 200,
      },
    ).start()
  }

  nullPress() {
    return null
  }

  render() {
    const {closeModal, addStory, addSlideshow} = this.props
    const {viewHeight} = this.state

    if (!this.state.showModal) return null
    return (
      <TouchableOpacity
        style={styles.background}
        onPress={closeModal}
      >
        <Animated.View style={{
          bottom: viewHeight,
          paddingTop: 25,
          paddingBottom: 25,
          backgroundColor: 'white',
        }}>
          <TouchableOpacity
            style={[styles.button]}
            onPress={addStory}
          >
            <TabIcon
              name='menuCreateStory'
              style={{
                image: styles.iconImage,
              }}
            />
            <Text style={styles.text}>
              Create Story
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button]}
            onPress={addSlideshow}
          >
            <TabIcon
              name='menuCreateSlideshow'
              style={{
                image: styles.iconImage,
              }}
            />
            <Text style={styles.text}>
              Create Slideshow
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    )
  }
}

const styles = {
  background: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,.4)',
    flex: 1,
    alignItems: 'center',
    zIndex: 100,
  },
  button: {
    height: visibleButtonHeight,
    width: Metrics.screenWidth,
    marginBottom,
    backgroundColor: 'white',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconImage: {
    height: 25,
    width: 25,
    marginRight: 20,
  },
  text: {
    width: 120,
    textAlign: 'left',
    color: Colors.background,
    fontWeight: '600',
    fontSize: 16,
  },
}
