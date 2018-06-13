import { StyleSheet } from 'react-native'
import { ApplicationStyles, Fonts, Colors, Metrics } from '../../Shared/Themes/'

const coverInnerHeight = 370
const tabNavEditHeight = 50
const profileEditHeight = 150

export const storyPreviewHeight = Metrics.screenHeight - coverInnerHeight - tabNavEditHeight - Metrics.tabBarHeight

// Don't forget to update ProfileTabAndStories.getHeaderHeight() if
// related styles change. (username, about, badge, error, etc.)

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    backgroundColor: Colors.clear
  },


  gradientWrapper: {
    flex: 1,
    backgroundColor: Colors.clear
  },

  // Profile Bar

  profileWrapper: {
    flexDirection: 'row',
    paddingHorizontal: Metrics.baseMargin * 2,
    borderBottomColor: Colors.lightGreyAreas,
    borderBottomWidth: 1,
  },
  avatarWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: Metrics.baseMargin * 2,
  },
  avatar: {
    flexShrink: 1,
  },
  addAvatarPhotoButton: {
    position: 'absolute',
    justifyContent: 'center',
    marginLeft: 30,
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  avatarEditTextWrapper: {
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },
  avatarEditText: {
    alignSelf: 'flex-start',
    marginLeft: 30,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.redLight,
  },

  // Form

  form: {
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  inputWrapper: {
    flexShrink: 1,
    width: '100%',
    paddingHorizontal: Metrics.section,
    paddingVertical: Metrics.marginVertical,
    borderBottomColor: Colors.lightGreyAreas,
    borderBottomWidth: 1,
  },
  inputLabel: {
    ...Fonts.style.inputLabels,
    flexShrink: 1,
    fontWeight: '600',
    color: Colors.coal,
  },
  input: {
    ...Fonts.style.inputLabels,
    flexShrink: 1,
    fontWeight: '500',
    color: Colors.charcoal,
  },
  error: {
    marginTop: Metrics.marginVertical,
    marginBottom: -25.5,
    paddingRight: Metrics.baseMargin,
    color: Colors.errorRed,
    fontSize: 12,
    textAlign: 'center'
  },
  errorView: {
    position: 'absolute',
    right: 0,
    bottom: 55
  },

  // profileInfoContainer: {},
  // profileEditInfoContainer: {
  //   height: profileEditHeight,
  //   flexDirection: 'column',
  //   justifyContent: 'center',
  // },
  // secondRow: {
  //   justifyContent: 'space-between',
  //   marginBottom: 12.5,
  //   marginTop: 12.5,
  // },
  // bioWrapper: {
  //   borderTopColor: Colors.lightGrey,
  //   borderTopWidth: 1,
  //   padding: Metrics.section,
  //   backgroundColor: Colors.feedDividerGrey,
  //   flex: 1,
  //   minHeight: Metrics.screenHeight - Metrics.navBarHeight - profileEditHeight,
  // },
  // badgeRow: {
  //   alignItems: 'center',
  //   marginTop: 5,
  // },
  // badgeImage: {
  //   width: 16,
  //   height: 16,
  // },
  // badgeText: {
  //   marginLeft: 5,
  //   fontFamily: Fonts.type.montserrat,
  //   fontWeight: '600',
  //   fontSize: 8,
  //   color: Colors.background,
  //   textAlign: 'center'
  // },
  // storyList: {
  //   height: Metrics.screenHeight - Metrics.tabBarHeight,
  //   marginBottom: Metrics.tabBarHeight + Metrics.baseMargin,
  // },
  flexOne: {
    flex: 1,
  },
  navbarStyle: {
    paddingTop: 15,
  },
})
