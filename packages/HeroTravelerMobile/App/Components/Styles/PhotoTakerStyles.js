import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
  containerWithNavbarAndTabbar: {
    ...ApplicationStyles.screen.containerWithNavbarAndTabbar,
    backgroundColor: Colors.background,
  },
  camera: {
    flex: 1
  },
  cameraControls: {
    marginTop: Metrics.section,
    marginLeft: Metrics.section
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
})
