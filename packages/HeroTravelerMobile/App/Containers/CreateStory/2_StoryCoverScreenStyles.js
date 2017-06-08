import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics, Fonts } from '../../Themes/'

const third = (1 / 3) * (Metrics.screenHeight - Metrics.navBarHeight * 2)

export const placeholderColor = Colors.background

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.lightGreyAreas,
  },
  containerWithNavbar: {
    ...ApplicationStyles.screen.containerWithNavbar
  },
  lightGreyAreasBG: {
    backgroundColor: Colors.transparent,
  },
  errorButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    marginVertical: Metrics.baseMargin,
    marginHorizontal: Metrics.section,
    zIndex: 100,
  },
  spaceView: {
    height: third
  },
  keyboardMargin: {
    marginBottom: 50,
  },
  loading: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    fontFamily: Fonts.type.montserrat
  },
  titleInput: {
    ...Fonts.style.title,
    color: Colors.snow,
    marginTop: 20,
    marginLeft: 20,
    height: 34,
    fontSize: 28,
  },
  subTitleInput: {
    color: Colors.snow,
    height: 28,
    fontSize: 14,
    marginLeft: 20
  },
  cameraIcon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Metrics.baseMargin,
  },
  cameraIconImage: {
    tintColor: 'gray',
    height: 32,
    width: 40,
  },
  videoIconImage: {
    tintColor: 'gray',
    height: 31,
    width: 51,
  },
  colorOverLay: {
    backgroundColor: Colors.windowTint,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  addPhotoView: {
    height: third,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  addTitleView: {
    height: third,
    justifyContent: 'center'
  },
  imageMenuView: {
    height: third,
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center'
  },
  addPhotoButton: {
    padding: 50,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  baseTextColor: {
    color: Colors.background
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
  },
  coverPhotoText: {
    fontFamily: Fonts.type.montserrat,
    fontSize: 13,
  },
  iconButton: {
    backgroundColor: Colors.clear
  }
})
