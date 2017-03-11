import React from 'react'
import { ScrollView, Text } from 'react-native'

// Styles
import styles from './Styles/MyFeedScreenStyles'

export default class MyFeedScreen extends React.Component {
  render () {
    return (
      <ScrollView style={styles.containerWithNavbar}>
        <Text style={styles.title}>Explore</Text>
      </ScrollView>
    )
  }
}
