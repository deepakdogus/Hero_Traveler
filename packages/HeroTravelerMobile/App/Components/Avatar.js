import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  View,
  StyleSheet,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

import Image from './Image'
import {Colors} from '../Shared/Themes'

const styles = StyleSheet.create({
  root: {}
})

const SIZES = {
  small: 36,
  medium: 50,
  large: 83,
  extraLarge: 95,
}

export default class Avatar extends Component {

  static propTypes = {
    size: PropTypes.oneOf(['small', 'medium', 'large', 'extraLarge']),
    avatarUrl: PropTypes.string,
    iconColor: PropTypes.string,
  }

  static defaultProps = {
    size: 'small',
    iconColor: Colors.background
  }

  render() {
    const {
      avatarUrl,
      size,
      iconColor
    } = this.props

    const rootStyles = [
      styles.root,
      this.props.style
    ]

    if (!avatarUrl) {
      return (
        <View style={rootStyles}>
          <Icon
            name='user-circle-o'
            size={SIZES[size]}
            color={iconColor}
          />
        </View>
      )
    }

    return (
      <View style={rootStyles}>
        <Image
          cached={true}
          source={{uri: avatarUrl}}
          style={{
            width: SIZES[size],
            height: SIZES[size],
            borderRadius: SIZES[size] / 2,
          }}
          resizeMode={'cover'}
        />
      </View>
    )
  }
}
