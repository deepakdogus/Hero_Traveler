import React from 'react'
import { View, TouchableHighlight} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import styles from './Styles/TrashCanStyles'


const TrashCan = (props) => {
  return (
    <View style={styles.trashCanContainer}>
      <TouchableHighlight>
        <Icon style={styles.trashCan}
          size={20}
          name='trash-o'
        />
      </TouchableHighlight>
    </View>
  )
}


export default TrashCan
