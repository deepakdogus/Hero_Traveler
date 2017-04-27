import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    flex: 1,
    backgroundColor: Colors.snow,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewWrapper: {
    paddingTop: 1.5*Metrics.tabBarHeight,
  },
  questionText: {
    color: Colors.blackoutTint,
    fontSize: 18,
    fontWeight: "800",
    marginHorizontal: Metrics.section,
    marginTop: Metrics.section * .5,
    marginBottom: Metrics.section * .5,
  },
  answerText: {
    color: "#757575",
    fontSize: 16,
    marginHorizontal: Metrics.section,
    marginBottom: Metrics.section
  },  
})
