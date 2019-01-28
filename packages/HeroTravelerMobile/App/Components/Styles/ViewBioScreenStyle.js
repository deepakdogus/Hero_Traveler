import { StyleSheet } from 'react-native'
import { Colors, ApplicationStyles, Fonts, Metrics } from '../../Shared/Themes/'
import { isIPhoneX } from '../../Themes/Metrics'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  scrollView: {
    flex: 1,
    flexDirection: 'column',
    // paddingTop: Metrics.titlePadding
  },
  iconContainer: {
    margin: Metrics.section,
    marginTop: isIPhoneX() ? Metrics.section + 15 : Metrics.section,
  },
  usernameContainer: {
    // flex: 1,
    // marginTop: 60,
    alignItems: 'center',
  },
  username: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: Fonts.type.montserrat,
    color: Colors.background,
    textAlign: 'center',
  },
  divider: {
    backgroundColor: 'black',
    marginTop: Metrics.section,
    width: '10%',
    height: 1,
  },
  bioContainer: {
    marginVertical: Metrics.section,
    marginHorizontal: 30,
    width: '100%',
  },
  bio: {
    fontWeight: '400',
    fontSize: 16,
    fontFamily: Fonts.type.sourceSansPro,
    letterSpacing: 0.7,
    color: Colors.grey,
    marginHorizontal: 30,
  },
})
