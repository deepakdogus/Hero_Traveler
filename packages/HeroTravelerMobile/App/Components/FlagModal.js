'use strict';
import React, {PropTypes, Component} from 'react'
import {TouchableOpacity, View, Text, Animated} from 'react-native';
import {Colors, Metrics } from '../Shared/Themes/'

export default class FlagModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      buttonHeight: new Animated.Value(0),
    }
  }

  static propTypes = {
    flagStory: PropTypes.func,
    closeModal: PropTypes.func,
  }


  componentWillReceiveProps(nextProps) {
    if (!this.props.showModal && nextProps.showModal) {
      this.setState({showModal: true})
      this.setButtonHeight(visibleButtonHeight)
    }
    else if (this.props.showModal && !nextProps.showModal) {
      this.setButtonHeight(0)
      setTimeout(() => {
        this.setState({showModal: false})
      }, 200)
    }
  }

  setButtonHeight(height) {
    Animated.timing(
      this.state.buttonHeight ,
      {
        toValue: height,
        duration: 1000,
      },
    ).start()
  }

  nullPress() {
    return null
  }

  render() {
    const {closeModal, flagStory} = this.props
    if (!this.state.showModal) return null
    return (
      <TouchableOpacity
        style={styles.background}
        onPress={closeModal}
      >
        <View style={styles.wrapper}>
          <TouchableOpacity
            style={styles.button}
            onPress={flagStory}
          >
            <Text style={[styles.text, styles.reportText]}>
              Report Story
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={closeModal}
          >
            <Text style={styles.text}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  }
}

const visibleButtonHeight = 50
const marginBottom = 10

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
    zIndex: 100
  },
  button: {
    height: visibleButtonHeight,
    width: Metrics.screenWidth - 40,
    marginBottom,
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: .2,
    shadowRadius: 30,
    bottom: -(Metrics.screenHeight - Metrics.tabBarHeight - 2*visibleButtonHeight - 2*marginBottom),
  },
  text: {
    color: Colors.background,
    fontWeight: '600',
    fontSize: 16,
  },
  reportText: {
    color: Colors.redHighlights,
  }
}
