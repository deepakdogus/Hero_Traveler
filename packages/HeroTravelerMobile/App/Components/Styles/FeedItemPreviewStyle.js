import { StyleSheet } from 'react-native'
import { Colors, Metrics, ApplicationStyles, Fonts } from '../../Shared/Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.feedDividerGrey,
  },
  cardView: {
    width: `${Metrics.feedMargin}%`,
    alignSelf: 'center',
    marginTop: 20,
  },
  caption: {},
  title: {
    letterSpacing: 0,
    fontSize: 20,
    lineHeight: 23,
    fontFamily: Fonts.type.montserrat,
    fontWeight: '600',
    color: Colors.background,
    marginBottom: 15,
  },
  titleWithDescription: {
    marginBottom: 10,
  },
  storyReadingTitle: {
    fontSize: 30,
    lineHeight: 33,
    marginTop: 15,
    marginBottom: 15,
  },
  storyReadingTitleWithDescription: {
    marginBottom: 15,
  },
  userContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftUserContent: {
    flexDirection: 'row',
  },
  verticalCenter: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  activityRow: {
    paddingTop: 5,
    alignItems: 'flex-end',
  },
  activityIconContainer: {
    paddingLeft: 10,
    borderLeftColor: Colors.feedDividerGrey,
    borderLeftWidth: 1,
  },
  activityIcon: {
    height: 30,
    width: 30,
  },
  avatar: {
    marginRight: Metrics.baseMargin,
  },
  username: {
    color: Colors.redHighlights,
    fontWeight: '400',
    fontSize: 11,
    letterSpacing: 0.7,
    fontFamily: Fonts.type.sourceSansPro,
  },
  usernameReading: {
    fontSize: 13,
  },
  previewUserContainer: {
    minHeight: 45,
  },
  userContainer: {
    paddingVertical: 10,
  },
  storyInfoContainer: {
    paddingHorizontal: 15,
    backgroundColor: Colors.snow,
  },
  bottomContainer: {
    paddingVertical: 15,
  },
  roundedBottomContainer: {
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    marginTop: -20,
  },
  dateText: {
    fontSize: 12,
    letterSpacing: 0.5,
    color: Colors.grey,
    marginRight: 5,
    fontFamily: Fonts.type.sourceSansPro,
  },
  dateTextReading: {
    fontSize: 12,
  },
  locationText: {
    fontFamily: Fonts.type.sourceSansPro,
    fontWeight: '600',
    letterSpacing: 0.7,
    fontSize: 12,
    lineHeight: 25,
    color: Colors.background,
    maxWidth: Metrics.screenWidth - 2 * 15 - 42, // metrics of other elements in location text area
  },
  lastRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftRow: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  rightRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  bookmarkContainer: {
    marginRight: 10,
    justifyContent: 'center',
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
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeImage: {
    width: 18,
    height: 18,
  },
  badgeView: {
    marginRight: 5,
    position: 'absolute',
    bottom: '1%',
    left: '45%',
  },
})
