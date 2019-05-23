import { StyleSheet } from 'react-native'
import { Metrics, Colors, Fonts } from '../../Shared/Themes/'

export const measurements = Metrics.screenWidth * (Metrics.feedMargin / 100) / 3

export default StyleSheet.create({
  grid: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: `${Metrics.feedMargin}%`,
    alignSelf: 'center',
    marginVertical: (Metrics.screenWidth - Metrics.screenWidth * (Metrics.feedMargin / 100)) / 2,
  },
  gridItem: {
    width: measurements - 16, // 16 = l/r margin
    height: measurements - 16 + 5 + 30, // to achieve 100 x 105 images + 30 height
    margin: 8,
    backgroundColor: Colors.transparent,
  },
  gridItemText: {
    fontFamily: Fonts.type.montserrat,
    fontSize: 13,
    fontWeight: '500',
    color: Colors.background,
    textAlign: 'center',
    lineHeight: 20,
    paddingBottom: 10,
  },
  gridImageForCategories: {
    width: measurements - 16,
    height: measurements - 16 + 5,
  },
  gridImageForChannels: {
    width: measurements - 16,
    height: measurements - 16 + 25,
  },
  selectedIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
})
