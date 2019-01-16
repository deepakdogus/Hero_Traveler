import { Colors, Metrics, Fonts } from '../../Shared/Themes/'
import { isIPhoneX } from '../../Themes/Metrics'

export default {
  container: {
    flex: 1,
  },
  navBar: {
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
  navTitle: {
    fontSize: 18,
  },
  storyTitle: {
    fontFamily: Fonts.type.sourceSansPro,
    fontWeight: '600',
    letterSpacing: .7,
    fontSize: 15,
    color: Colors.background,
  },
  navText: {
    fontFamily: Fonts.type.montserrat,
    color: Colors.background,
    fontSize: 16,
  },
  navBarBack: {
    tintColor: Colors.redHighlights,
    transform: [{scaleX: 0.75}, {scaleY: 0.75}],
    marginRight: 50,
  },
  backButtonWithText: {
    tintColor: Colors.navBarText,
    marginRight: 0,
  },
  browseGuest: {
    fontSize: 12,
    color: Colors.snow,
  },
  buttonGrey: {
    tintColor: Colors.navBarText,
  },
  buttonGreyText: {
    color: Colors.navBarText,
    fontSize: 16,
    paddingBottom: 2.5,
    fontFamily: Fonts.type.montserrat,
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
  tabIcon: {
    image: {
      transform: [{scaleX: 0.5}, {scaleY: 0.5}],
    },
  },
}
