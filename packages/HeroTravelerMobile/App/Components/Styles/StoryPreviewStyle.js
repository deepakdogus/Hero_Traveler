import { StyleSheet } from 'react-native'
import { Colors, Metrics, ApplicationStyles, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  scrollView: {
    flex: 1,
    // paddingTop: Metrics.titlePadding
  },
  storyPreviewContainer: {
    height: Metrics.screenHeight - Metrics.navBarHeight - 20,
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row"
  },
  previewImage: {
    flexDirection: "column",
    justifyContent: "flex-end"
  },
  previewInfo: {
    padding: 16,
    paddingBottom: Metrics.navBarHeight + 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "200",
    fontFamily: Fonts.type.montserrat,
    color: "white",
    letterSpacing: 1.5
  },
  subtitle: {
    fontSize: 16,
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  avatar: {
    height: 36,
    width: 36,
    borderRadius: 18,
    marginRight: 5
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
  tagline: {
    ...Fonts.style.h1,
    color: Colors.steel
  }
})
