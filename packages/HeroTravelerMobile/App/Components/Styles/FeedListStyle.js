import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors } from '../../Shared/Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    backgroundColor: Colors.snow,
  },
})
