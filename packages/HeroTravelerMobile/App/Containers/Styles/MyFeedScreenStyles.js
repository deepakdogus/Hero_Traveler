import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles, Colors, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  scrollContainer: {
    height: Metrics.screenHeight - Metrics.navBarHeight,
    width: Metrics.screenWidth,
    backgroundColor: '#000',
    flexDirection: "column",
  },
  scrollItemFullScreen: {
    height: Metrics.screenHeight - Metrics.navBarHeight,
    width: Metrics.screenWidth,
  },
  center: {
    justifyContent: "center",
    alignItems: "center"
  },
  message: {
    fontSize: 24,
    color: '#fff'
  }
})
