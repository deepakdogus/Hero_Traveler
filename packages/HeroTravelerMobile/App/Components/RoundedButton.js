import React, { PropTypes } from 'react'
import { TouchableOpacity, Text } from 'react-native'
import styles from './Styles/RoundedButtonStyles'
import ExamplesRegistry from '../Services/ExamplesRegistry'

// Example
ExamplesRegistry.addComponentExample('Rounded Button', () =>
  <RoundedButton
    text='real buttons have curves'
    onPress={() => window.alert('Rounded Button Pressed!')}
  />
)

export default class RoundedButton extends React.Component {
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
    return (
      <TouchableOpacity
        style={[styles.button, this.props.style]}
        onPress={this.props.onPress}>
        <Text style={styles.buttonText}>{this.getText()}</Text>
      </TouchableOpacity>
    )
  }
}
