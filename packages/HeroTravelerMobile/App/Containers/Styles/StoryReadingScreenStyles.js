import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics, Fonts } from '../../Shared/Themes/'

export const styles = StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    flex: 1,
    backgroundColor: Colors.snow,
    marginTop: Metrics.navBarHeight - 15,
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderColor: Colors.dividerGrey,
  },
  darkRoot: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  divider: {
    borderWidth: 0.5,
    borderStyle: 'solid',
    borderColor: Colors.dividerGrey,
    marginBottom: 25,
    marginHorizontal: 15,
  },
  content: {
    flex: 1,
    marginBottom: Metrics.tabBarHeight,
  },
  locationWrapper: {
    marginTop: Metrics.section,
    marginBottom: 100,
  },
  locationText: {
    fontFamily: Fonts.type.sourceSansPro,
    fontWeight: '600',
    letterSpacing: 0.7,
    fontSize: 16,
    color: Colors.grey,
  },
  locationDetails: {
    fontSize: 13,
    fontWeight: '400',
  },
  locationLabel: {
    color: Colors.background,
  },
  locationIconWrapper: {
    marginRight: Metrics.section,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  locationIcon: {
    width: 16.5,
    height: 26.5,
  },
  locationMap: {
    flex: 1,
    height: 200,
    marginBottom: 70,
  },
  plusButton: {
    height: 44,
    width: 44,
    borderRadius: 22,
    backgroundColor: Colors.redHighlights,
    position: 'absolute',
    bottom: Metrics.tabBarHeight + 10,
    right: 10,
    shadowColor: 'black',
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 2,
      width: 0,
    },
  },
  plusButtonIcon: {
    height: '50%',
    width: '50%',
  },
  plusButtonTouchable: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  addToGuideTooltip: {
    position: 'absolute',
    bottom: Metrics.tabBarHeight + 75,
    right: 14,
    backgroundColor: Colors.backgroundOpaque,
    borderRadius: 5,
    paddingHorizontal: 30,
    paddingVertical: 8,
  },
  addToGuideTooltipArrow: {
    position: 'absolute',
    bottom: -30,
    right: 10,
    height: 30,
    borderTopWidth: 14,
    borderTopColor: Colors.backgroundOpaque,
    borderLeftWidth: 8,
    borderLeftColor: 'transparent',
    borderRightWidth: 8,
    borderRightColor: 'transparent',
  },
  addToGuideTooltipText: {
    color: Colors.white,
    fontFamily: Fonts.type.sourceSansPro,
    letterSpacing: 0.7,
    fontSize: 16,
    fontWeight: "600",
  },
  toolBar: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  // StoryContent component
  storyContentWrapper: {
    backgroundColor: Colors.snow,
    paddingBottom: Metrics.tabBarHeight + Metrics.section,
  },
  storyContentImage: {
    marginBottom: Metrics.section,
  },
  videoWrapper: {
    position: 'relative',
    width: Metrics.screenWidth,
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  videoExpand: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    zIndex: 2,
  },
  videoDescription: {
    flex: 1,
    marginHorizontal: Metrics.section,
    marginVertical: Metrics.doubleSection,
  },
  videoDescriptionText: {
    fontWeight: '300',
    fontSize: 18,
    fontFamily: Fonts.type.base,
    color: Colors.grey,
  },
  videoToggleWrapper: {
    position: 'absolute',
  },
  videoToggleView: {
    width: Metrics.screenWidth,
  },
  caption: {
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '300',
    letterSpacing: 0.7,
    fontSize: 15,
    fontFamily: Fonts.type.base,
    color: Colors.grey,
  },
  mediaViewWrapper: {
    flex: 1,
    marginVertical: 25,
  },
  tagLabel: {
    fontWeight: '800',
    fontSize: 15,
    color: Colors.background,
    fontFamily: Fonts.type.base,
    letterSpacing: 0.7,
    height: 19,
    lineHeight: 17,
  },
  tag: {
    fontWeight: '300',
    fontSize: 15,
    color: Colors.redHighlights,
    fontFamily: Fonts.type.base,
    letterSpacing: 0.7,
    height: 19,
    lineHeight: 17,
  },
  marginedRow: {
    marginHorizontal: Metrics.section,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagRow: {
    marginTop: 0,
    marginBottom: 20,
  },
})

export const rendererStyles = StyleSheet.flatten({
  unstyled: {
    fontSize: 18,
    fontWeight: '400',
    fontFamily: Fonts.type.base,
    color: Colors.grey,
    letterSpacing: 0.7,
    paddingHorizontal: 15,
    marginBottom: Metrics.section,
  },
  'header-one': {
    fontSize: Fonts.size.h5,
    fontWeight: '600',
    fontFamily: Fonts.type.base,
    color: Colors.background,
    letterSpacing: 0.7,
    paddingHorizontal: 15,
    marginTop: Metrics.baseMargin,
    marginBottom: 0,
  },
})
