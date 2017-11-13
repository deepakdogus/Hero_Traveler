import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors } from '../../Shared/Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1
  },
  separator: {
    height: 10,
    backgroundColor: Colors.feedDividerGrey,
  }
})
