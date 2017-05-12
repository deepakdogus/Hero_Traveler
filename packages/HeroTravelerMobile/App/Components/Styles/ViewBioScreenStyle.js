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
    flexDirection: "column",
    alignItems: "center"
  },
  usernameContainer:{
    marginTop: 60
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
  bio: {
    marginTop: 20,
    fontSize: 12,
    lineHeight: 1.5,
    color: Colors.steel,
    fontFamily: Fonts.type.sourceSansPro,
    width: "60%",
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
