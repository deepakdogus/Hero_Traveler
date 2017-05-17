import React from 'react'
import { View, TouchableHighlight} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import styles from './Styles/TrashCanStyles'

const TrashCan = (props) => {
  return (
    <View style={styles.root}>
      <View style={styles.pencilContainer}>
        <TouchableHighlight onPress={props.touchEdit}>
          <Icon style={styles.icon}
            size={20}
            name='pencil'
          />
        </TouchableHighlight>
      </View>
      <View style={styles.trashCanContainer}>
        <TouchableHighlight onPress={props.touchTrash}>
          <Icon style={styles.icon}
            size={20}
            name='trash-o'
          />
        </TouchableHighlight>
      </View>
    </View>
  )
}

export default TrashCan
