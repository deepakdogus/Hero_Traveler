import React, {Component} from 'react'
import {
  View,
  Text
} from 'react-native'

import styles from './Styles/TosFooterStyles'

export default class TOSFooter extends Component {
  render() {
    return (
      <View style={this.props.style}>
        <Text style={styles.text}>By continuing you accept the Terms of Use and Privacy Policy</Text>
      </View>
    )
  }
}
