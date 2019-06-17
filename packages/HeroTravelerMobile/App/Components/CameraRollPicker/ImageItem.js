import React, { Component } from 'react'
import {
  Image,
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
} from 'react-native'
import PropTypes from 'prop-types'
import _ from 'lodash'
import moment from 'moment'

const formatVideoTime = (item) => {
  return moment.utc(
    _.get(item, 'node.image.playableDuration', 0) * 1000,
  ).format('mm:ss')
}

class ImageItem extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    var { width } = Dimensions.get('window')
    var { imageMargin, imagesPerRow, containerWidth } = this.props

    if (typeof containerWidth !== 'undefined') {
      width = containerWidth
    }
    this._imageSize = (width - (imagesPerRow + 1) * imageMargin) / imagesPerRow
  }

  renderDefaultMarker = () => {
    return (
      <View style={styles.circle} />
    )
  }

  render() {
    var { item, selected, selectedMarker, imageMargin } = this.props

    var image = item.node.image
    const isVideo = item.node.type === 'ALAssetTypeVideo'

    return (
      <TouchableOpacity
        style={{ marginBottom: imageMargin, marginRight: imageMargin }}
        onPress={this._handleClick}>
        <Image
          source={{ uri: image.uri }}
          style={{ height: this._imageSize, width: this._imageSize }} />
        {(selected) ? selectedMarker(item) : this.renderDefaultMarker()}
        {isVideo && (
          <Text style={styles.duration}>
            {formatVideoTime(item)}
          </Text>
        )}
      </TouchableOpacity>
    )
  }

  _handleClick = () => {
    const image = _.get(this.props, 'item.node.image')
    this.props.onClick(image)
  }
}

const styles = StyleSheet.create({
  marker: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'transparent',
  },
  circle: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#efefef',
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
    borderColor: 'white',
    borderWidth: 3,
    opacity: 0.7,
  },
  duration: {
    position: 'absolute',
    color: 'white',
    bottom: 5,
    right: 5,
  },
})

ImageItem.defaultProps = {
  item: {},
  selected: false,
}

ImageItem.propTypes = {
  item: PropTypes.object,
  selected: PropTypes.bool,
  selectedMarker: PropTypes.func,
  imageMargin: PropTypes.number,
  imagesPerRow: PropTypes.number,
  containerWidth: PropTypes.number,
  onClick: PropTypes.func,
}

export default ImageItem
