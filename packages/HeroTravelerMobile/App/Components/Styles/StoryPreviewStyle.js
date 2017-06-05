import { StyleSheet } from 'react-native'
import { Colors, Metrics, ApplicationStyles, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  scrollView: {
    flex: 1,
    // paddingTop: Metrics.titlePadding
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row"
  },
  title: {
    fontSize: 28,
    fontWeight: "200",
    fontFamily: Fonts.type.montserrat,
    color: "white",
    letterSpacing: 1.5
  },
  subtitle: {
    fontSize: 16,
    color: "#e0e0e0",
    fontFamily: Fonts.type.sourceSansPro,
    letterSpacing:0.7
  },
  divider: {
    height: 1,
    // width: 300,
    backgroundColor: "#fff",
    opacity: 0.5
  },
  contentWrapper: {
    flexDirection: 'column',
    justifyContent: 'flex-end'
  },
  detailContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  avatar: {
    marginRight: Metrics.baseMargin
  },
  username: {
    color: "#e0e0e0",
    fontWeight: "300",
    fontSize: 15,
    fontFamily: Fonts.type.sourceSansPro
  },
  bottomRight: {
    color: "#e0e0e0",
    marginRight: 5,
    fontFamily: Fonts.type.crimsonText
  },
  timeSince: {
    marginRight: Metrics.doubleBaseMargin
  },
  tagline: {
    ...Fonts.style.h1,
    color: Colors.steel
  },
  readMore: {
    marginTop: Metrics.baseMargin,
  },
  readMoreText: {
    textAlign: 'center',
    fontFamily: Fonts.type.montserrat,
    color: Colors.white
  }
})
