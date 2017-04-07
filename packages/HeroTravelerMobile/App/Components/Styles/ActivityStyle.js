
import { StyleSheet } from 'react-native'
import { Colors, Metrics, ApplicationStyles, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  scrollView: {
    flex: 1,
    // paddingTop: Metrics.titlePadding
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row"
  },
  previewImage: {
    flexDirection: "column",
  },
  gradient: {
    paddingHorizontal: Metrics.doubleBaseMargin,
    paddingVertical: Metrics.doubleBaseMargin
  },
  bold: {
    fontWeight: "bold"
  },
  title: {
    fontSize: 14,
    fontWeight: "200",
    fontFamily: Fonts.type.montserrat,
    marginLeft: 5,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.charcoal,
    fontFamily: Fonts.type.sourceSansPro,
    letterSpacing:0.7,
    marginLeft: 10,

  },
  divider: {
    height: 1,
    width: 300,
    backgroundColor: "#fff",
    opacity: 0.5
  },
  detailContainer: {
    width: 300,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  avatar: {
    height: 36,
    width: 36,
    borderRadius: 18,
    marginRight: 10
  },
  username: {
    color: "#e0e0e0",
    fontWeight: "300",
    fontSize: 15,
    fontFamily: Fonts.type.sourceSansPro
  },
  tagline: {
    ...Fonts.style.h1,
    color: Colors.steel
  }
})
