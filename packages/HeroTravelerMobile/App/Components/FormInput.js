import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import {
  Image,
  Modal,
  Picker,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { Colors, Images } from '../Shared/Themes'
import styles from './Styles/FormInputStyles'
const {
  button,
  buttonContent,
  container,
  dropdownMarker,
  icon,
  input,
  modalCloseButton,
  modalCloseButtonText,
  modalContent,
} = styles
const noop = () => {}

class FormInput extends Component {
  state = {
    showing: false,
    value: this.props.value,
  }
  static defaultProps = {
    icon: Images.iconInfo,
    isDropdown: false,
    onChangeText: noop,
  }
  static propTypes = {
    icon: PropTypes.number,
    isDropdown: PropTypes.bool,
    onChangeText: PropTypes.func,
    onPress: PropTypes.func,
    placeholder: PropTypes.string,
    value: PropTypes.string,
  }

  onPress = () => {
    const { isDropdown, onPress } = this.props
    if (isDropdown) {
      this.setState({
        showing: !this.state.showing,
      })
    } else {
      onPress()
    }
  }

  onChangeText = value => {
    const { onChangeText } = this.props
    this.setState({ value })
    if (onChangeText) onChangeText(value)
  }

  render = () => {
    const {
      onChangeText,
      onPress,
      icon: iconSource,
      isDropdown,
      options,
      placeholder,
      style,
    } = this.props
    const { showing, value } = this.state
    return (
      <View style={[container, style]}>
        {onPress || isDropdown ? (
          <TouchableOpacity onPress={this.onPress} style={button}>
            <View style={buttonContent}>
              <Image source={iconSource} style={icon} />
              <Text
                style={[input, value ? null : { color: Colors.navBarText }]}>
                {value ? value : placeholder}
              </Text>
              {isDropdown && <View style={dropdownMarker} />}
              {isDropdown && (
                <Modal
                  animationType={'slide'}
                  transparent={true}
                  visible={showing}>
                  <View style={modalContent}>
                    <View>
                      <TouchableOpacity
                        style={modalCloseButton}
                        onPress={() =>
                          this.setState({ showing: !this.state.showing })
                        }>
                        <Text style={modalCloseButtonText}>Done</Text>
                      </TouchableOpacity>
                    </View>
                    <Picker
                      selectedValue={value}
                      onValueChange={(itemValue, itemIndex) =>
                        this.setState({ value: itemValue })
                      }>
                      {options.map((option, idx) => (
                        <Picker.Item
                          key={`picker-item--${idx}`}
                          label={option.label}
                          value={option.value}
                        />
                      ))}
                    </Picker>
                  </View>
                </Modal>
              )}
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
