import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from '../../Shared/Themes'

export const feedItemWidth = (Metrics.screenWidth - 2 * Metrics.section - Metrics.section) / 2
export const feedItemHeight = feedItemWidth / 16 * 9

export default StyleSheet.create({
  feedItemView: {
    width: feedItemWidth,
    marginBottom: Metrics.baseMargin,
  },
  image: {
    height: feedItemHeight,
    width: feedItemWidth,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Metrics.baseMargin,
    marginBottom: Metrics.baseMargin * .5,
  },
  title: {
    fontFamily: Fonts.type.montserrat,
    color: Colors.background,
    fontSize: 13,
    letterSpacing: .7,
    fontWeight: '600',
  },
  author: {
    fontFamily: Fonts.type.montserrat,
    color: Colors.redHighlights,
    fontSize: 10,
    letterSpacing: .7,
  },
  playButtonAbsolute: {
    position: 'absolute',
    width: '100%',
    height: feedItemHeight,
  },
  playButtonCenter: {
    height: feedItemHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideIcon: {
    marginTop: 1,
    width: 15,
  },
  guideIconImage: {
    height: 12,
    width: 12,
  },
})
