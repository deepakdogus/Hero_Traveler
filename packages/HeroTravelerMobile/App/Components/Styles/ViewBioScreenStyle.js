import { StyleSheet } from 'react-native'
import { Colors, ApplicationStyles, Fonts, Metrics } from '../../Shared/Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  scrollView: {
    flex: 1,
    flexDirection: 'column'
    // paddingTop: Metrics.titlePadding
  },
  iconContainer: {
    margin: Metrics.section
  },
  usernameContainer:{
    // flex: 1,
    // marginTop: 60,
    alignItems: 'center'
  },
  username: {
    fontSize: 21,
    fontFamily: Fonts.type.montserrat,
    color: Colors.background,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  divider: {
    backgroundColor: 'black',
    marginTop: Metrics.section,
    width: "10%",
    height: 1
  },
  bioContainer: {
    marginVertical: Metrics.section,
    marginHorizontal: 30,
  },
  bio: {
    fontWeight: '300',
    fontSize: 18,
    fontFamily: Fonts.type.sourceSansPro,
    letterSpacing: .7,
    color: Colors.grey,
  },
})
