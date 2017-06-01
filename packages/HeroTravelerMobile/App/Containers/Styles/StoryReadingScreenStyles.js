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
  storyContentText: {
    fontSize: 18,
    letterSpacing: .35,
    marginHorizontal: Metrics.section,
    marginBottom: Metrics.section
  },
  storyContentImage: {
    marginBottom: Metrics.section
  },
})

export const HTMLViewStyles = StyleSheet.create({
  body: {
    width: Metrics.screenWidth,
  },
  img: {
    width: '100px',
    maxHeight: '100px'
  },
  h1: {
    fontSize: Fonts.size.h5,
    color: Colors.background
  },
  div: {
    fontSize: Fonts.size.h6,
    color: Colors.grey,
  },
})
