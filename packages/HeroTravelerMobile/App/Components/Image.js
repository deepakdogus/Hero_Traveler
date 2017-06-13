import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Image as RNImage} from 'react-native'
import {CachedImage} from 'react-native-img-cache'

export default class Image extends Component {
  static propTypes = {
    cached: PropTypes.bool
  }

  static defaultProps = {
    cached: false
  }

  render () {
    const {cached, ...imageProps} = this.props
    const BaseComponent = cached ? CachedImage : RNImage

    return (
      <BaseComponent {...imageProps} />
    )
  }
}
