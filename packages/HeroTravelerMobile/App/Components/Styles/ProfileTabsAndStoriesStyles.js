import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from '../../Shared/Themes/'
import { isIPhoneX } from '../../Themes/Metrics'

const coverInnerHeight = 370
const tabNavEditHeight = 50

export const feedItemHeight = Metrics.screenHeight - coverInnerHeight - tabNavEditHeight - Metrics.tabBarHeight

export default StyleSheet.create({
  profileTabsAndStoriesHeight: {
    // height: isIPhoneX() ? Metrics.screenHeight - Metrics.tabBarHeight + 10 : Metrics.screenHeight - 10,
    flex: 1,
  },
  profileTabsAndStoriesRoot: {
    marginTop: 20,
  },
  profileTabsAndStoriesRootWithMarginForNavbar: {
    marginTop: isIPhoneX()
      ? Metrics.navBarHeight + 14 // 15 -1 to keep shared border @ 1px
      : Metrics.navBarHeight - 1, // same as line above
  },
  topAreaWrapper: {},
  errorText: {
    color: Colors.grey,
    textAlign: 'center',
    fontFamily: Fonts.type.montserrat,
    marginBottom: 10,
  },
  tabStyle: {
    width: '100%',
    marginLeft: 10,
    marginRight: 10,
  },
  noStories: {
    marginTop: Metrics.doubleSection,
  },
  noStoriesText: {
    textAlign: 'center',
  },
  spinnerWrapper: {
    marginTop: Metrics.doubleSection,
  },
  storyTitleStyle: {
    fontSize: 18,
    letterSpacing: 0,
  },
  subtitleStyle: {
    fontSize: 13,
    letterSpacing: .7,
    fontWeight: '300',
  },
})
