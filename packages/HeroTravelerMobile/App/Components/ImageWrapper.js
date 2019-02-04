import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Image, ImageBackground} from 'react-native'
import FastImage from 'react-native-fast-image'
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

  componentDidMount(){
    // Kind of an antipattern but we have an async call below.
    this._mounted = true
    if (!this.hasStyleMetrics()) this._setImageSize(this.props.source.uri)
  }

  componentWillUnmount(){
    this._mounted = false
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
      if (this._mounted) {
        this.setState({
          width,
          height,
          imageUrl,
        })
      }
    })
  }

  static propTypes = {
    cached: PropTypes.bool,
    background: PropTypes.bool,
    fullWidth: PropTypes.bool,
    setCoverHeight: PropTypes.func,
    limitedHeight: PropTypes.bool,
  }

  static defaultProps = {
    cached: false,
    background: false,
  }

  render () {
    const {background, cached, fullWidth, setCoverHeight, limitedHeight, ...imageProps} = this.props
    const BaseComponent = background ? ImageBackground : Image

    if (this.props.resizeMode) {
      imageProps.resizeMode = this.props.resizeMode
    }
    else {
      imageProps.resizeMode = getResizeMode(this.state)
    }

    if (cached){
      imageProps.cache = 'force-cache'
    }

    if (fullWidth && !this.hasStyleMetrics()) {
      imageProps.style = imageProps.style || {}
      imageProps.style.width = Metrics.screenWidth
      imageProps.style.height = getRelativeHeight(Metrics.screenWidth, this.state)
    }
    if (setCoverHeight && this.state.width && this.state.width) setCoverHeight(this.state)
    if (limitedHeight) imageProps.style.height = Metrics.maxContentHeight

    imageProps.style = imageProps.style || {}
    return cached
      ? (<FastImage {...imageProps}/>)
      : (<BaseComponent {...imageProps} />)
  }
}
