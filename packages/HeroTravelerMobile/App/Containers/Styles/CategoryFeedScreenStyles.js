import { StyleSheet } from 'react-native'
import { ApplicationStyles, Fonts, Colors, Metrics } from '../../Shared/Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    backgroundColor: Colors.dividerGrey,
    paddingTop: Metrics.navBarHeight + 20, // +20 so overall height with tabs = 120
  },
  noStoriesWrapper: {
    flex: 1,
  },
  scrollItemFullScreen: {
    width: Metrics.screenWidth,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    color: Colors.snow,
    paddingVertical: 7,
    textAlign: 'center',
  },
  followTextStyle: {
    fontFamily: Fonts.type.montserrat,
    fontSize: 10,
    fontWeight: '600',
    color: Colors.redHighlights,
  },
  followingTextStyle: {
    fontFamily: Fonts.type.montserrat,
    fontSize: 10,
    fontWeight: '600',
    color: Colors.background,
  },
  navbarContainer: {
    position: 'absolute',
    width: Metrics.screenWidth,
    zIndex: 100,
  },
  navbarTitleStyle: {
    fontSize: 18,
    letterSpacing: 1,
  },
  feedList: {
    height: Metrics.screenHeight - Metrics.tabBarHeight,
  },
  tabStyle: {
    width: Metrics.screenWidth * 0.25,
  },
})
