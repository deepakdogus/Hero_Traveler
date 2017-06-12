import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabbar: {
    height: 55,
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.background
  },
  tabbarButton: {
    height: 55,
    flex: .5,
  },
  tabbarText: {
    flex: 1,
    height: 55,
    lineHeight: 55,
    color: Colors.snow,
    textAlign: 'center',
    fontSize: 15,
    fontFamily: Fonts.type.montserrat,
  },
  imageWrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  image: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  retakeButtonText: {
    color: Colors.snow,
    fontSize: 13,
    fontFamily: Fonts.type.montserrat,
  },
  retakeButton: {
    backgroundColor: Colors.blackoutTint,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: .05,
    width: 75,
    marginBottom: 60,
  }
})
