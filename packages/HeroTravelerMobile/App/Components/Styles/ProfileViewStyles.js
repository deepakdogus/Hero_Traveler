import { StyleSheet } from 'react-native'
import { ApplicationStyles, Fonts, Colors, Metrics } from '../../Shared/Themes/'
import { isIPhoneX } from '../../Themes/Metrics'

const avatarImageSize = 95

// Don't forget to update ProfileTabAndStories.getHeaderHeight() if
// related styles change. (username, about, badge, error, etc.)

export default StyleSheet.create({
  // ProfileView
  errorButton: {
    position: 'absolute',
    top: 125,
    left: 0,
    right: 0,
    marginVertical: Metrics.baseMargin,
    marginHorizontal: Metrics.section,
    zIndex: 100,
  },
  flexOne: {
    flex: 1,
    marginTop: isIPhoneX() ? 15 : 0,
  },
  flexOneReadOnly: {
    flex: 1,
  },
  // ProfileUserInfo
  // top row
  topRightContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: Metrics.baseMargin,
    marginBottom: 5,
  },
  editButton: {
    marginRight: 15,
  },
  pencilImageIcon: {
    height: 22,
    width: 22,
    tintColor: Colors.signupGrey,
  },
  cogImageIcon: {
    height: 23,
    width: 23,
    tintColor: Colors.signupGrey,
  },
  // 1st row
  profileWrapper: {
    flexDirection: 'row',
    marginHorizontal: 20,
  },
  avatarWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  userInfoMargin: {
    marginLeft: Metrics.baseMargin,
  },
  userInfoWrapper: {
    marginLeft: 5,
    flexDirection: 'column',
    marginBottom: 5,
    minHeight: 108,
    backgroundColor: Colors.snow,
  },
  titleText: {
    fontFamily: Fonts.type.montserrat,
    fontSize: 20,
    fontWeight: '600',
    color: Colors.background,
  },
  italicText: {
    fontFamily: Fonts.type.sourceSansPro,
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: .7,
    fontStyle: 'italic',
    color: Colors.redHighlights,
  },
  aboutText: {
    fontFamily: Fonts.type.sourceSansPro,
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: .7,
    color: Colors.grey,
    maxWidth: Metrics.screenWidth - 2 * Metrics.section - 15 - avatarImageSize,
    marginVertical: 7.5,
  },
  // 2nd row
  secondRow: {
    flex: 1,
    margin: 15,
    height: 16,
  },
  secondRowSection: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    height: 16,
  },
  badgeImage: {
    width: 16,
    height: 16,
  },
  badgeText: {
    marginLeft: 5,
    fontFamily: Fonts.type.montserrat,
    fontWeight: '600',
    fontSize: 8,
    color: Colors.background,
    textAlign: 'center',
  },
  readBioSection: {
    justifyContent: 'flex-end',
  },
  readBioText: {
    fontFamily: Fonts.type.sourceSansPro,
    fontWeight: '600',
    fontSize: 13,
    color: Colors.background,
  },
  // 3rd row
  thirdRow: {
    justifyContent: 'space-between',
    marginBottom: 12.5,
    marginTop: 12.5,
  },
  followersWrapper: {
    flexDirection: 'row',
  },
  followingColumn: {
    borderLeftWidth: 1,
    borderLeftColor: Colors.grey,
    paddingLeft: 20,
    marginLeft: 20,
  },
  followerNumber: {
    fontFamily: Fonts.type.montserrat,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.background,
  },
  followerLabel: {
    fontFamily: Fonts.type.montserrat,
    fontSize: 10,
    fontWeight: '600',
    color: Colors.grey,
  },
  blackButton: {
    borderWidth: 1,
    borderColor: Colors.background,
    borderRadius: 20,
    width: 120,
  },
  blackButtonText: {
    fontFamily: Fonts.type.montserrat,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: .7,
    lineHeight: 26,
    textAlign: 'center',
    color: Colors.background,
  },
  followButtonText: {
    color: Colors.redHighlights,
  },
  followButton: {
    borderColor: Colors.redHighlights,
  },
})
