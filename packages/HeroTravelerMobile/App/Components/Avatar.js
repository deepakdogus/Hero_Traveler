import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  View,
  StyleSheet,
} from 'react-native'
import ImageWrapper from './ImageWrapper'
import {Images} from '../Shared/Themes'

const styles = StyleSheet.create({
  root: {}
})

const SIZES = {
  extraSmall: 42,
  almostExtraSmall: 46,
  small: 40,
  medium: 50,
  large: 83,
  extraLarge: 95,
}

export default class Avatar extends Component {

  static propTypes = {
    size: PropTypes.oneOf(['extraSmall', 'almostExtraSmall', 'small', 'medium', 'large', 'extraLarge']),
    avatarUrl: PropTypes.string,
  }

  static defaultProps = {
    size: 'small',
  }

  render() {
    const {
      avatarUrl,
      size,
    } = this.props

    const rootStyles = [
      styles.root,
      this.props.style
    ]

    if (!avatarUrl) {
      return (
        <View style={rootStyles}>
          <ImageWrapper
            cached={true}
            source={Images.iconDefaultProfile}
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

    return (
      <View style={rootStyles}>
        <ImageWrapper
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
