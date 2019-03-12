import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors } from '../../Shared/Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
  },
  refreshContainer: {
    backgroundColor: Colors.snow,
  },
  postcardContainer: {
    backgroundColor: Colors.lightGreyAreas,
  },
})
