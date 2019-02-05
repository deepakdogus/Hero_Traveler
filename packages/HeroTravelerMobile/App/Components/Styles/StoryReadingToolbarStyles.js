import { StyleSheet } from 'react-native'
import { Colors, Metrics } from '../../Shared/Themes/'
import { isIPhoneX } from '../../Themes/Metrics'

export default StyleSheet.create({
  root: {
    flexDirection: 'row',
    height: Metrics.tabBarHeight,
    borderTopWidth: 1,
    borderColor: Colors.navBarText,
    backgroundColor: Colors.snow,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  wrapper: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: isIPhoneX() ? 'flex-start' : 'center',
    marginTop: isIPhoneX() ? 10 : 0,
  },
  text: {
    color: Colors.navBarText,
    marginLeft: Metrics.baseMargin / 2,
    marginRight: Metrics.baseMargin,
  },
  likeTool: {
    width: '20%',
    alignItems: 'center',
    marginTop: isIPhoneX() ? 5 : 0,
  },
  commentTool: {
    width: '20%',
    alignItems: 'center',
    marginTop: isIPhoneX() ? 5 : 0,
  },
  bookmarkTool: {
    width: '20%',
    alignItems: 'center',
    marginTop: isIPhoneX() ? 5 : 0,
  },
  shareTool: {
    width: '20%',
    alignItems: 'center',
  },
  heartIcon: {
    width: 26,
    height: 23,
  },
  flagIcon: {
    width: 19,
    height: 23,
    marginTop: isIPhoneX() ? 5 : 0,
  },
  shareIcon: {
    marginBottom: 2,
  },
})
