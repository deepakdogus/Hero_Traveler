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
    fontFamily: Fonts.type.montserrat,
    color: Colors.white,
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#e0e0e0",
    fontWeight: '300',
    fontFamily: Fonts.type.sourceSansPro,
    letterSpacing:0.7,
    marginVertical: Metrics.baseMargin / 2
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
  detailsContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  userContent: {
    flexDirection: 'row',
  },
  avatar: {
    marginRight: Metrics.baseMargin
  },
  username: {
    color: "#e0e0e0",
    fontWeight: "300",
    lineHeight: 36,
    fontSize: 15,
    fontFamily: Fonts.type.sourceSansPro
  },
  dateText: {
    color: "#e0e0e0",
    marginRight: 5,
    lineHeight: 36,
    fontFamily: Fonts.type.crimsonText,
    fontStyle: 'italic',
  },
  detailsRight: {
    flexDirection: 'row'
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
    fontSize: 11,
    fontFamily: Fonts.type.montserrat,
    color: Colors.white
  }
})
