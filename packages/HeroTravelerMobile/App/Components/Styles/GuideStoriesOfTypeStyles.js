import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from '../../Shared/Themes/'

// Don't forget to update ProfileTabAndStories.getHeaderHeight() if
// related styles change. (username, about, badge, error, etc.)

export const storyWidth = (Metrics.screenWidth - 2 * Metrics.section - Metrics.section) / 2
const storyHeight = storyWidth / 16 * 9

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    marginHorizontal: Metrics.section,
    marginBottom: Metrics.section,
  },
  wrapperShowAll: {
    marginTop: Metrics.section,
  },
  label: {
    fontFamily: Fonts.type.montserrat,
    color: Colors.background,
    fontSize: 18,
    letterSpacing: .7,
    fontWeight: '600',
    marginBottom: Metrics.baseMargin,
  },
  seeAllView: {
    borderWidth: 1,
    borderColor: Colors.redHighlights,
    borderRadius: 2,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Metrics.baseMargin,
  },
  seeAll: {
    fontFamily: Fonts.type.montserrat,
    color: Colors.redHighlights,
    fontSize: 13,
    letterSpacing: .7,
    textAlign: 'center',
    fontWeight: '600',
  },
  storiesWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  storyView: {
    width: storyWidth,
    marginBottom: Metrics.baseMargin,
  },
  title: {
    fontFamily: Fonts.type.montserrat,
    color: Colors.background,
    fontSize: 13,
    letterSpacing: .7,
    fontWeight: '600',
    marginTop: Metrics.baseMargin,
    marginBottom: Metrics.baseMargin * .5,
  },
  author: {
    fontFamily: Fonts.type.montserrat,
    color: Colors.redHighlights,
    fontSize: 10,
    letterSpacing: .7,
  },
  image: {
    height: storyHeight,
    width: storyWidth,
  },
  playButtonAbsolute: {
    position: 'absolute',
    width: '100%',
    height: storyHeight,
  },
  playButtonCenter: {
    height: storyHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
