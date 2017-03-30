import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
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
