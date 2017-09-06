import React from 'react'
import { View, TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import TabIcon from './TabIcon'
import styles from './Styles/TrashCanStyles'

const TrashCan = (props) => {
  return (
    <View style={styles.root}>

      <View style={styles.root}>
        <TouchableOpacity style={styles.touch} onPress={props.touchEdit}>
          <View style={styles.pencilContainer}>
            <TabIcon
              style={{
                view: styles.iconView,
                image: styles.iconPencil,
              }}
              name='pencilOutline'
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touch} onPress={props.touchTrash}>
          <View style={styles.trashCanContainer}>
            <TabIcon
              style={{
                view: styles.iconView,
                image: styles.iconTrash,
              }}
              name='trash'
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default TrashCan
