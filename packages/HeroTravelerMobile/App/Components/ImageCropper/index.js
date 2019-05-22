import React, { Component } from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import {
  View,
  Image,
  PixelRatio,
  PanResponder,
} from 'react-native'

import {Surface} from 'gl-react-native'
const {Image: GLImage} = require('./Image')

const imageDimensionsAfterZoom = (viewport, dimensions, zoom) => {
  const ImageRatio = dimensions.width / dimensions.height
  const ViewportRatio = viewport.width / viewport.height
  if (ImageRatio > ViewportRatio){
    return {
      height: Math.floor(viewport.height / zoom),
      width: Math.floor((viewport.height * ImageRatio) / zoom),
    }
  }
  else
    return {
      height: Math.floor((viewport.width / ImageRatio) / zoom),
      width: Math.floor(viewport.width / zoom),
    }
}

const movementFromZoom = (gestureState, viewport, dimensions, offsets, zoom) =>{
  let newPosX, newPosY
  // X-axis
  let widthOffset = dimensions.width - viewport.width
  let pxVsMovX = (1 / dimensions.width)
  let moveX = (gestureState.dx * pxVsMovX) * zoom
  newPosX = (parseFloat(offsets.x) - parseFloat(moveX))

  // Y-axis
  let heightOffset = dimensions.height - viewport.height
  let pxVsMovY = (1 / dimensions.height)
  let moveY = (gestureState.dy * pxVsMovY) * zoom
  newPosY = (parseFloat(offsets.y) - parseFloat(moveY))
  return {
    x: newPosX,
    y: newPosY,
  }
}

