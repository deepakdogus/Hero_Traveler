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
    alignItems: 'center',
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
    letterSpacing: 1.5,
    color: Colors.snow,
    textAlign: 'center',
    fontSize: 15,
    fontFamily: Fonts.type.montserrat,
  },
  tabbarTextNotSelected: {
    color: Colors.grey
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
    color: Colors.white,
    fontSize: 13,
    fontFamily: Fonts.type.montserrat,
  },
  retakeButton: {
    backgroundColor: Colors.blackoutTint,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: 95,
    height: 35,
    marginBottom: 130,
  }
})
