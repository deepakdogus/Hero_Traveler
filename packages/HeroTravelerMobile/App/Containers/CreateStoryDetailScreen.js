import React from 'react'
import { ScrollView, Text } from 'react-native'
/* import { Actions as NavigationActions } from 'react-native-router-flux' */

// Styles
import styles from './Styles/MyFeedScreenStyles'

export default class CreateStoryDetailScreen extends React.Component {

  render () {
    return (
        <ScrollView style={styles.containerWithNavbar}>
          <Text style={styles.title}>Create Story Detail</Text>
        </ScrollView>
    )
  }
}
