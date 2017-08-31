import { StyleSheet } from 'react-native'
import { ApplicationStyles, Fonts, Colors, Metrics } from '../../Shared/Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: Colors.background
  },
  addPhotoText: {
    margin: 20,
    flex: 1
  },
  lightBg: {
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
    color: Colors.background
  },
  lightText: {
    color: Colors.snow,
    paddingTop: 10,
    fontSize: 14,
    letterSpacing: 1.5,
  },
  buttonText: {
    ...Fonts.style.buttonText,
    marginTop: Metrics.baseMargin,
    textAlign: 'center'
  },
  logoImage: {
    width: 250,
    height: 55,
    marginTop: Metrics.section,
    marginBottom: Metrics.section,
  },
  storyImage: {
    height: 200,
  },
  buttonGroup: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  button: {
    paddingTop: Metrics.baseMargin,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    marginTop: 0,
    paddingTop: 0,
    zIndex: 300,
  },
  storyButton: {
    paddingTop: Metrics.doubleBaseMargin + 10,
  },
  videoButton: {
    paddingTop: Metrics.doubleBaseMargin + 10,
    paddingBottom: Metrics.section * 2,
  },
  exitButton: {
    width: Metrics.screenWidth,
    height: Metrics.screenHeight - 300,
  },
  fakeTabbar: {
    height: 50,
    width: '100%',
    position: 'relative',
    bottom: 0,
    zIndex: 100,
    backgroundColor: Colors.photoOverlay,
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  loadingText: {
    color: Colors.white
  },
  wrapper: {
    height: 300,
    backgroundColor: Colors.background,
    position: 'absolute',
    top: -250,
    left:  Metrics.screenWidth * -.8,
    bottom: 0,
    width: Metrics.screenWidth,
  }
})
