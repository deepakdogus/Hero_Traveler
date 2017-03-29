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
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: Colors.coal,

  },
  previewImage: {
    flexDirection: "column",
    justifyContent: "flex-end"
  },
  gradient: {
    paddingHorizontal: Metrics.doubleBaseMargin,
    paddingVertical: Metrics.doubleBaseMargin
  },
  title: {
    fontSize: 32,
    fontWeight: "200",
    fontFamily: Fonts.type.montserrat,
    color: "white",
    letterSpacing: 1.5
  },
  subtitle: {
    fontSize: 12,
    color: "#e0e0e0",
    fontFamily: Fonts.type.sourceSansPro,
    letterSpacing:0.7
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
    width: "90%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  thumbnailImage: {
    height: 50,
    width: 30,
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 20,
    marginRight: 20
  },
  username: {
    color: "#e0e0e0",
    fontWeight: "300",
    fontSize: 15,
    fontFamily: Fonts.type.sourceSansPro
  },
  bottomRight: {
    color: "#e0e0e0",
    marginRight: 5,
    fontFamily: Fonts.type.crimsonText
  },
  icon: {
    alignSelf: "center",
  },

  timeSince: {
    marginRight: Metrics.doubleBaseMargin
  },
  tagline: {
    ...Fonts.style.h1,
    color: Colors.steel
  }
})
