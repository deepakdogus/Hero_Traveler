import { StyleSheet } from 'react-native'
import { Metrics, Colors, Fonts } from '../../Shared/Themes/'

export default StyleSheet.create({
  grid: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 0,
    marginRight: 0,
  },
  gridRow: {
    width: (Metrics.screenWidth) / 3 - 4,
    height: (Metrics.screenWidth) / 3 - 4,
    margin: 2,
    backgroundColor: Colors.transparent
  },
  gridImage: {
    width: (Metrics.screenWidth) / 3 - 4,
    height: (Metrics.screenWidth) / 3 - 4,
  },
  gridRowText: {
    fontFamily: Fonts.type.montserrat,
    fontSize: 13,
    color: Colors.snow,
    backgroundColor: 'rgba(0,0,0,.4)',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    textAlign: 'center',
    lineHeight: (Metrics.screenWidth) / 3 - 4,
  },
  selectedIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
  }
})
