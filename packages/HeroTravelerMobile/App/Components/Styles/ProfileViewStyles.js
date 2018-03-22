import { Dimensions, StyleSheet } from 'react-native'
import { ApplicationStyles, Fonts, Colors, Metrics } from '../../Shared/Themes/'

const avatarImageSize = 95
const coverInnerHeight = 370
const profileEditHeight = 150
const tabNavEditHeight = 50
const tabWidth = Dimensions.get('window').width * 0.3

export const storyPreviewHeight =
  Metrics.screenHeight -
  coverInnerHeight -
  tabNavEditHeight -
  Metrics.tabBarHeight
export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    backgroundColor: Colors.clear,
  },
  profileTabsAndStoriesHeight: {
    height: Metrics.screenHeight,
  },
  profileTabsAndStoriesRoot: {
    marginTop: 20,
  },
  profileTabsAndStoriesRootWithMarginForNavbar: {
    marginTop: Metrics.navBarHeight - 15,
  },
  gradientWrapper: {
    flex: 1,
    backgroundColor: Colors.clear,
  },
  topRightContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: Metrics.baseMargin,
    marginBottom: 5,
  },
  editButton: {
    marginRight: 15,
  },
  avatarWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  cogImageIcon: {
    height: 23,
    width: 23,
    tintColor: Colors.signupGrey,
  },
  pencilImageIcon: {
    height: 22,
    width: 22,
    tintColor: Colors.signupGrey,
  },
  readingViewTop: {
    height: 20,
  },
  userInfoMargin: {
    marginLeft: Metrics.baseMargin,
  },
  userInfoWrapper: {
    marginLeft: 5,
    flexDirection: 'column',
    marginBottom: 5,
  },
  italicText: {
    fontFamily: Fonts.type.sourceSansPro,
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: 0.7,
    fontStyle: 'italic',
    color: Colors.redHighlights,
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
  titleText: {
    fontFamily: Fonts.type.montserrat,
    fontSize: 20,
    fontWeight: '600',
    color: Colors.background,
  },
  aboutTitle: {
    fontFamily: Fonts.type.montserrat,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.background,
    marginTop: 10,
  },
  aboutText: {
    fontFamily: Fonts.type.sourceSansPro,
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: 0.7,
    color: Colors.grey,
    maxWidth: Metrics.screenWidth - 2 * Metrics.section - 15 - avatarImageSize,
    marginVertical: 7.5,
  },
  aboutTextEdit: {
    height: 55,
    marginVertical: 0,
  },
  editTitleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editTitle: {
    width:
      Metrics.screenWidth - avatarImageSize - 2 * Metrics.section - 10 - 5 - 14,
    textAlign: 'left',
  },
  editPencilImage: {
    tintColor: 'grey',
  },
  editPencilView: {
    paddingVertical: 3,
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
    letterSpacing: 0.7,
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
  addAvatarPhotoButton: {
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    top: 31,
    left: 30,
  },
  tabStyles: {
    width: tabWidth,
  },
  storyTitleStyle: {
    fontSize: 18,
    letterSpacing: 0,
  },
  subtitleStyle: {
    fontSize: 13,
    letterSpacing: 0.7,
    fontWeight: '300',
  },
  editBio: {
    fontWeight: '600',
    fontSize: 16,
    marginVertical: Metrics.baseMargin,
  },
  readBioText: {
    fontFamily: Fonts.type.montserrat,
    fontWeight: '600',
    fontSize: 11,
    color: Colors.redHighlights,
  },
  bioText: {
    fontFamily: Fonts.type.sourceSansPro,
    letterSpacing: 0.7,
    fontSize: 16,
    color: Colors.bioGrey,
    fontWeight: '400',
  },
  spinnerWrapper: {
    marginTop: Metrics.doubleSection,
  },
  noStories: {
    marginTop: Metrics.doubleSection,
  },
  noStoriesText: {
    textAlign: 'center',
  },
  errorText: {
    color: '#757575',
    textAlign: 'center',
    fontFamily: Fonts.type.montserrat,
    marginBottom: 10,
  },
  errorButton: {
    position: 'absolute',
    top: 125,
    left: 0,
    right: 0,
    marginVertical: Metrics.baseMargin,
    marginHorizontal: Metrics.section,
    zIndex: 100,
  },
  profileInfoContainer: {},
  profileEditInfoContainer: {
    height: profileEditHeight,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  profileWrapper: {
    flexDirection: 'row',
    marginHorizontal: 20,
  },
  secondRow: {
    justifyContent: 'space-between',
    marginBottom: 12.5,
    marginTop: 12.5,
  },
  editBioText: {
    minHeight: profileEditHeight,
  },
  bioWrapper: {
    borderTopColor: Colors.lightGrey,
    borderTopWidth: 1,
    padding: Metrics.section,
    backgroundColor: Colors.feedDividerGrey,
    minHeight: Metrics.screenHeight - Metrics.navBarHeight - profileEditHeight,
  },
  badgeRow: {
    alignItems: 'center',
    marginTop: 5,
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
  storyList: {
    height: Metrics.screenHeight - Metrics.tabBarHeight,
  },
})
