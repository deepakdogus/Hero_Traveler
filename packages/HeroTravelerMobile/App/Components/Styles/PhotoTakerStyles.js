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
  cameraControl: {
    backgroundColor: Colors.clear
  },
  flipCamera: {
    marginTop: Metrics.doubleBaseMargin
  },
  flash: {
    marginLeft: Metrics.baseMargin
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
