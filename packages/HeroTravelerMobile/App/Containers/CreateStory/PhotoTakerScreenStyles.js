import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes/'

export default StyleSheet.create({
  containerWithNavbarAndTabbar: {
    ...ApplicationStyles.screen.containerWithNavbarAndTabbar
  },
  camera: {
    flex: 1
  },
  cameraControls: {
    marginTop: 50,
    marginLeft: 25
  },
  cameraShutterButton: {
    alignItems: 'center',
    marginBottom: 40
  }
})
