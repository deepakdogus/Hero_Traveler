import {Colors, Metrics, Fonts} from '../../Shared/Themes/'
import { isIPhoneX } from '../../Themes/Metrics'

export default {
  container: {
    flex: 1,
  },
  navBarTitle: {
    color: Colors.navBarText,
  },
  navBarClear: {
    backgroundColor: Colors.clear,
    borderBottomWidth: 0,
    paddingTop: isIPhoneX() ? 15 : 0,
  },
  navBarFixedHeight: {
    height: isIPhoneX() ? Metrics.navBarHeight + 15 : Metrics.navBarHeight,
    paddingTop: isIPhoneX() ? 15 : 0,
    backgroundColor: Colors.clear,
  },
  tabBar: {
    backgroundColor: Colors.snow,
    height: Metrics.tabBarHeight,
    borderTopWidth: 1,
    borderTopColor: Colors.feedDividerGrey,
  },
  tabBarItemContainer: {
    height: Metrics.tabBarHeight,
    justifyContent: isIPhoneX() ? 'flex-start' : 'center',
  },
  lightNavText: {
    fontFamily: Fonts.type.montserrat,
    color: Colors.background,
    fontSize: 16,
  },
  lightNavTitle: {
    fontSize: 18,
  },
  navBarBack: {
    tintColor: Colors.feedDividerGrey,
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
  buttonGreyText: {
    color: Colors.navBarText,
  },
  createStory: {
    view: {
      width: Math.round(Metrics.screenWidth / 5),
      flex: 1,
      flexDirection: 'row',
      justifyContent:  'center',
      alignItems: isIPhoneX() ? 'flex-start' : 'center',
    },
    image: {
      transform: [{scaleX: 0.5}, {scaleY: 0.5}],
    },
  },
  storyTitle: {
    fontFamily: Fonts.type.sourceSansPro,
    fontWeight: '600',
    letterSpacing: .7,
    fontSize: 15,
    color: Colors.background,
  },
  tabIcon: {
    image: {
      transform: [{scaleX: 0.5}, {scaleY: 0.5}],
    },
  },
}
