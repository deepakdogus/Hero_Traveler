import React, { PropTypes } from 'react'
import { TouchableOpacity, Text } from 'react-native'

export default class TextButton extends React.Component {
  static propTypes = {
    onPress: PropTypes.func,
    text: PropTypes.string,
    // style: PropTypes.object,
    // containerStyle: PropTypes.object,
    children: PropTypes.node,
    navigator: PropTypes.object
  }

  getText () {
    const buttonText = this.props.text || this.props.children || ''
    return buttonText
  }

  render () {
    return (
      <TouchableOpacity
        style={this.props.containerStyle}
        onPress={this.props.onPress}>
        <Text style={this.props.style}>{this.getText()}</Text>
      </TouchableOpacity>
    )
  }
}
