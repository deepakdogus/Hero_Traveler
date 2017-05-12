import React from 'react'
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Image
} from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux'
import styles from './Styles/ViewBioScreenStyle'

import Icon from 'react-native-vector-icons/FontAwesome'

const viewBioScreen = (props) => {
  const { username, bio } = props.user
  return (
    <View>
      <View style={styles.column}>
        <View style={styles.usernameContainer}>
          <Text style={styles.username}>{username.toUpperCase()}</Text>
        </View>
        <View style={styles.divider}>
        </View>
        <View style={styles.bio}>
          <Text >{bio}</Text>
        </View>
      </View>
    </View>
  )
}

export default viewBioScreen
