'use strict';
import React, {PropTypes, Component} from 'react'
import {View, TouchableOpacity, TouchableWithoutFeedback, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import RoundedButton from './RoundedButton'

export default class FadeInOut extends Component {
  static propTypes = {
    backgroundProps: PropTypes.object,
    modalProps: PropTypes.object,
    closeModal: PropTypes.func,
  }

  nullPress() {
    return null
  }

  render() {
    const {backgroundStyle = {}, modalStyle = {}, closeModal} = this.props
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: backgroundStyle.top || 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: backgroundStyle.backgroundColor || 'rgba(0,0,0,.4)',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100
        }}
        onPress={closeModal}
      >
        <TouchableOpacity
          style={{
            height: modalStyle.height || 175,
            width: modalStyle.width || 200,
            padding: Number.isInteger(modalStyle.padding) ? modalStyle.padding : 20,
            borderRadius: modalStyle.borderRadius || 20,
            backgroundColor: 'white',
            justifyContent: 'space-between',
            alignItems: 'center',
            shadowColor: 'black',
            shadowOpacity: .2,
            shadowRadius: 30
          }}
          onPress={this.nullPress}
          activeOpacity={1}
        >
          {this.props.children}
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }
}
