import React from 'react'
import { View, TouchableOpacity} from 'react-native'
import TabIcon from './TabIcon'
import styles from './Styles/TrashCanStyles'

const TrashCan = (props) => {
  return (
    <View style={styles.root}>
      <View>
        <TouchableOpacity style={styles.touch} onPress={props.touchEdit}>
          <TabIcon
            style={{ image: styles.iconPencil }}
            name='pencil'
          />
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity style={styles.touch} onPress={props.touchTrash}>
          <TabIcon
            style={{ image: styles.iconTrash }}
            name='trashBlack'
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default TrashCan
