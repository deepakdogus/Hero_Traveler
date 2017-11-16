import { StyleSheet } from 'react-native'
import { ApplicationStyles, Fonts, Colors, Metrics } from '../../Shared/Themes/'

const avatarImageSize = 95
const coverInnerHeight = 370
const tabNavEditHeight = 50
export const storyPreviewHeight = Metrics.screenHeight - coverInnerHeight - tabNavEditHeight - Metrics.tabBarHeight

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    backgroundColor: Colors.clear
  },
  gradient: {
    paddingTop: 20,
    flex: 1,
    backgroundColor: Colors.clear
  },
  gradientWrapper: {
    backgroundColor: Colors.clear
  },
  settingsCog: {
    position: 'absolute',
    right: Metrics.doubleBaseMargin,
    top: 10
  },
  coverImage: {
    flexDirection: 'column'
  },
  noCoverImage: {
    backgroundColor: Colors.redLight
  },
  cogContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: Metrics.baseMargin,
  },
  cogImageIcon: {
    height: 23,
    width: 23,
    tintColor: Colors.grey,
  },
  coverInner: {
    paddingTop: Metrics.section,
    height: coverInnerHeight,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  nameWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50
  },
  nameSeparator: {
    marginVertical: Metrics.baseMargin,
    borderBottomWidth: 1,
    borderBottomColor: Colors.snow,
    width: 36,
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
    fontFamily: Fonts.type.crimsonText,
    letterSpacing: .5,
    fontSize: 15,
    color: Colors.snow,
    fontStyle: 'italic'
  },
  newItalicText: {
    fontFamily: Fonts.type.sourceSansPro,
    fontSize: 11,
    fontWeight: '400',
    letterSpacing: .7,
    fontStyle: 'italic',
    color: Colors.grey
  },
  followersWrapper: {
    flexDirection: 'row',
  },
  followersColumn: {
    paddingHorizontal: Metrics.baseMargin
  },
  firstFollowerColumn: {
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,.5)'
  },
  followingColumn: {
    borderLeftWidth: 1,
    borderLeftColor: Colors.grey,
    paddingLeft: 20,
    marginLeft: 20,
  },
  followerNumber: {
    fontFamily: Fonts.type.montserrat,
    color: Colors.snow,
    fontSize: 18,
    letterSpacing: 3,
    textAlign: 'center',
    paddingBottom: Metrics.baseMargin/2
  },
  newFollowerNumber: {
    fontFamily: Fonts.type.montserrat,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.background,
  },
  followerLabel: {
    fontFamily: Fonts.type.montserrat,
    fontSize: 10,
    letterSpacing: 1,
    color: '#e0e0e0',
    textAlign: 'center',
  },
  newFollowerLabel: {
    fontFamily: Fonts.type.montserrat,
    fontSize: 10,
    fontWeight: '600',
    color: Colors.grey,
  },
  avatarImage: {
    width: avatarImageSize,
    height: avatarImageSize,
    borderRadius: avatarImageSize/2
  },
  titleText: {
    ...Fonts.style.title,
    textAlign: 'center',
    fontSize: 21,
    letterSpacing: 3,
    color: Colors.snow,
    width: '100%',
    height: 30
  },
  newTitleText: {
    fontFamily: Fonts.type.montserrat,
    fontSize: 20,
    fontWeight: '600',
    color: Colors.background,
  },
  editTitle: {
    width: '50%',
  },
  inputUnderLine: {
    width: '50%',
    borderTopWidth: 1,
    borderColor: Colors.snow,
  },
  buttons: {
    backgroundColor: 'rgba(0,0,0,.25)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,.6)',
    borderRadius: 20,
    paddingHorizontal: 20,
    height: 32,
    marginBottom: 30,
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
  followButton: {
    width: 110,
    borderColor: Colors.redHighlights,
    backgroundColor: Colors.snow,
    marginBottom: 0,
  },
  unfollowButton: {
    backgroundColor: 'rgba(255,255,255,.4)',
    borderColor: Colors.background,
  },
  messageButton: {
    width: 110,
    marginLeft: Metrics.baseMargin
  },
  buttonsText: {
    fontFamily: Fonts.type.montserrat,
    fontSize: 11,
    color: Colors.snow,
    lineHeight: 28,
    textAlign: 'center'
  },
  followText: {
    fontWeight: '600',
    fontSize: 13,
    color: Colors.redHighlights,
  },
  unfollowText: {
    color: Colors.background
  },
  cameraIcon: {
    textAlign: 'center',
    marginBottom: Metrics.baseMargin
  },
  addCoverPhotoButton: {
    padding: 50,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  addAvatarPhotoButton: {
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    top: 31,
    left: 30,
  },
  contributor: {
    marginLeft: Metrics.baseMargin
  },
  contributorText: {
    color: Colors.white,
    fontSize: 8,
    fontFamily: Fonts.type.montserrat,
    lineHeight: 15
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
    borderBottomColor: Colors.snow,
  },
  tabText: {
    fontFamily: Fonts.type.montserrat,
    color: '#bdbdbd',
    fontSize: 13,
    letterSpacing: 1.2,
    textAlign: 'center'
  },
  tabSelected: {
    borderBottomColor: Colors.red
  },
  tabTextSelected: {
    fontFamily: Fonts.type.montserrat,
    color: '#757575',
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
  editCoverText: {
    color: Colors.snow,
    fontFamily: Fonts.type.montserrat,
    fontSize: 11,
  },
  editBio: {
    fontWeight: '600',
    fontSize: 16,
    marginVertical: Metrics.baseMargin
  },
  bioText: {
    fontFamily: Fonts.type.sourceSansPro,
    letterSpacing: .7,
    fontSize: 16,
    color: Colors.bioGrey,
    fontWeight: '300',
  },
  bioButton: {
    marginTop: 10,
  },
  newBioText: {
    fontFamily: Fonts.type.montserrat,
    fontSize: 11,
    color: Colors.background,
    textAlign: 'center',
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
  newErrorButton: {
    position: 'absolute',
    top: 125,
    left: 0,
    right: 0,
    marginVertical: Metrics.baseMargin,
    marginHorizontal: Metrics.section,
    zIndex: 100,
  },
  profileInfoContainer: {
    marginTop: Metrics.baseMargin,
    height: 200,
  },
  profileWrapper: {
    flexDirection: 'row',
    marginHorizontal: Metrics.section,
  },
})
