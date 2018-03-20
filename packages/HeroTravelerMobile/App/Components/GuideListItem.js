import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

import { Images } from '../Shared/Themes'

import ListItem from './ListItem'
import styles from './Styles/GuideListItem'

class GuideListItem extends Component {
  static defaultProps = {
    active: false,
    create: false,
  }
  static propTypes = {
    active: PropTypes.bool,
    create: PropTypes.bool,
    label: PropTypes.string,
  }
  state = {
    active: this.props.active
  }
  onToggle = () => {
    this.setState({
      active: !this.state.active
    })
  }
  render = () => {
    const { onToggle, props, state} = this
    const { create, img, label } = props
    const { active } = state
    return (
      <ListItem
        onPress={onToggle}
        style={styles.container}
        leftElement={
          <View
            style={styles.imageContainer}>
            <Image
              source={img || Images.iconCreateGuide}
              style={[styles.image, create && styles.placeholderImage]}
            />
          </View>
        }
        text={
          <Text
            style={[styles.label, create && styles.createLabel]}>
            {label || '+ Create new guide'}
          </Text>
        }
        rightElement={!create && (
          <View style={styles.checkbox}>
            <Image style={styles.checkboxImage} source={Images[`icon${active ? 'Red' : 'Grey'}Check`]}/>
          </View>
        )}
      />
    )
  }
}

export default GuideListItem
