import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts } from '../../Shared/Themes/'

const coverMediaStyles = StyleSheet.create({
  lightGreyAreasBG: {
    flex: 1,
    backgroundColor: Colors.lightGreyAreas,
    maxHeight: Metrics.storyCover.fullScreen.height,
  },
  contentWrapper: {
    flex: 1,
  },
  addPhotoView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoButton: {
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: 282,
    width: Metrics.screenWidth,
  },
  cameraIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Metrics.doubleBaseMargin,
  },
  cameraIconImage: {
    tintColor: 'gray',
    height: 43,
    width: 58,
  },
  baseTextColor: {
    color: Colors.background
  },
  coverPhotoText: {
    fontFamily: Fonts.type.montserrat,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    color: Colors.background,
  },
  imageMenuView: {
    flex: 1,
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconButton: {
    backgroundColor: Colors.clear
  },
  coverPhoto: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
  },
  coverVideo: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    backgroundColor: 'black'
  },
})

export default coverMediaStyles
