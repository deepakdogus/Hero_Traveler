import {Colors, Metrics, Fonts} from '../../Shared/Themes/'

export default {
  container: {
    flex: 1
  },
  navBar: {
    backgroundColor: Colors.background,
    borderBottomWidth: 0,
    height: Metrics.navBarHeight
  },
  navBarTitle: {
    color: Colors.navBarText
  },
  navBarClear: {
    backgroundColor: Colors.clear,
    borderBottomWidth: 0
  },
  tabBar: {
    backgroundColor: Colors.background
  },
  tabBarActive: {
    backgroundColor: Colors.sectionHighlight,
  },
  navText: {
    fontFamily: Fonts.type.montserrat,
    fontSize: 16,
    color: Colors.navBarText
  },
  navTitle: {
    fontFamily: Fonts.type.montserrat,
    color: Colors.snow,
    fontSize: 18
  },
  navBarBack: {
    tintColor: 'white'
  },
  browseGuest: {
    fontSize: 12,
    color: Colors.snow
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
      justifyContent: 'center',
      alignItems: 'center',
    }
  }
}
