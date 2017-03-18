import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics } from '../../Themes/'

const third = (1 / 3) * (Metrics.screenHeight - Metrics.navBarHeight)

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  spaceView: {
    height: third
  },
  addPhotoView: {
    height: third,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  addPhotoButton: {
    padding: 50,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  addPhotoText: {
    margin: 20,
    flex: 1
  },
  addTitleView: {
    height: third
  },
  titleInput: {
    marginTop: 20,
    marginLeft: 20,
    height: 28,
    fontSize: 28
  },
  subTitleInput: {
    height: 28,
    fontSize: 14,
    marginLeft: 20
  },
  containerWithNavbarOverride: {
    backgroundColor: Colors.lightGreyAreas
  },
  photoOverlay: {
    backgroundColor: Colors.photoOverlay,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 100,
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    opacity: 0.4
  },
  baseTextColor: {
    color: Colors.darkBackground
  }
})

export const placeholderColor = Colors.darkBackground
