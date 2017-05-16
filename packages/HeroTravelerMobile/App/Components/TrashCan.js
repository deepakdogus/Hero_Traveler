import React from 'react'
import { connect } from 'react-redux'
import { View, TouchableHighlight} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import styles from './Styles/TrashCanStyles'
import HeroAPI from '../Services/HeroAPI'


const TrashCan = (props) => {
  return (
    <View style={styles.trashCanContainer}>
      <TouchableHighlight onPress={() => props.touchTrash}>
        <Icon style={styles.trashCan}
          size={20}
          name='trash-o'
        />
      </TouchableHighlight>
    </View>
  )
}

export default TrashCan
