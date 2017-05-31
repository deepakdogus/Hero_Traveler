import React, { PropTypes } from 'react'
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

  render () {

    const TabIconInstance = (
      <TabIcon 
        name={ this.props.iconName } 
        style={{image: Styles.image}}
      />)

    return (
      <TouchableOpacity
        onPress={this.props.onRight || this.props.onLeft}
        style={Styles.touchableOpacity}
      >
        {this.props.onLeft && TabIconInstance}
        <Text style={ Styles.navButtonText }>{ this.props.text }</Text>
        {this.props.onRight && TabIconInstance}
      </TouchableOpacity>
    )
  }
}
