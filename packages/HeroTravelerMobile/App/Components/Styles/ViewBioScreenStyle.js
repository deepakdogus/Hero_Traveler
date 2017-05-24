import { StyleSheet } from 'react-native'
import { Colors, ApplicationStyles, Fonts, Metrics } from '../../Themes/'

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
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: Fonts.type.sourceSansPro,
    textAlign: 'center'
  },
  divider: {
    backgroundColor: 'black',
    marginTop: Metrics.section,
    width: "10%",
    height: 1
  },
  bioContainer: {
    marginVertical: Metrics.section,
    marginHorizontal: Metrics.doubleSection
  },
  bio: {
    fontSize: 14,
    color: Colors.coal,
    fontFamily: Fonts.type.sourceSansPro,
  },
})
