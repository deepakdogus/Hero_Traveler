import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Image as RNImage} from 'react-native'
import {CachedImage} from 'react-native-img-cache'
import getResizeMode from '../Shared/Lib/getResizeMode'

export default class Image extends Component {
  constructor(props){
    super(props)
    this.state = {
      imageUrl: this.props.source,
      height: null,
      width: null
    }
 }
  componentWillMount() {
    this._setImageSize(this.props.source.uri)
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
    const {cached, ...imageProps} = this.props
    const BaseComponent = cached ? CachedImage : RNImage
    imageProps.resizeMode = getResizeMode(this.state)
    return (
      <BaseComponent {...imageProps} />
    )
  }
}
