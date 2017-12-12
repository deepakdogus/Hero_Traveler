import { StyleSheet } from 'react-native'
import { Colors, Metrics } from '../../Shared/Themes/'

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
    alignItems: 'center',
  },
  text: {
    color: Colors.navBarText,
    marginLeft: Metrics.baseMargin/2,
    marginRight: Metrics.baseMargin,
  },
  likeTool: {
    width: '20%',
    alignItems: 'center',
  },
  commentTool: {
    width: '20%',
    alignItems: 'center',
  },
  bookmarkTool: {
    width: '20%',
    alignItems: 'center',
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
  },
  shareIcon: {
    marginBottom: 2,
  }
})
