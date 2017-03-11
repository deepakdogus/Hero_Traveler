import React from 'react'
import { ScrollView, Text, Image, View } from 'react-native'
import { Images } from '../Themes'
import RoundedButton from '../Components/RoundedButton'

// Styles
import styles from './Styles/SignupScreenStyles'

export default class SignupScreen extends React.Component {
  render () {
    return (
      <Image
        source={Images.launchBackground}
        style={styles.backgroundImage}
        blurRadius={10}
      >
        <ScrollView style={styles.container}>
          <Text style={styles.title}>Signup</Text>
          <Text style={styles.instructions}>
            Let's start by setting up your account
          </Text>
          <View style={styles.social}>
            <RoundedButton
              style={styles.facebook}
              text='Sign up with Facebook'
            />
            <RoundedButton
              style={styles.twitter}
              text='Sign up with Twitter'
            />
          </View>
        </ScrollView>
      </Image>
    )
  }
}
