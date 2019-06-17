import { StyleSheet } from 'react-native'
import { Colors, Metrics } from '../../Shared/Themes/'

const visibleButtonHeight = 60
const marginBottom = 0

export default StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,.4)',
    flex: 1,
    alignItems: 'center',
    zIndex: 100,
  },
  button: {
    height: visibleButtonHeight,
    width: Metrics.screenWidth,
    marginBottom,
    backgroundColor: 'white',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconImage: {
    height: 25,
    width: 25,
    marginRight: 20,
  },
  text: {
    width: 120,
    textAlign: 'left',
    color: Colors.background,
    fontWeight: '600',
    fontSize: 16,
  },
})
