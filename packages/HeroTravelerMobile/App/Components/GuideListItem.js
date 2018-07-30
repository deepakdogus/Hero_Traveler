import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Image, Text, View } from 'react-native'

import { Images } from '../Shared/Themes'

import ListItem from './ListItem'
import ImageWrapper from './ImageWrapper'
import styles from './Styles/GuideListItemStyles'

class GuideListItem extends Component {
  static defaultProps = {
    active: false,
    isCreate: false,
  }

  static propTypes = {
    active: PropTypes.bool,
    isCreate: PropTypes.bool,
    label: PropTypes.string,
    onPress: PropTypes.func,
    onToggle: PropTypes.func,
    imageUri: PropTypes.object,
    guideId: PropTypes.string,
  }

  onToggle = () => {
    const {guideId, onToggle} = this.props
    onToggle(guideId)
  }

  renderLeftElement = () => {
    const {imageUri, isCreate} = this.props
    const ImageComponent = isCreate ? Image : ImageWrapper
    return (
      <View
        style={styles.imageContainer}>
        <ImageComponent
          cached
          source={imageUri || Images.iconCreateGuide}
          style={[styles.image, isCreate && styles.placeholderImage]}
        />
      </View>
    )
  }

  renderRightElement = () => {
    const {onToggle, active} = this.props
    if (!onToggle) return null
    return (
       <View style={styles.checkbox}>
          <Image
            style={styles.checkboxImage}
            source={Images[`icon${active ? 'Red' : 'Grey'}Check`]}
          />
        </View>
    )
  }

  renderText = () => {
    const {isCreate, label} = this.props
    return (
      <Text
        style={[styles.label, isCreate && styles.createLabel]}>
        {label || '+ Create new guide'}
      </Text>
    )
  }

  getOnPress = () => {
    const {onPress, onToggle} = this.props
    if (onPress) return onPress
    else if (onToggle) return this.onToggle
    else return
  }

  render = () => {
    return (
      <ListItem
        onPress={this.getOnPress()}
        style={styles.container}
        leftElement={this.renderLeftElement()}
        text={this.renderText()}
        rightElement={this.renderRightElement()}
      />
    )
  }
}

export default GuideListItem
