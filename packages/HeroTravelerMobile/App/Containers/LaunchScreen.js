import React from 'react'
import { ScrollView, Text, Image, View } from 'react-native'
import { Actions } from 'react-native-router-flux'
import SquaredButton from '../Components/SquaredButton'
import { Images } from '../Themes'

// Styles
import styles from './Styles/LaunchScreenStyles'

export default class LaunchScreen extends React.Component {
  render () {
    return (
      <View style={styles.mainContainer}>
        <Image source={Images.launchBackground} style={styles.backgroundImage} resizeMode='stretch' />
        <View style={[styles.section, styles.centered]}>
          <Image source={Images.whiteLogo} style={styles.logo} />
          <Text
            style={styles.tagline}
            textAlign='center'
          >{'Share your adventures with the world.'}</Text>
        </View>
        <View style={styles.launchButtonGroup}>
          <View style={[styles.launchButtonWrapper, styles.launchButtonBorderRight]}>
            <SquaredButton
              style={styles.launchButton}
              onPress={Actions.signup}
              text='Sign Up'
            />
          </View>
          <View style={styles.launchButtonWrapper}>
            <SquaredButton
              style={styles.launchButton}
              onPress={() => alert('Login')}
              text='Login'
            />
          </View>
        </View>
      </View>
    )
  }
}
