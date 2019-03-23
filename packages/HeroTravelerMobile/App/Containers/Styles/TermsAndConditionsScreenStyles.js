import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics } from '../../Shared/Themes/'
import { isIPhoneX } from '../../Themes/Metrics'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    flex: 1,
    backgroundColor: Colors.snow,
    marginTop: isIPhoneX() ? Metrics.navBarHeight + 20 : Metrics.navBarHeight,
    borderTopWidth: 1,
    borderTopColor: Colors.navBarText,
  },
  scrollView: {
    flex: 1,
  },
  titleText: {
    color: Colors.blackoutTint,
    fontSize: 18,
    fontWeight: '900',
    textDecorationLine: 'underline',
    letterSpacing: 0.35,
    marginHorizontal: Metrics.section,
    marginTop: Metrics.section * 0.5,
    marginBottom: Metrics.section * 0.5,
  },
  subtitleText: {
    color: Colors.text,
    fontSize: 16,
    marginHorizontal: Metrics.section,
    marginBottom: Metrics.section,
  },
  headerText: {
    color: Colors.blackoutTint,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.35,
    marginHorizontal: Metrics.section,
    marginTop: Metrics.section * 0.5,
    marginBottom: Metrics.section * 0.5,
  },
  bodyNumberText: {
    color: Colors.blackoutTint,
    fontWeight: '900',
  },
  bodyText: {
    color: Colors.grey,
    fontSize: 16,
    marginHorizontal: Metrics.section,
    marginBottom: Metrics.section,
  },
  OLbodyText: {
    color: Colors.grey,
    fontSize: 16,
    marginHorizontal: Metrics.section,
    marginBottom: Metrics.section,
  },
})
