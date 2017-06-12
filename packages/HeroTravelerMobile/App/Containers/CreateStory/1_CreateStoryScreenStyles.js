import { StyleSheet } from 'react-native'
import { ApplicationStyles, Fonts, Colors, Metrics } from '../../Themes/'

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
    color: Colors.snow
  },
  buttonText: {
    ...Fonts.style.buttonText,
    marginTop: Metrics.baseMargin,
    textAlign: 'center'
  },
  logoImage: {
    width: 250,
    height: 50,
    marginTop: Metrics.section,
    marginBottom: Metrics.section,
  },
  storyImage: {
    height: 200,
  },
  buttonGroup: {
    marginTop: Metrics.baseMargin,
    marginBottom: Metrics.section * 2,
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  button: {
    marginTop: Metrics.baseMargin,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fakeTabbar: {
    height: 50,
    position: 'absolute',
    bottom: 0,
    backgroundColor: Colors.background
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
  }
})
