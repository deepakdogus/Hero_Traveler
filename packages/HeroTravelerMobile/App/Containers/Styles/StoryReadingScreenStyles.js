import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    flex: 1,
    backgroundColor: Colors.snow,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: Metrics.section,
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
