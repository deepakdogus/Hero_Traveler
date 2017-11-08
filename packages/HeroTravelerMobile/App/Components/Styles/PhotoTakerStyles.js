import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics, Fonts } from '../../Shared/Themes/'

export default StyleSheet.create({
  containerWithNavbarAndTabbar: {
    ...ApplicationStyles.screen.containerWithNavbarAndTabbar,
    backgroundColor: Colors.background,
  },
  camera: {
    flex: 1
  },
  leftCameraControls: {
    marginTop: Metrics.section,
    marginLeft: Metrics.section,
  },
  rightCameraControls: {
    position: 'absolute',
    top: Metrics.section + Metrics.doubleBaseMargin,
    right: Metrics.section,
  },
  cameraControl: {
    backgroundColor: Colors.clear
  },
  flipCamera: {
    marginTop: Metrics.doubleBaseMargin
  },
  flash: {
    marginLeft: Metrics.baseMargin
  },
  cameraWhite: {
    width: 32,
    height: 24,
    marginRight: .5,
  },
  videoWhite: {
    width: 33,
    height: 20,
    marginTop: 2,
  },
  cameraShutterButton: {
    alignItems: 'center',
    marginBottom: 40 + Metrics.section,
    backgroundColor: Colors.clear,
  },
  videoProgressWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  videoProgressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.red
  },
  videoProgressTextWrapper: {
    marginTop: Metrics.baseMargin,
    backgroundColor: Colors.clear
  },
  videoProgressText: {
    fontFamily: Fonts.type.montserrat,
    fontSize: 16,
    color: Colors.snow,
    textAlign: 'center'
  }
})
