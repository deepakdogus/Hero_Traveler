import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
  trashCanContainer: {
    flex: 1,
    position: 'absolute',
    zIndex: 1,
    top: 10,
    right: 10,

  },
  trashCan: {
    color: Colors.snow,
    textAlign: 'center',
    backgroundColor: Colors.coal,
    paddingTop: 8,
    opacity: 0.7,
    height: 40,
    width: 40,
    borderRadius: 14,
  }
})
