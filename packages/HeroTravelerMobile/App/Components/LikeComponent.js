import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {View, Text, TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

import {Colors} from '../Shared/Themes'
import styles from './Styles/LikeComponentStyles'
import TabIcon from './TabIcon'

export default class LikeComponent extends Component {

  static propTypes = {
    likes: PropTypes.string,
    isLiked: PropTypes.bool,
    onPress: PropTypes.func,
    isRightText: PropTypes.bool,
    numberStyle: PropTypes.object,
    style: PropTypes.object,
  }

  renderText() {
    const isGreyText = this.props.isRightText ? styles.isRightText : {}
    return (
      <Text
        style={[styles.text, isGreyText, this.props.numberStyle]}
      >
        {this.props.likes}
      </Text>
    )
  }

  renderLikeIcon() {
    if (this.props.isRightText) return (
      <TabIcon
        name={this.props.isLiked ? 'like-active' : 'like'}
        style={{
          image: styles.heartIcon,
        }}
      />

    )
    else return (
      <Icon
        name={'heart'}
        color={this.props.isLiked ? Colors.red : 'white'}
        size={12}
      />
    )
  }

  render() {
    let rootComponent
    const container = (
      <View style={styles.wrapper}>
        {!this.props.isRightText && this.renderText()}
        {this.renderLikeIcon()}
        {this.props.isRightText && this.renderText()}
      </View>
    )

    if(this.props.onPress) {
      rootComponent = (
        <TouchableOpacity
          style={this.props.style}
          onPress={this.props.onPress}
          children={container}
        />
      )
    } else {
      rootComponent = (
        <View style={this.props.style} children={container} />
      )
    }

    return (
      rootComponent
    )
  }

}
