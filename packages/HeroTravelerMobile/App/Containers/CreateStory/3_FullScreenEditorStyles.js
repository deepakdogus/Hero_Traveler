import { StyleSheet } from 'react-native'
import { Colors } from '../../Shared/Themes/'

export default StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column'
  },
  loadingText: {
    color: Colors.white
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
})

export const customStyles = StyleSheet.create({
  unstyled: {
    fontSize: 18,
    color: '#757575'
  },
  link: {
    color: '#c4170c',
    fontWeight: 'bold',
    textDecorationLine: 'none',
  },
  'header-one': {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#1a1c21'
  }
})
