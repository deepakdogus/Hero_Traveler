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
    flex: 1
  },
  divider: {
    borderWidth: .5,
    borderStyle: 'solid',
    borderColor: Colors.dividerGrey,
    marginBottom: 25,
    marginHorizontal: 15,
  },
  content: {
    flex: 1,
    marginBottom: Metrics.tabBarHeight
  },
  locationWrapper: {
    marginVertical: Metrics.section,
  },
  locationDetails: {
    fontSize: 13,
    fontWeight: '400'
  },
  locationMap: {
    flex: 1,
    height: 200,
    marginBottom: 70,
  },
  toolBar: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  // StoryContent component
  storyContentWrapper: {
    backgroundColor: Colors.snow,
    paddingBottom: Metrics.tabBarHeight + Metrics.section
  },
  storyContentImage: {
    marginBottom: Metrics.section
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
    letterSpacing: .7,
    fontSize: 15,
    fontFamily: Fonts.type.base,
    color: Colors.grey,
  },
  mediaPlaceholder: {
    backgroundColor: Colors.lightGreyAreas
  },
  mediaViewWrapper: {
    flex: 1,
    marginVertical: 25
  },
  tagLabel: {
    fontWeight: '800',
    fontSize: 15,
    color: Colors.background,
    fontFamily: Fonts.type.base,
    letterSpacing: .7,
    height: 19,
    lineHeight: 17,
  },
  tag: {
    fontWeight: '300',
    fontSize: 15,
    color: Colors.redHighlights,
    fontFamily: Fonts.type.base,
    letterSpacing: .7,
    height: 19,
    lineHeight: 17,
  },
  costLabel: {
    fontWeight: '800',
    fontSize: 15,
    color: Colors.background,
    fontFamily: Fonts.type.base,
    letterSpacing: .7,
    height: 19,
    lineHeight: 17,
  },
  cost: {
    fontWeight: '300',
    fontSize: 15,
    color: Colors.background,
    fontFamily: Fonts.type.base,
    letterSpacing: .7,
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

  sectionWrapper: {
    marginHorizontal: Metrics.section,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 0,
    marginBottom: 20,
  },
  sectionLabel: {
    width: "100%",
    fontFamily: Fonts.type.sourceSansPro,
    letterSpacing: .7,
    fontWeight: '600',
    color: Colors.background,
    flexWrap: 'nowrap',
  },
  sectionTextWrapper: {
    flex: 1,
  },
  sectionText: {
    fontFamily: Fonts.type.sourceSansPro,
    fontWeight: '400',
    letterSpacing: .7,
    fontSize: 15,
    color: Colors.grey,
  },
  sectionTextHighlight: {
    color: Colors.redHighlights
  },
  iconWrapper: {
    flexShrink: 1,
    marginRight: Metrics.section,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain"
  },
  
})



export const rendererStyles = StyleSheet.flatten({
  unstyled: {
    fontSize: 18,
    fontWeight: '400',
    fontFamily: Fonts.type.base,
    color: Colors.grey,
    letterSpacing: .7,
    paddingHorizontal: 15,
    marginBottom: Metrics.section
  },
  'header-one': {
    fontSize: Fonts.size.h5,
    fontWeight: '600',
    fontFamily: Fonts.type.base,
    color: Colors.background,
    letterSpacing: .7,
    paddingHorizontal: 15,
    marginTop: Metrics.baseMargin,
    marginBottom: 0,
  },
});
