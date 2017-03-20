import React from 'react'
import { ScrollView, Text } from 'react-native'
// Styles
import styles from './CreateStoryScreenStyles'

export default class CreateStoryDetailScreen extends React.Component {

  render () {
    return (
        <ScrollView style={styles.containerWithNavbar}>
          <Text style={styles.title}>Create Story Detail</Text>
        </ScrollView>
    )
  }
}
