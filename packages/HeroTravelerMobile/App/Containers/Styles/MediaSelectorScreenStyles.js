import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Fonts, Metrics } from '../../Shared/Themes/'
import { isIPhoneX } from '../../Themes/Metrics'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    flex: 1,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.feedDividerGrey,
  },
  tabbar: {
    height: Metrics.tabBarHeight,
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: isIPhoneX() ? 'flex-start' : 'center',
    backgroundColor: Colors.snow,
    borderTopWidth: 1,
    borderTopColor: Colors.feedDividerGrey,
  },
  tabbarButton: {
    height: 55,
    flex: 0.5,
  },
  tabbarText: {
    flex: 1,
    height: 55,
    lineHeight: 55,
    letterSpacing: 1.5,
    color: Colors.background,
    textAlign: 'center',
    fontSize: 15,
    fontFamily: Fonts.type.montserrat,
    fontWeight: '500',
  },
  tabbarTextNotSelected: {
    color: Colors.signupGrey,
  },
  imageWrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  retakeButtonText: {
    color: Colors.snow,
    fontSize: 13,
    fontFamily: Fonts.type.montserrat,
  },
  retakeButton: {
    backgroundColor: Colors.blackoutTint,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: 95,
    height: 35,
    marginBottom: 130,
  },

  notAuthorizedWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notAuthorizedText: {
    ...ApplicationStyles.screen.titleText,
    color: Colors.navBarText,
    textAlign: 'center',
    padding: 20,
  },
  rightTextNoIcon: {
    paddingRight: 20,
  },
  rightTextWithIcon: {
    paddingRight: 5,
  },
})
