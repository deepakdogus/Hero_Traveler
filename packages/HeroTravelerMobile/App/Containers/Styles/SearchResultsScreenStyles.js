import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors } from '../../Shared/Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    flex: 1,
    backgroundColor: Colors.snow,
    marginTop: Metrics.navBarHeight - 15,
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderColor: Colors.dividerGrey,
  },
  loader: {
    height: Metrics.screenHeight - 100 - Metrics.tabBarHeight,
  },
  scrollView: {
    flex: 1,
  },
})
