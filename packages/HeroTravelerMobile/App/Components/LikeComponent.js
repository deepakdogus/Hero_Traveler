import React, {PropTypes, Component} from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

import {Colors} from '../Themes'
import styles from './Styles/LikeComponentStyles'

export default class LikeComponent extends Component {

  static propTypes: {
    likes: PropTypes.number,
    isLiked: PropTypes.bool,
    onPress: PropTypes.func,
  }

  render() {
    let rootComponent
    const container = (
      <View style={styles.wrapper}>
        <Text
          style={[styles.text, this.props.numberStyle]}
        >
          {this.props.likes}
        </Text>
        <Icon
          name={this.props.isLiked ? 'heart' : 'heart-o'}
          color={this.props.isLiked ? Colors.red : 'white'}
          size={12}
        />
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
