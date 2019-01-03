import { StyleSheet } from 'react-native'
import { Colors } from '../../Shared/Themes/'

export default StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconPencil: {
    tintColor: Colors.grey,
    marginRight: 10,
    width: 23,
    height: 23,
  },
  iconTrash: {
    tintColor: Colors.grey,
  },
})
