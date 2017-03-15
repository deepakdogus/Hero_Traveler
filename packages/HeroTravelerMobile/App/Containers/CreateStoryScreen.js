import React from 'react'
import { ScrollView, Text } from 'react-native'
import { Scene, Router, Modal, NavBar, Actions as NavigationActions } from 'react-native-router-flux'
import RoundedButton from '../Components/RoundedButton'

// Styles
import styles from './Styles/MyFeedScreenStyles'

export default class CreateStoryScreen extends React.Component {

  render () {
    return (
      <ScrollView style={styles.containerWithNavbar}>
        <Text style={styles.title}>Create Story</Text>
        <RoundedButton onPress={() => console.log('adding a photo')} text='Add Photo'/>
      </ScrollView>
    )
  }
}

/* CreateStoryScreen.renderNavigationBar = (props) => {
 *   console.log('props are ', props)
 *   return (<div />)
 * }*/
