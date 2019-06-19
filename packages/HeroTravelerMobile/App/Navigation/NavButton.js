import React from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, Text } from 'react-native'
import TabIcon from '../Components/TabIcon'
import Styles from './Styles/NavButtonStyles'

export default class NavButton extends React.Component {
  static propTypes = {
    iconName: PropTypes.string,
    text: PropTypes.string,
    onRight: PropTypes.func,
    onLeft: PropTypes.func,
  }

  render() {
    const { onRight, onLeft, iconName, text, style = {} } = this.props
    const TabIconInstance = (
      <TabIcon
        name={iconName}
        style={{ image: [Styles.image, style.icon || {}], view: Styles.view }}
      />
    )

    return (
      <TouchableOpacity
        onPress={onRight || onLeft}
        style={Styles.touchableOpacity}
      >
        {onLeft && TabIconInstance}
        <Text
          style={[Styles.navButtonText, style.text || {}]}
        >
          {text}
        </Text>
        {onRight && iconName && TabIconInstance}
      </TouchableOpacity>
    )
  }
}
