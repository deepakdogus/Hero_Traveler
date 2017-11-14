import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Image as RNImage} from 'react-native'
import {CachedImage} from 'react-native-img-cache'
import getResizeMode from '../Shared/Lib/getResizeMode'
import Metrics from '../Themes/Metrics'
import getRelativeHeight from '../Shared/Lib/getRelativeHeight'

export default class Image extends Component {
  constructor(props){
    super(props)
    this.state = {
      imageUrl: props.source,
    }
  }

  componentWillMount(){
    if (!this.hasStyleMetrics()) this._setImageSize(this.props.source.uri)
  }

  hasStyleMetrics(){
    const {style} = this.props
    return style && style.height && style.width
  }

  _setImageSize(imageUrl) {
    if(!imageUrl) return
    RNImage.getSize(imageUrl, (width, height) => {
      this.setState({
        width,
        height,
        imageUrl
      })
    })
  }

  static propTypes = {
    cached: PropTypes.bool
  }

  static defaultProps = {
    cached: false
  }

  render () {
    const {cached, fullWidth, ...imageProps} = this.props
    const BaseComponent = cached ? CachedImage : RNImage

    if (this.props.resizeMode) {
      imageProps.resizeMode = this.props.resizeMode
    } else {
      imageProps.resizeMode = getResizeMode(this.state)
    }

    if (fullWidth && !this.hasStyleMetrics()) {
      imageProps.style = imageProps.style || {}
      imageProps.style.width = Metrics.screenWidth
      imageProps.style.height = getRelativeHeight(Metrics.screenWidth, this.state)
    }
    return (
      <BaseComponent {...imageProps} />
    )
  }
}
