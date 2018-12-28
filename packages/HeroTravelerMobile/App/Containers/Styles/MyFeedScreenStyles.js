import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics } from '../../Shared/Themes/'
import { isIPhoneX } from '../../Themes/Metrics'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    backgroundColor: Colors.backgroundDark,
  },
  fakeNavBar: {
    height: Metrics.navBarHeight,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: 148,
    height: 30,
    marginTop: isIPhoneX()
      ? Metrics.baseMargin * 1.5 + 15
      : Metrics.baseMargin * 1.5,
  },
  scrollItemFullScreen: {
    flex: 1,
    height: Metrics.screenHeight - Metrics.navBarHeight,
    width: Metrics.screenWidth,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  message: {
    fontSize: 16,
    color: '#fff',
    paddingVertical: 7,
    textAlign: 'center',
  },
  tabStyle: {
    width: Metrics.screenWidth * 0.3,
  },
  tabWrapper: {
    width: Metrics.screenWidth,
  },
})
