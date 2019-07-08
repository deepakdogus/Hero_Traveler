import { StyleSheet } from 'react-native'
import { ApplicationStyles, Fonts, Colors, Metrics } from '../../Shared/Themes/'

const coverInnerHeight = 370
const tabNavEditHeight = 50
const profileEditHeight = 150

export const storyPreviewHeight
  = Metrics.screenHeight
  - coverInnerHeight
  - tabNavEditHeight
  - Metrics.tabBarHeight

// Don't forget to update ProfileTabAndStories.getHeaderHeight() if
// related styles change. (username, about, badge, error, etc.)

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    backgroundColor: Colors.clear,
  },

  gradientWrapper: {
    flex: 1,
    backgroundColor: Colors.clear,
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
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingVertical: Metrics.baseMargin * 1.5,
    borderBottomColor: Colors.lightGreyAreas,
    borderBottomWidth: 1,
  },
  inputLabel: {
    ...Fonts.style.inputLabels,
    flexShrink: 1,
    fontWeight: '600',
    fontSize: 15,
    color: Colors.background,
    marginBottom: 10,
  },
  input: {
    ...Fonts.style.inputLabels,
    flexShrink: 1,
    fontWeight: '400',
    fontSize: 15,
    marginTop: 2,
    color: Colors.bioGrey,
  },
  error: {
    marginTop: Metrics.marginVertical,
    marginBottom: -25.5,
    paddingRight: Metrics.baseMargin,
    color: Colors.errorRed,
    fontSize: 12,
    textAlign: 'center',
  },
  errorView: {
    position: 'absolute',
    right: 0,
    bottom: 55,
  },
  flexOne: {
    flex: 1,
  },
  navbarStyle: {
    paddingTop: 15,
  },
  topBorder: {
    borderTopWidth: 1,
    borderTopColor: Colors.feedDividerGrey,
  },
  subtitle: {
    ...Fonts.style.instructions,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
  },
  radioGroup: {
    marginLeft: Metrics.section,
    marginRight: Metrics.section,
  },
  radioButtonContainer: {
    paddingTop: 5,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioWithTextInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioTextInputContainer: {
    marginTop: 5,
    flex: 1,
    justifyContent: 'center',
    height: 25,
    marginLeft: Metrics.baseMargin,
    marginBottom: Metrics.baseMargin,
    borderBottomWidth: 1,
    borderBottomColor: Colors.whiteAlphaPt3,
    borderStyle: 'solid',
  },
})
