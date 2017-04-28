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
  titleText: {
    color: Colors.blackoutTint,
    fontSize: 18,
    fontWeight: "900",
    textDecorationLine: "underline",
    letterSpacing: .35,
    marginHorizontal: Metrics.section,
    marginTop: Metrics.section * .5,
    marginBottom: Metrics.section * .5,
  },
  subtitleText: {
    color: Colors.text,
    fontSize: 16,
    marginHorizontal: Metrics.section,
    marginBottom: Metrics.section
  },  
  headerText: {
    color: Colors.blackoutTint,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: .35,
    marginHorizontal: Metrics.section,
    marginTop: Metrics.section * .5,
    marginBottom: Metrics.section * .5,
  },
  bodyNumberText: {
    color: Colors.blackoutTint,
    fontWeight: "900",
  },  
  bodyText: {
    color: "#757575",
    fontSize: 16,
    marginHorizontal: Metrics.section,
    marginBottom: Metrics.section
  },
  OLbodyText: {
    color: "#757575",
    fontSize: 16,
    marginHorizontal: Metrics.section,
    marginBottom: Metrics.section
  },  
})
