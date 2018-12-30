import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics } from '../../Shared/Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    flex: 1,
    backgroundColor: Colors.snow,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: 1.5 * Metrics.navBarHeight,
    paddingBottom: 1.5 * Metrics.tabBarHeight,
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
    color: '#757575',
    fontSize: 16,
    marginHorizontal: Metrics.section,
    marginBottom: Metrics.section,
  },
})
