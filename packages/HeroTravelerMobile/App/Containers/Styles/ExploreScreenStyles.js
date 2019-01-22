import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors } from '../../Shared/Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  loader: {
    height: Metrics.screenHeight - 100 - Metrics.tabBarHeight,
  },
  tabStyle: {
    width: Metrics.screenWidth * 0.4,
    flex: 1,
  },
})

export const CategoryFeedNavActionStyles = StyleSheet.create({
  leftButtonIconStyle: { tintColor: Colors.navBarText },
  navigationBarStyle: {
    paddingTop: 5,
    borderBottomWidth: 0,
    height: Metrics.navBarHeight - 10,
    backgroundColor: Colors.background,
  },
})
