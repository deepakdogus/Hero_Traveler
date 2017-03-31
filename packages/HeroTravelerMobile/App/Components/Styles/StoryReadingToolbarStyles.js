import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
  root: {
    flexDirection: 'row',
    height: Metrics.tabBarHeight,
    borderTopWidth: 1,
    borderColor: Colors.navBarText,
    backgroundColor: Colors.snow,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    color: Colors.navBarText,
    marginLeft: Metrics.baseMargin/2,
    marginRight: Metrics.baseMargin,
  },
  likeTool: {},
  commentTool: {},
  bookmarkTool: {},
  shareTool: {},
})
