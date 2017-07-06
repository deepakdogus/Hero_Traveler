import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics, Fonts } from '../../Shared/Themes/'

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
  videoDescription: {
    flex: 1,
    marginHorizontal: Metrics.section,
    marginVertical: Metrics.doubleSection,
  },
  videoDescriptionText: {
    color: '#757575'
  }
})

export const HTMLViewStyles = StyleSheet.create({
  img: {
    width: Metrics.screenWidth,
    height: Metrics.screenHeight,
    marginTop: 60,
  },
  videoButton: {
    marginTop: 60,
    position: 'relative',
    width: Metrics.screenWidth,
    height: 200,
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: Metrics.screenWidth,
    height: 200,
  },
  caption: {
    marginBottom: 60,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  header: {
    fontSize: Fonts.size.h5,
    color: Colors.background,
    paddingHorizontal: 25,
    marginBottom: Metrics.baseMargin
  },
  text: {
    fontSize: Fonts.size.h6,
    color: Colors.grey,
    paddingHorizontal: 25
  },
})
