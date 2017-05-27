import {Colors, Metrics, Fonts} from '../../Themes/'

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
    fontWeight: 'bold',
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
    color: Colors.red
  }
}
