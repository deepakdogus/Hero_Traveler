import { StyleSheet } from 'react-native'
import { Colors } from '../../Shared/Themes/'

export default StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 1,
    top: 10,
    right: 10,
  },
  trashCanContainer: {
    backgroundColor: Colors.coal,
    opacity: .8,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    marginLeft: 1,
  },
  pencilContainer: {
    opacity: .8,
    backgroundColor: Colors.coal,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  iconView: {
    backgroundColor: Colors.clear,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
    height: 40,
    width: 40,
  },
  iconPencil: {
    marginHorizontal: 11,
  },
  iconTrash: {
    marginHorizontal: 12.5
  }
})
