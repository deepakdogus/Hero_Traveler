import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors } from '../../Shared/Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    backgroundColor: Colors.lightGreyAreas,
  },
  refreshContainer: {
    backgroundColor: Colors.snow,
  },
  postcardContainer: {
    backgroundColor: Colors.lightGreyAreas,
  },
})
