import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { Colors, Images } from '../Shared/Themes'
import styles from './Styles/FormInputStyles'
const { button, buttonContent, container, icon, input} = styles
const noop = () => {}

class FormInput extends Component {
  state = {
    value: this.props.value,
  }
  static defaultProps = {
    icon: Images.iconInfo,
    onChangeText: noop,
  }
  static propTypes = {
    icon: PropTypes.number,
    onChangeText: PropTypes.func,
    onPress: PropTypes.func,
    placeholder: PropTypes.string,
    value: PropTypes.string,
  }

  onChangeText = value => {
    const { onChangeText } = this.props
    this.setState({ value })
    if (onChangeText) onChangeText(value)
  }

  render = () => {
    const {
      onPress,
      icon: iconSource,
      placeholder,
      style,
      value,
    } = this.props

    return (
      <View style={[container, style]}>
        {onPress ? (
          <TouchableOpacity onPress={onPress} style={button}>
            <View style={buttonContent}>
              <Image source={iconSource} style={icon} />
              <Text
                style={[input, value ? null : { color: Colors.navBarText }]}>
                {value ? value : placeholder}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <Fragment>
            <Image source={iconSource} style={icon} />
            <TextInput
              style={[input, value ? null : { color: Colors.navBarText }]}
              onChangeText={this.onChangeText}
              placeholder={placeholder}
              placeholderTextColor={Colors.navBarText}
              value={value}
            />
          </Fragment>
        )}
      </View>
    )
  }
}

export default FormInput
