import { StyleSheet } from 'react-native'
import { Colors, Metrics, ApplicationStyles, Fonts } from '../../Shared/Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  contentContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  caption: {
    marginTop: 0,
    marginBottom: 15,
  },
  title: {
    letterSpacing: 0,
    fontSize: 20,
    lineHeight: 23,
    fontFamily: Fonts.type.montserrat,
    fontWeight: '600',
    color: Colors.background,
  },
  storyReadingTitle: {
    fontSize: 30,
    lineHeight: 33,
  },
  description: {
    fontFamily: Fonts.type.sourceSansPro,
    fontWeight: '400',
    fontSize: 16,
    letterSpacing: .7,
    color: Colors.grey,
    marginTop: 5,
  },
  userContent: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  leftUserContent: {
    flexDirection: 'row',
  },
  verticalCenter: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  avatar: {
    marginRight: Metrics.baseMargin
  },
  username: {
    color: Colors.redHighlights,
    fontWeight: '400',
    fontSize: 11,
    letterSpacing: .7,
    fontFamily: Fonts.type.sourceSansPro
  },
  usernameReading: {
    fontSize: 13,
  },
  previewUserContainer: {
    minHeight: 60,
  },
  userContainer: {
    paddingVertical: 10,
  },
  storyInfoContainer: {
    paddingHorizontal: 15,
    backgroundColor: Colors.snow,
  },
  bottomContainer: {
    paddingTop: 25,
    paddingBottom: 10,
  },
  dateText: {
    fontSize: 12,
    letterSpacing: .5,
    color: Colors.grey,
    marginRight: 5,
    fontFamily: Fonts.type.crimsonText,
    fontStyle: 'italic',
  },
  dateTextReading: {
    fontSize: 15,
  },
  rightRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15
  },
  bookmarkContainer: {
    marginRight: 10,
  },
  bookmark: {
    width: 14,
    height: 19,
  },
  followFollowingButton: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: 105,
    alignSelf: 'flex-end',
  },
  followFollowingText: {
    width: 80,
    marginHorizontal: 12.5,
    fontSize: 11,
  }
})
