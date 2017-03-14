import { StyleSheet } from 'react-native'
import { Colors, Metrics, ApplicationStyles } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    paddingTop: Metrics.titlePadding,
    paddingBottom: Metrics.mainNavHeight,
    backgroundColor: "blue"
  }
})
