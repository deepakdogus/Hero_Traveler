import { StyleSheet } from 'react-native'
import Metrics from '../../Themes/Metrics'
import Colors from '../../Shared/Themes/Colors'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6AE2D',
  },
  imagePreview: {
    backgroundColor: '#efefef',
    position: 'relative',
    height: 345,
    width: Metrics.screenWidth,
  },
  text: {
    fontSize: 16,
    alignItems: 'center',
    color: '#fff',
  },
  bold: {
    fontWeight: 'bold',
  },
  info: {
    fontSize: 12,
  },
  circle: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#efefef',
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
    borderColor: 'white',
    borderWidth: 3,
    opacity: 0.7,
  },
  addPhotoButton: {
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: 345,
    width: Metrics.screenWidth,
  },
  parallaxStyles: {
    flex: 1,
    backgroundColor: 'hotpink',
    overflow: 'hidden',
  },
  badge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: Colors.red,
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
    opacity: 0.5,
  },
  badgeText: {
    color: 'white',
    alignSelf: 'center',
    flex: 1,
  },
  horizontalGrid: {
    width: Metrics.screenWidth,
    height: 115,
    position: 'absolute',
    top: 115,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.5)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.5)',
  },
  verticalGrid: {
    width: Metrics.screenWidth / 3,
    height: 345,
    position: 'absolute',
    left: Metrics.screenWidth / 3,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.5)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.5)',
  },
})
