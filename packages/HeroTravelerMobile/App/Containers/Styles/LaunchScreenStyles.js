import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles, Colors, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  logo: {
    height: 100,
    width: 300,
    resizeMode: 'contain'
  },
  tagline: {
    ...Fonts.style.h5,
    color: Colors.snow
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  launchButtonGroup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.faintWhite,
    borderStyle: 'solid'
  },
  launchButtonBorderRight: {
    borderRightWidth: 1,
    borderRightColor: Colors.faintWhite,
    borderStyle: 'solid'
  },
  launchButtonWrapper: {
    flexGrow: 1,
    alignItems: 'stretch'
  },
  launchButton: {
    flexGrow: 1,
    marginVertical: 0,
    marginHorizontal: 0
  }
})
