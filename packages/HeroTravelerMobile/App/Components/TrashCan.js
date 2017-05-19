import React from 'react'
import { View, TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import styles from './Styles/TrashCanStyles'

const TrashCan = (props) => {
  return (
    <View style={styles.root}>
      <TouchableOpacity style={styles.touch} onPress={props.touchEdit}>
        <View style={styles.pencilContainer}>
          <Icon style={styles.icon}
            size={20}
            name='pencil'
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.touch} onPress={props.touchTrash}>
        <View style={styles.trashCanContainer}>
          <Icon style={styles.icon}
            size={20}
            name='trash-o'
          />
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default TrashCan
