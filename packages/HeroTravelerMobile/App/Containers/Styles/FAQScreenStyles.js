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
  questionText: {
    color: Colors.blackoutTint,
    fontSize: 18,
    fontWeight: '900',
    marginHorizontal: Metrics.section,
    marginTop: Metrics.section * .5,
    marginBottom: Metrics.section * .5,
  },
  answerText: {
    color: Colors.grey,
    fontSize: 16,
    marginHorizontal: Metrics.section,
    marginBottom: Metrics.section,
  },
})
