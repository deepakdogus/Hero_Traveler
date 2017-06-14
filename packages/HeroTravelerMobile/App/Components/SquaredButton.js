import React, { PropTypes } from 'react'
import { TouchableOpacity, Text } from 'react-native'
import styles from './Styles/SquaredButtonStyles'

export default class SquaredButton extends React.Component {
  static propTypes = {
    onPress: PropTypes.func,
    text: PropTypes.node,
    children: PropTypes.node,
    // style: PropTypes.object,
    navigator: PropTypes.object
  }

  getText () {
    const buttonText = this.props.text || this.props.children || ''
    return buttonText
  }

  render () {
    return (
      <TouchableOpacity style={[styles.button, this.props.style]} onPress={this.props.onPress}>
        <Text style={styles.buttonText}>{this.getText()}</Text>
      </TouchableOpacity>
    )
  }
}
