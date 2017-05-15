import { StyleSheet } from 'react-native'
import { Colors, ApplicationStyles, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  scrollView: {
    flex: 1,
    // paddingTop: Metrics.titlePadding
  },
  column: {
    flex: 1,
    alignItems: "center"
  },
  iconContainer: {
    marginLeft: 30,
    marginTop: 40
  },
  usernameContainer:{
    marginTop: 60,
    alignItems: "center",
  },
  username: {
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: Fonts.type.sourceSansPro
  },
  divider: {
    backgroundColor: 'black',
    marginTop: 20,
    width: "10%",
    height: 1
  },
  bioContainer: {
    marginTop: 20,
    width: "60%",
  },
  bio: {
    fontSize: 14,
    lineHeight: 1.5,
    color: Colors.coal,
    fontFamily: Fonts.type.sourceSansPro,
  },
  // divider: {
  //   height: 1,
  //   width: 300,
  //   backgroundColor: "#fff",
  //   opacity: 0.5
  // },
  // detailContainer: {
  //   width: 300,
  //   marginTop: 10,
  //   flexDirection: "row",
  //   justifyContent: "space-between"
  // },
  // row: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  // },
})
