import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from '../../Shared/Themes/'

export default StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    minHeight: 32,
    width: Metrics.screenWidth,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  textWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  failureWrapper: {
    justifyContent: 'space-between',
  },
  description: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: Metrics.screenWidth - 47
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
  retryText: {
    paddingHorizontal: 5,
  },
  errorIcon: {
    height: 20,
    width: 20,
  },
  retryButtons: {
    flexDirection: "row"
  },
  bar: {
    transform: [{scaleY: 2}]
  }
})
