import React from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, Text } from 'react-native'
import styles from '../Containers/Styles/MediaSelectorScreenStyles'

export default class MediaSelectorTabbarButton extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    isActive: PropTypes.bool,
  }

  _onPress = () => {
    this.props.onPress(this.props.text)
  }

  render () {
    return (
      <TouchableOpacity
        style={styles.tabbarButton}
        onPress={this._onPress}
      >
        <Text style={[
          styles.tabbarText,
          !this.props.isActive && styles.tabbarTextNotSelected,
        ]}>
          {this.props.text}
        </Text>
      </TouchableOpacity>
    )
  }
}
