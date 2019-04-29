import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from '../../Shared/Themes'

export const feedItemWidth = (Metrics.screenWidth - 2 * Metrics.section - Metrics.section) / 2
export const feedItemHeight = feedItemWidth / 1.375 // aspect ratio = 1.375:1

export default StyleSheet.create({
  feedItemView: {
    width: feedItemWidth,
    marginBottom: Metrics.baseMargin,
  },
  image: {
    height: feedItemHeight,
    width: feedItemWidth,
    borderRadius: 3,
    zIndex: 0,
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
    fontSize: 15,
    letterSpacing: .7,
    fontWeight: '600',
  },
  author: {
    fontFamily: Fonts.type.montserrat,
    color: Colors.redHighlights,
    fontSize: 13,
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
  // guideIconView: {
  //   marginTop: 2,
  //   width: 15,
  //   alignSelf: 'flex-start',
  // },
  guideIconImage: {
    height: 24,
    width: 24,
    zIndex: 1,
    bottom: 50,
    left: '35%',
  },
})
