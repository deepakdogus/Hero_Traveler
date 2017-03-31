import React, { PropTypes } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import styles from './Styles/ShadowButtonStyles'
import ExamplesRegistry from '../Services/ExamplesRegistry'

// Example
ExamplesRegistry.addComponentExample('Shadow Button', () =>
  <ShadowButton
    text='Real buttons have shadows'
    onPress={() => window.alert('ShadowButton Pressed!')}
  />
)

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
    return (
      <TouchableOpacity
        style={[styles.button, this.props.style]}
        onPress={this.props.onPress}>
        <View
          shadowColor='black'
          shadowOpacity={.2}
          shadowRadius={10}
          shadowOffset={{width: 0, height: 0}}
          style={styles.view}
        >
          <Text style={[styles.buttonText, this.props.textStyle]}>{this.getText()}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}