class ImageCrop extends Component {
  constructor(props) {
    super(props)
    this.state = {
      zoom: 1,

      //pan settings
      centerX: 0.5,
      centerY: 0.5,

      //Image sizes
      imageHeight: 345,
      imageWidth: 300,
      imageDimHeight: 0,
      imageDimWidth: 0,
      currentCapture: '',
      isMounted: true,
    }
    this.onCrop = _.debounce(this.onCrop, 500)
  }
  componentWillMount(){
    Image.getSize(this.props.image, (width, height) => {
      //update state
      this.setState({
        imageHeight: height,
        imageWidth: width,
      })
    })

    //
    //get dimensions after crop
    //
    this._dimensionAfterZoom = imageDimensionsAfterZoom(
      {height: this.props.cropHeight, width: this.props.cropWidth},
      {height: this.state.imageHeight, width: this.state.imageWidth},
      this.state.zoom,
    )

    this.setState({
      imageDimHeight: this._dimensionAfterZoom.height,
      imageDimWidth: this._dimensionAfterZoom.width,
    })

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,

      onPanResponderGrant: () => {
        //move variables
        this.offsetX = this.state.centerX
        this.offsetY = this.state.centerY

        //zoom variables
        this.zoomLastDistance = 0
        this.zoomCurrentDistance = 0
      },

      onPanResponderMove: (evt, gestureState) => {
        //We are moving the image
        if (evt.nativeEvent.changedTouches.length <= 1){
          var trackX = (gestureState.dx / this.props.cropWidth) * this.state.zoom
          var trackY = (gestureState.dy / this.props.cropHeight) * this.state.zoom
          var newPosX = (Number(this.offsetX) - Number(trackX))
          var newPosY = (Number(this.offsetY) - Number(trackY))
          if (newPosX > 1) newPosX = Number(1)
          if (newPosY > 1) newPosY = Number(1)
          if (newPosX < 0) newPosX = Number(0)
          if (newPosY < 0) newPosY = Number(0)

          var movement = movementFromZoom(
            gestureState,
            {width: this.props.cropWidth, height: this.props.cropHeight},
            {width: this.state.imageDimWidth, height: this.state.imageDimHeight},
            {x: this.offsetX, y: this.offsetY},
            this.state.zoom,
          )
          this.setState({centerX: movement.x})
          this.setState({centerY: movement.y})
        }
        else{
        //We are zooming the image
          if (this.zoomLastDistance == 0){
            let a = evt.nativeEvent.changedTouches[0].locationX - evt.nativeEvent.changedTouches[1].locationX
            let b = evt.nativeEvent.changedTouches[0].locationY - evt.nativeEvent.changedTouches[1].locationY
            let c = Math.sqrt( a * a + b * b )
            this.zoomLastDistance = c.toFixed(1)
          }
          else{
            let a = evt.nativeEvent.changedTouches[0].locationX - evt.nativeEvent.changedTouches[1].locationX
            let b = evt.nativeEvent.changedTouches[0].locationY - evt.nativeEvent.changedTouches[1].locationY
            let c = Math.sqrt( a * a + b * b )
            this.zoomCurrentDistance = c.toFixed(1)

            //what is the zoom level
            var distance = (this.zoomCurrentDistance - this.zoomLastDistance) / 400
            var zoom = this.state.zoom - distance

            if (zoom < 0)zoom = 0.0000001
            if (zoom > 1)zoom = 1
            this.setState({
              zoom: zoom,
            })
            //Set last distance..
            this.zoomLastDistance = this.zoomCurrentDistance
          }
        }
      },
    })
  }

  componentWillReceiveProps(nextProps){
    if (this.props.zoom != nextProps.zoom) {
      var zoom = (100 - nextProps.zoom) / 100
      this.setState({ zoom: zoom })
    }

    //
    //get dimensions after crop
    //
    this._dimensionAfterZoom = imageDimensionsAfterZoom(
      {height: this.props.cropHeight, width: this.props.cropWidth},
      {height: this.state.imageHeight, width: this.state.imageWidth},
      this.state.zoom,
    )

    this.setState({
      imageDimHeight: this._dimensionAfterZoom.height,
      imageDimWidth: this._dimensionAfterZoom.width,
    })
  }

  componentWillUnmount(){
    this.setState({
      isMounted: false,
    })
  }
  render() {
    return (
      <View {...this._panResponder.panHandlers}>
        <Surface
          width={this.props.cropWidth}
          height={this.props.cropHeight}
          pixelRatio={this.props.pixelRatio}
          backgroundColor="transparent"
          ref="cropit"
        >
          <GLImage
            source={{ uri: this.props.image}}
            imageSize={{height: this.state.imageHeight, width: this.state.imageWidth}}
            resizeMode="cover"
            isMounted={this.state.isMounted}
            onCrop={this.onCrop}
            zoom={this.state.zoom}
            center={[this.state.centerX, this.state.centerY]}
          />
        </Surface>
      </View>
    )
  }

  onCrop = (cropParams) => {
    if (!_.isEqual(cropParams, this.state.cropParams)) {
      this.setState({
        cropParams,
      })
      this.props.onCrop(cropParams)
    }
  }

  crop(){
    return this.refs.cropit.captureFrame({quality: this.props.quality, type: this.props.type, format: this.props.format, filePath: this.props.filePath})
  }
}
ImageCrop.defaultProps = {
  image: '',
  cropWidth: 300,
  cropHeight: 300,
  zoomFactor: 0,
  minZoom: 0,
  maxZoom: 100,
  quality: 1,
  pixelRatio: PixelRatio.get(),
  type: 'jpg',
  format: 'base64',
  filePath: '',
}
ImageCrop.propTypes = {
  image: PropTypes.string.isRequired,
  cropWidth: PropTypes.number.isRequired,
  cropHeight: PropTypes.number.isRequired,
  zoomFactor: PropTypes.number,
  maxZoom: PropTypes.number,
  minZoom: PropTypes.number,
  quality: PropTypes.number,
  pixelRatio: PropTypes.number,
  type: PropTypes.string,
  format: PropTypes.string,
  filePath: PropTypes.string,
  onCrop: PropTypes.func,
}

export default ImageCrop
