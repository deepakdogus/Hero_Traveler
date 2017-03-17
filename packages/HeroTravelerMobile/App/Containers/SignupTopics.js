import React from 'react'
import { ScrollView, Text } from 'react-native'

// Styles
import styles from './Styles/MyFeedScreenStyles'

export default class SignupTopicsScreen extends React.Component {
  render () {
    return (
      <ScrollView style={styles.containerWithNavbar}>
        <Text style={styles.title}>Signup Topics</Text>
      </ScrollView>
    )
  }
}
