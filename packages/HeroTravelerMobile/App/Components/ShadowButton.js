import React from 'react'
import PropTypes from 'prop-types'
import { View, TouchableOpacity, Text } from 'react-native'
import styles from './Styles/ShadowButtonStyles'

export default class ShadowButton extends React.Component {
  static propTypes = {
    onPress: PropTypes.func,
    text: PropTypes.node,
    // style: PropTypes.object,
    capitalize: PropTypes.bool,
    children: PropTypes.node,
    navigator: PropTypes.object
  }

  getText () {
    const text = this.props.capitalize && this.props.text ?
      this.props.text.toUpperCase() : this.props.text
    const buttonText = this.props.children || text || ''
    return buttonText
  }

  render () {
    const {style, textStyle, titleStyle, onPress, title} = this.props
    return (
      <TouchableOpacity
        style={[styles.button, style]}
        onPress={onPress}>
        <View
          shadowColor='black'
          shadowOpacity={.2}
          shadowRadius={10}
          shadowOffset={{width: 0, height: 0}}
          style={styles.view}
        >
          {!!title && <Text style={[styles.buttonText, styles.bold, titleStyle]}>{title}</Text>}
          <Text style={[styles.buttonText, textStyle]}>{this.getText()}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}
