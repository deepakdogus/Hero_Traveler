import { StyleSheet } from 'react-native'
import { Colors } from '../../Shared/Themes/'

export default StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
  },
  iconPencil: {
    tintColor: Colors.grey,
    marginRight: 10,
    width: 21,
    height: 21,
  },
  iconTrash: {
    tintColor: Colors.grey,
  }
})
