import {Colors, Metrics, Fonts} from '../../Shared/Themes/'
import { isIPhoneX } from '../../Themes/Metrics'

export default {
  container: {
    flex: 1,
  },
  navBar: {
    backgroundColor: Colors.background,
    borderBottomWidth: 0,
    height: Metrics.navBarHeight,
  },
  navBarTitle: {
    color: Colors.navBarText,
    marginTop: isIPhoneX() ? 15 : 0,
  },
  navBarClear: {
    backgroundColor: Colors.clear,
    borderBottomWidth: 0,
  },
  navBarWhite: {
    height: Metrics.navBarHeight - 15,
    backgroundColor: Colors.snow,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: Colors.dividerGrey,
  },
  tabBar: {
    backgroundColor: Colors.tabBar,
    height: Metrics.tabBarHeight,
  },
  tabBarItemContainer: {
    height: Metrics.tabBarHeight,
    justifyContent: isIPhoneX() ? 'flex-start' : 'center',
    paddingTop: isIPhoneX() ? 20 : 0,
  },
  tabBarActive: {
    backgroundColor: Colors.sectionHighlight,
    alignItems: 'center',
  },
  navText: {
    fontFamily: Fonts.type.montserrat,
    fontSize: 16,
    color: Colors.navBarText,
    marginTop: isIPhoneX() ? 15 : 0,
  },
  navTitle: {
    fontFamily: Fonts.type.montserrat,
    color: Colors.snow,
    fontSize: 18,
    marginTop: isIPhoneX() ? 15 : 0,
  },
  navBarBack: {
    tintColor: 'white',
    marginTop: isIPhoneX() ? 15 : 0,
  },
  browseGuest: {
    fontSize: 12,
    color: Colors.snow,
  },
  doneFollow: {
    color: Colors.red,
  },
  redHighlightTint: {
    tintColor: Colors.redHighlights,
  },
  signupTopicsRight: {
    color: Colors.red,
    paddingRight: 20,
  },
  buttonRed: {
    tintColor: Colors.red,
  },
  buttonGrey: {
    tintColor: Colors.navBarText,
  },
  createStory: {
    view: {
      width: Math.round(Metrics.screenWidth / 5),
      flex: 1,
      flexDirection: 'row',
      justifyContent:  'center',
      alignItems: isIPhoneX() ? 'flex-start' : 'center',
      marginTop: isIPhoneX() ? -8 : 0,
    },
  },
  storyTitle: {
    fontFamily: Fonts.type.sourceSansPro,
    fontWeight: '600',
    letterSpacing: .7,
    fontSize: 15,
    color: Colors.background,
  },
}
