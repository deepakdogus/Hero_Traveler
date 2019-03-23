import React, {Component} from 'react'
import {
  View,
  Text
} from 'react-native'

import {
  Actions as NavActions
} from 'react-native-router-flux'

import TextButton from './TextButton'
import styles from './Styles/TosFooterStyles'

export default class TOSFooter extends Component {
  render() {
    return (
      <View style={this.props.style}>      
        <View style={styles.textWrapper}>
          <Text style={styles.text}>By continuing you accept the </Text>
          <TextButton
            style={styles.linkText}
            onPress={NavActions.terms}
            text='Terms of Use'
          />
          <Text style={styles.text}> and </Text>
  	      <TextButton
  	      	style={styles.linkText}
  	        onPress={NavActions.privacy}
  	        text='Privacy Policy'
  	      />
        </View>        
      </View>
    )
  }
}
