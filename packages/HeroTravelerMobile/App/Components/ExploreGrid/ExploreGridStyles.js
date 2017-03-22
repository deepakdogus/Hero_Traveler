import { StyleSheet } from 'react-native'
import { Metrics, Colors, Fonts } from '../../Themes/'

export default StyleSheet.create({
  grid: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: Metrics.baseMargin,
    marginRight: Metrics.baseMargin,
  },
  gridRow: {
    width: (Metrics.screenWidth - 33) / 3,
    height: 100,
    margin: 2,
    backgroundColor: Colors.transparent
  },
  gridImage: {
    width: (Metrics.screenWidth - 33) / 3,
    height: 100,
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
    lineHeight: 100
  },
  selectedIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  }
})
