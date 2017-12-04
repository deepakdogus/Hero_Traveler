import { StyleSheet } from 'react-native'
import { ApplicationStyles, Fonts, Colors, Metrics } from '../../Shared/Themes/'

const avatarImageSize = 95
const coverInnerHeight = 370
const tabNavEditHeight = 50
const profileEditHeight = 150

export const storyPreviewHeight = Metrics.screenHeight - coverInnerHeight - tabNavEditHeight - Metrics.tabBarHeight

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    backgroundColor: Colors.clear
  },
  gradientWrapper: {
    backgroundColor: Colors.clear
  },
  topRightContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: Metrics.baseMargin,
  },
  editButton: {
    marginRight: 15,
  },
  cogImageIcon: {
    height: 23,
    width: 23,
    tintColor: Colors.grey,
  },
  readingViewTop: {
    height: 43,
  },
  userInfoMargin: {
    marginLeft: Metrics.baseMargin,
  },
  userInfoWrapper: {
    marginLeft: 5,
    height: 95,
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginBottom: 5,
  },
  italicText: {
    fontFamily: Fonts.type.sourceSansPro,
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: .7,
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
    letterSpacing: .7,
    color: Colors.background,
    maxWidth: Metrics.screenWidth - 2 * Metrics.section - 15 - avatarImageSize,
    marginVertical: 7.5,
  },
  aboutTextEdit: {
    height: 55,
    marginVertical: 0,
  },
  editTitle: {
    width: Metrics.screenWidth - avatarImageSize - 2 * Metrics.section - 10 - 5 - 14,
    textAlign: 'left',
  },
  editPencilImage: {
    tintColor: 'grey'
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
  addAvatarPhotoButton: {
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    top: 31,
    left: 30,
  },
  tabs: {
    flex: 1
  },
  tabnavEdit: {
    height: tabNavEditHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.feedDividerGrey,
  },
  tab: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: .33,
    borderBottomWidth: 3,
    borderBottomColor: Colors.feedDividerGrey,
  },
  tabText: {
    fontFamily: Fonts.type.montserrat,
    color: Colors.navBarText,
    fontSize: 13,
    letterSpacing: 1.2,
    textAlign: 'center',
    fontWeight: '600',
  },
  tabSelected: {
    borderBottomColor: Colors.red
  },
  tabTextSelected: {
    fontFamily: Fonts.type.montserrat,
    color: Colors.background,
    fontSize: 13,
    letterSpacing: 1.2,
  },
  storyTitleStyle: {
    fontSize: 18,
    letterSpacing: 1.5,
  },
  subtitleStyle: {
    fontSize: 13,
    letterSpacing: .7,
    fontWeight: '300'
  },
  editBio: {
    fontWeight: '600',
    fontSize: 16,
    marginVertical: Metrics.baseMargin
  },
  readBioText: {
    fontFamily: Fonts.type.montserrat,
    fontWeight: '600',
    fontSize: 11,
    color: Colors.redHighlights,
  },
  bioText: {
    fontFamily: Fonts.type.sourceSansPro,
    letterSpacing: .7,
    fontSize: 16,
    color: Colors.bioGrey,
    fontWeight: '300',
  },
  spinnerWrapper: {
    marginTop: Metrics.doubleSection
  },
  noStories: {
    marginTop: Metrics.doubleSection,
  },
  noStoriesText: {
    color: '#757575',
    textAlign: 'center',
    fontFamily: Fonts.type.montserrat
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
  profileInfoContainer: {
    paddingTop: Metrics.baseMargin,
    height: 200,
  },
  profileEditInfoContainer: {
    height: profileEditHeight,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  profileWrapper: {
    flexDirection: 'row',
    marginHorizontal: Metrics.section,
  },
  secondRow: {
    justifyContent: 'space-between',
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
  }
})
