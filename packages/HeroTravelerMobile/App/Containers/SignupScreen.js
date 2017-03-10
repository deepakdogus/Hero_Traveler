import React from 'react'
import { ScrollView, Text, Image, View } from 'react-native'
import { Images } from '../Themes'

// Styles
import styles from './Styles/SignupScreenStyles'

export default class SignupScreen extends React.Component {
  render () {
    return (
      <View style={styles.mainContainer}>
        <Image source={Images.launchBackground} style={styles.backgroundImage} resizeMode='stretch' />
        <ScrollView style={styles.container}>
          <Text style={styles.title}>Signup</Text>
        </ScrollView>
      </View>
    )
  }
}
