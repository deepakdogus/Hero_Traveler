import { StyleSheet } from 'react-native'
import { ApplicationStyles, Fonts, Colors, Metrics } from '../../Themes/'

const avatarImageSize = 95

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
  coverInner: {
    paddingTop: Metrics.section,
    height: 370,
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
  italicText: {
    fontFamily: Fonts.type.crimsonText,
    letterSpacing: .5,
    fontSize: 15,
    color: Colors.snow,
    fontStyle: 'italic'
  },
  followersWrapper: {
    flexDirection: 'row'
  },
  followersColumn: {
    paddingHorizontal: Metrics.baseMargin
  },
  firstFollowerColumn: {
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,.5)'
  },
  followerNumber: {
    fontFamily: Fonts.type.montserrat,
    color: Colors.snow,
    fontSize: 18,
    letterSpacing: 3,
    textAlign: 'center',
    paddingBottom: Metrics.baseMargin/2
  },
  followerLabel: {
    fontFamily: Fonts.type.montserrat,
    fontSize: 10,
    letterSpacing: 1,
    color: '#e0e0e0',
    textAlign: 'center',
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
    width: '50%',
    height: 30
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
  followButton: {
    width: 110,
    marginRight: Metrics.baseMargin
  },
  isFollowed: {
    backgroundColor: 'rgba(255,255,255,.4)'
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
    top: -43,
    left: 6,
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
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between'
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
  }
})
