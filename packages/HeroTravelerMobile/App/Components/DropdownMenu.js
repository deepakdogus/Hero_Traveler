import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  Image,
  Modal,
  Picker,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Colors, Images } from '../Shared/Themes'
import styles from './Styles/DropdownMenuStyles'

const noop = () => {}

class DropdownMenu extends Component {
  state = {
    showing: false,
    value: this.props.value,
  }
  static defaultProps = {
    icon: Images.iconInfo,
    onValueChange: noop,
  }
  static propTypes = {
    icon: PropTypes.number,
    onValueChange: PropTypes.func,
    placeholder: PropTypes.string,
    value: PropTypes.string,
  }

  onPress = () => {
    this.setState({
      showing: !this.state.showing,
    })
  }

  render = () => {
    const {
      onValueChange,
      icon: iconSource,
      options,
      placeholder,
      style,
      value,
    } = this.props

    const { value: internalValue } = this.state

    const { showing } = this.state

    return (
      <View style={[styles.container, style]}>
        <TouchableOpacity onPress={this.onPress} style={styles.button}>
          <View style={styles.buttonContent}>
            <Image source={iconSource} style={styles.icon} />
            <Text style={[styles.input, value ? null : { color: Colors.navBarText }]}>
              {value ? value : placeholder}
            </Text>
            <View style={styles.dropdownMarker} />
            <Modal animationType={'slide'} transparent={true} visible={showing}>
              <View style={styles.modalContent}>
                <View>
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={() =>
                      this.setState({ showing: !this.state.showing })
                    }>
                    <Text style={styles.modalCloseButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
                <Picker
                  selectedValue={internalValue}
                  onValueChange={(itemValue, itemIndex) => {
                    if (onValueChange) onValueChange(itemValue)
                    this.setState({ value: itemValue })
                  }}>
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
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

export default DropdownMenu
