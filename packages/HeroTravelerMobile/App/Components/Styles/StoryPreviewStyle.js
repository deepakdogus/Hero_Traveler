import { StyleSheet } from 'react-native'
import { Colors, Metrics, ApplicationStyles, Fonts } from '../../Shared/Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  scrollView: {
    flex: 1,
    // paddingTop: Metrics.titlePadding
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  readingBuffer: {
    height: Metrics.navBarHeight -10 ,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: '500',
    fontFamily: Fonts.type.montserrat,
    color: Colors.white,
    letterSpacing: 1.5,
  },
  bottomTitle: {
    fontSize: 20,
    color: Colors.backgrond,
  },
  subtitle: {
    fontSize: 16,
    color: "#e0e0e0",
    fontWeight: '300',
    fontFamily: Fonts.type.sourceSansPro,
    letterSpacing:0.7,
    marginTop: Metrics.baseMargin / 2,
    marginBottom: Metrics.baseMargin / 2 + 10,
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
  topContent: {
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
  topUsername: {
    color: Colors.redHighlights,
    fontWeight: '500',
    fontSize: 15,
    fontFamily: Fonts.type.sourceSansPro
  },
  topContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    height: 70,
  },
  storyInfoContaier: {
    paddingHorizontal: 15,
    backgroundColor: Colors.snow,
  },
  bottomContainer: {
    paddingVertical: 10,
  },
  dateText: {
    color: Colors.lightGrey,
    marginRight: 5,
    lineHeight: 36,
    fontFamily: Fonts.type.crimsonText,
    fontStyle: 'italic',
  },
  topDateText: {
    color: Colors.signupGrey,
    marginRight: 5,
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
  },
  rightRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  bookmarkContainer: {
    marginRight: 10,
  },
  bookmark: {
    width: 12,
    height: 16,
  }
})
