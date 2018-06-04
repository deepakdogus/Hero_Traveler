import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Image, Text, View } from 'react-native'

import { Images } from '../Shared/Themes'

import ListItem from './ListItem'
import styles from './Styles/GuideListItemStyles'

class GuideListItem extends Component {
  static defaultProps = {
    active: false,
    create: false,
    onPress: () => {},
  }

  static propTypes = {
    active: PropTypes.bool,
    create: PropTypes.bool,
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
    const {imageUri, create} = this.props
    return (
      <View
        style={styles.imageContainer}>
        <Image
          source={imageUri || Images.iconCreateGuide}
          style={[styles.image, create && styles.placeholderImage]}
        />
      </View>
    )
  }

  renderRightElement = () => {
    const {create, active} = this.props
    if (create) return null
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
    const {create, label} = this.props
    return (
      <Text
        style={[styles.label, create && styles.createLabel]}>
        {label || '+ Create new guide'}
      </Text>
    )
  }

  render = () => {
    const { create, onPress } = this.props
    return (
      <ListItem
        onPress={create ? onPress : this.onToggle}
        style={styles.container}
        leftElement={this.renderLeftElement()}
        text={this.renderText()}
        rightElement={this.renderRightElement()}
      />
    )
  }
}

export default GuideListItem
