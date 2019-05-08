'use strict'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, Animated } from 'react-native'
import { Colors, Metrics } from '../Shared/Themes/'
import { isIPhoneX } from '../Themes/Metrics'

export const visibleButtonHeight = 50
const hiddenView = -Metrics.screenHeight

function getVisibleView(maxOffset) {
  return -(Metrics.screenHeight - maxOffset - (isIPhoneX() ? 50 : 0)) + 20
}

export default class FlagModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      viewHeight: new Animated.Value(hiddenView),
    }
  }

  static propTypes = {
    closeModal: PropTypes.func,
    showModal: PropTypes.bool,
    maxOffset: PropTypes.number,
    children: PropTypes.arrayOf(PropTypes.element),
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.showModal && nextProps.showModal) {
      this.setState({showModal: true})
      this.setViewHeight(getVisibleView(this.props.maxOffset))
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

  render() {
    const { children, closeModal } = this.props
    const { viewHeight } = this.state

    if (!this.state.showModal) return null
    return (
      <TouchableOpacity
        style={styles.background}
        onPress={closeModal}
      >
        <Animated.View style={{bottom: viewHeight}}>
          {children}
        </Animated.View>
      </TouchableOpacity>
    )
  }
}

export const styles = {
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
    width: Metrics.screenWidth - 40,
    marginBottom: Metrics.baseMargin,
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: .2,
    shadowRadius: 30,
  },
  text: {
    color: Colors.background,
    fontWeight: '600',
    fontSize: 16,
  },
  reportText: {
    color: Colors.redHighlights,
  },
}
