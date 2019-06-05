import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics, Fonts } from '../../Shared/Themes/'
import { isIPhoneX } from '../../Themes/Metrics'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    backgroundColor: Colors.snow,
  },
  statusBarAvoider: {
    marginTop: Metrics.statusBarHeight,
    flex: 1,
  },
  fakeNavBar: {
    height: Metrics.navBarHeight + 20, // 120 nav height = 60 + 40 tab bar + 20
    backgroundColor: Colors.snow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 148,
    height: 30,
    marginTop: isIPhoneX()
      ? Metrics.baseMargin * 1.5 + 15
      : Metrics.baseMargin * 1.5,
  },
  scrollItemFullScreen: {
    flex: 1,
    height: Metrics.screenHeight - Metrics.navBarHeight,
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
  tabStyle: {
    width: Metrics.screenWidth * 0.23,
  },
  tabWrapper: {
    width: Metrics.screenWidth,
  },
  // Search bar
  headerSearch: {
    marginHorizontal: Metrics.baseMargin,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: isIPhoneX() ? 60 : 45,
  },
  searchWrapper: {
    marginTop: isIPhoneX() ? Metrics.baseMargin + 25 : Metrics.baseMargin,
    flex: 1,
    height: Metrics.searchBarHeight,
    backgroundColor: Colors.feedDividerGrey,
    opacity: .6,
    paddingLeft: Metrics.baseMargin / 2,
    paddingRight: Metrics.baseMargin / 2,
    borderRadius: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.background,
    textAlign: 'center',
    height: Metrics.searchBarHeight,
    marginLeft: 25,
    marginRight: 25,
  },
  cancelBtn: {
    marginTop: isIPhoneX() ? 20 : 5,
    padding: Metrics.baseMargin,
    paddingRight: 0,
  },
  cancelBtnText: {
    color: Colors.signupGrey,
    fontFamily: Fonts.type.montserrat,
  },
  InputXPosition: {
    position: 'absolute',
    top: 0,
    right: 5,
  },
  InputXView: {
    backgroundColor: Colors.snow,
    borderRadius: 100,
    justifyContent: 'center',
    height: 15,
    width: 15,
    paddingLeft: 2.5,
    marginVertical: 7.5,
  },
  InputXIcon: {
    width: 10,
    height: 10,
    paddingLeft: 5,
  },
})
