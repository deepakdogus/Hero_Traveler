import { StyleSheet } from 'react-native'
import { Colors, Metrics, ApplicationStyles, Fonts } from '../../Shared/Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  contentContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  title: {
    letterSpacing: 1.5,
    fontSize: 20,
    lineHeight: 23,
    fontFamily: Fonts.montserrat,
    fontWeight: '600',
    color: Colors.backgrond,
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
  userContainer: {
    height: 70,
  },
  storyInfoContainer: {
    paddingHorizontal: Metrics.section,
    backgroundColor: Colors.snow,
  },
  bottomContainer: {
    paddingVertical: 10,
  },
  dateText: {
    fontSize: 12,
    letterSpacing: .5,
    color: Colors.grey,
    marginRight: 5,
    fontFamily: Fonts.type.crimsonText,
    fontStyle: 'italic',
  },
  rightRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  bookmarkContainer: {
    marginRight: 10,
  },
  bookmark: {
    width: 12,
    height: 16,
  }
})
