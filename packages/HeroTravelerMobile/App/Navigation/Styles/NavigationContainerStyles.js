import {Colors, Metrics, Fonts} from '../../Themes/'

export default {
  container: {
    flex: 1
  },
  navBar: {
    backgroundColor: Colors.background,
    // color: Colors.text,
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
  navText: {
    fontFamily: Fonts.type.montserrat,
    fontSize: 16,
    color: Colors.navBarText
  },
  navTitle: {
    fontFamily: Fonts.type.montserrat,
    fontSize: 20
  },
  browseGuest: {
    fontSize: 12,
    color: Colors.snow
  }
}
