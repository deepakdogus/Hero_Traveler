import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts } from '../../Themes/'

export default StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.white,
    paddingTop: Metrics.baseMargin
  },
  richText: {
    flex: 1,
    width: Metrics.screenWidth,
    height: Metrics.screenWidth - Metrics.navBarHeight,
    alignItems:'center',
    justifyContent: 'center',
    // backgroundColor: 'transparent',
  },
  // toolbar: {
  //   position: 'absolute',
  //   bottom: 0,
  //   left: 0,
  //   right: 0
  // }
})
