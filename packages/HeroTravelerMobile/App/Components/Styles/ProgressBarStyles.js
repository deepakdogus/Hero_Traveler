import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from '../../Shared/Themes/'

export default StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: Colors.white,
    height: 32,
    bottom: Metrics.tabBarHeight,
    zIndex: 10,
    width: Metrics.screenWidth,
    opacity: .9,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  textWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  error: {
    height: 50,
    justifyContent: 'center',
    backgroundColor: Colors.errorPink,
  },
  text: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontFamily: Fonts.type.montserrat,
    fontSize: 11,
    fontWeight: '600',
    color: Colors.background,
  },
  errorIcon: {
    height: 20,
    width: 20,
  },
  bar: {
    transform: [{scaleY: 2}]
  }
})
