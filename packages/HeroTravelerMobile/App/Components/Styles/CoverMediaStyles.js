import { StyleSheet } from 'react-native'
import { Colors, Metrics, ApplicationStyles, Fonts } from '../../Shared/Themes/'

// TODO: Move this into Metrics?
export const coverHeight = 415

const coverMediaStyles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
  },
  lightGreyAreasBG: {
    flex: 1,
    backgroundColor: Colors.lightGreyAreas,
    maxHeight: coverHeight,
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
  coverHeight: {
    height: coverHeight
  },
  iconButton: {
    backgroundColor: Colors.clear
  },
  imageMenuView: {
    flex: 1,
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center'
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
