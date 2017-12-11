import { StyleSheet } from 'react-native'
import { ApplicationStyles, Fonts, Colors, Metrics } from '../../Shared/Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    backgroundColor: Colors.backgroundDark,
    top: -10,
  },
  scrollItemFullScreen: {
    width: Metrics.screenWidth,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  message: {
    fontSize: 24,
    color: '#fff'
  },
  tabnav: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  tab: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '25%',
    backgroundColor: Colors.background,
    borderBottomWidth: 3,
    borderBottomColor: Colors.background,
  },
  tabText: {
    fontFamily: Fonts.type.montserrat,
    color: Colors.grey,
    fontSize: 13,
    letterSpacing: 1.2,
    textAlign: 'center'
  },
  tabSelected: {
    borderBottomColor: Colors.red
  },
  tabTextSelected: {
    fontFamily: Fonts.type.montserrat,
    color: '#bdbdbd',
    fontSize: 13,
    letterSpacing: 1.2,
  },
  navbarRightTextStyle: {
    fontFamily: Fonts.type.montserrat,
    fontSize: 11,
    fontWeight: '600',
    color: Colors.snow,
  },
  navbarContainer: {
    marginTop: 10,
  },
  navbarLeftIconStyle: {
    tintColor: Colors.navBarText
  },
  navbarTitleStyle: {
    fontSize: 18,
    letterSpacing: 1,
  }
})
