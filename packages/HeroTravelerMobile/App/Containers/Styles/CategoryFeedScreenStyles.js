import { Dimensions, StyleSheet } from 'react-native'
import { ApplicationStyles, Fonts, Colors, Metrics } from '../../Shared/Themes/'

const { width } = Dimensions.get('window')

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    backgroundColor: Colors.backgroundDark,
  },
  noStoriesWrapper: {
    flex: 1,
  },
  scrollItemFullScreen: {
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
  navbarRightTextStyle: {
    fontFamily: Fonts.type.montserrat,
    fontSize: 11,
    fontWeight: '600',
    color: Colors.snow,
  },
  navbarContainer: {
    marginTop: 10,
  },
  navbarLeftIconStyle: {
    tintColor: Colors.navBarText
  },
  navbarTitleStyle: {
    fontSize: 18,
    letterSpacing: 1,
  },
  storyList: {
    height: Metrics.screenHeight - Metrics.tabBarHeight,
  }
})
