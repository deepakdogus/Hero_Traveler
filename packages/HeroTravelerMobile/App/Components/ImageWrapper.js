import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Image, ImageBackground} from 'react-native'
import {CachedImage, CachedImageBackground} from 'react-native-img-cache'
import getResizeMode from '../Shared/Lib/getResizeMode'
import Metrics from '../Themes/Metrics'
import getRelativeHeight from '../Shared/Lib/getRelativeHeight'

export default class ImageWrapper extends Component {
  constructor(props){
    super(props)
    this.state = {
      imageUrl: props.source,
    }
  }

  componentWillMount(){
    if (!this.hasStyleMetrics()) this._setImageSize(this.props.source.uri)
  }

  componentWillReceiveProps(nextProps){
    if (!this.hasStyleMetrics() && this.props.source.uri !== nextProps.source.uri) {
      this._setImageSize(nextProps.source.uri)
    }
  }

  hasStyleMetrics(){
    const {style} = this.props
    return style && style.height && style.width
  }

  _setImageSize(imageUrl) {
    if(!imageUrl) return
    Image.getSize(imageUrl, (width, height) => {
      this.setState({
        width,
        height,
        imageUrl
      })
    })
  }

  static propTypes = {
    cached: PropTypes.bool,
    background: PropTypes.bool
  }

  static defaultProps = {
    cached: false,
    background: false,
  }

  render () {
    const {background, cached, fullWidth, setCoverHeight, ...imageProps} = this.props
    const BaseComponent = cached
          ? (background ? CachedImageBackground : CachedImage)
          : (background ? ImageBackground : Image)

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
    if (setCoverHeight && this.state.width && this.state.width) setCoverHeight(this.state)

    return (
      <BaseComponent {...imageProps} />
    )
  }
}