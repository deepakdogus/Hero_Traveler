import React from 'react'
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux'
import styles from './Styles/ViewBioScreenStyle'

import Icon from 'react-native-vector-icons/FontAwesome'
import TabIcon from './TabIcon'

const viewBioScreen = (props) => {
  const { username, bio } = props.user
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => NavActions.pop()}>
          <TabIcon
            name='close'
            style={{
              image: {
                tintColor: 'black',
              }
            }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.usernameContainer}>
        <Text style={styles.username}>{username.toUpperCase()}</Text>
        <View style={styles.divider} />
        <View style={styles.bioContainer}>
          <Text style={styles.bio}>{bio}</Text>
        </View>
      </View>
    </View>
  )
}

export default viewBioScreen
