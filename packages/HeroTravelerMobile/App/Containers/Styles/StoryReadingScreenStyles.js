import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics, Fonts } from '../../Themes/'

export const styles = StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    flex: 1,
    backgroundColor: Colors.snow,
  },
  scrollView: {
    flex: 1
  },
  content: {
    paddingTop: Metrics.section,
    paddingBottom: Metrics.tabBarHeight,
  },
  locationWrapper: {
    marginVertical: Metrics.section
  },
  locationText: {
    fontSize: 14,
    // letterSpacing: .35,
    // marginTop: Metrics.baseMargin,
    color: '#757575'
  },
  locationLabel: {
    fontSize: 14,
    // letterSpacing: .35,
    color: Colors.background
  },
  locationIcon: {
    marginRight: Metrics.section,
    alignItems: 'center',
    justifyContent: 'center'
  },
  locationMap: {
    flex: 1,
    height: 200,
    marginBottom: 100
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
    marginTop: 30,
    position: 'relative',
    width: Metrics.screenWidth,
    height: Metrics.screenWidth * 9 / 16,
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: Metrics.screenWidth,
    height: Metrics.screenWidth * 9 / 16,
  },
  videoExpand: {
    position: 'absolute',
    bottom: 10,
    right: 10
  },
  videoDescription: {
    flex: 1,
    marginHorizontal: Metrics.section,
    marginVertical: Metrics.doubleSection,
  },
  videoDescriptionText: {
    color: '#757575'
  },
  caption: {
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '300',
    letterSpacing: .7,
    fontSize: 15,
    fontFamily: Fonts.type.base,
    color: Colors.grey,
    paddingTop: 15,
  },
  mediaViewWrapper: {
    flex: 1,
    marginVertical: 60
  }
})



export const rendererStyles = StyleSheet.flatten({
  unstyled: {
    fontSize: 18,
    fontWeight: '300',
    fontFamily: Fonts.type.base,
    color: Colors.grey,
    letterSpacing: .7,
    paddingHorizontal: 25,
  },
  'header-one': {
    fontSize: Fonts.size.h5,
    fontWeight: '400',
    fontFamily: Fonts.type.base,
    color: Colors.background,
    letterSpacing: .7,
    paddingHorizontal: 25,
  },
});
