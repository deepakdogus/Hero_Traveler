import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors } from '../../Shared/Themes/'
import { isIPhoneX } from '../../Themes/Metrics';

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    flex: 1,
    backgroundColor: Colors.snow,
    marginTop: isIPhoneX() ? Metrics.navBarHeight + 15 : Metrics.navBarHeight,
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderColor: Colors.dividerGrey,
  },
  loader: {
    height: Metrics.screenHeight - 100 - Metrics.tabBarHeight,
  },
  scrollView: {
    flex: 1,
    paddingTop: 25,
  },
  scrollViewNoMargin: {
    flex: 1,
  },
  noResultsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    fontWeight: '500',
  },
})
