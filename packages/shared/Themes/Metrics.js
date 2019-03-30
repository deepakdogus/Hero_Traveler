import _ from 'lodash'
import platformSpecificMetrics from '../../Themes/Metrics'

// Used via Metrics.baseMargin
const metrics = {
  marginHorizontal: 10,
  marginVertical: 10,
  section: 25,
  baseMargin: 10,
  doubleBaseMargin: 20,
  smallMargin: 5,
  doubleSection: 50,
  horizontalLineHeight: 1,
  searchBarHeight: 30,
  statusBarHeight: 20,
  mainNavHeight: 42,
  tabBarHeight: 50,
  editorToolbarHeight: 50,
  buttonRadius: 4,
  icons: {
    tiny: 15,
    small: 20,
    medium: 30,
    large: 45,
    xl: 50,
  },
  images: {
    small: 20,
    medium: 40,
    large: 60,
    logo: 200,
  },
  rightModalWidth: 570,
  pixelRatio: 1,
  storyCover: {
    fullScreen: {
        height: 415,
    },
    feed: {
      imageTypeHeight: 415,
      // videoTypeHeight: 282,
      videoTypeHeight: platformSpecificMetrics.screenWidth * 9 / 16,
    },
  },
  postCard: {
    listing: {
      cardWidth: platformSpecificMetrics.screenWidth / 4 + 8,
      cardMarginBottom: 15,
      sliderWidth: platformSpecificMetrics.screenWidth,
      sliderItemWidth: platformSpecificMetrics.screenWidth,
    }
  },
  feedCell: {
    imageCellHeight: 390, // Should be imageTypeHeight
    videoCellHeight: platformSpecificMetrics.screenWidth * 9 / 16, // Should be videoTypeHeight
    padding: 152, // The heights of the bottom bar in feed
  },
}

_.assign(metrics, platformSpecificMetrics)
metrics.maxContentHeight = metrics.screenHeight - metrics.editorToolbarHeight - metrics.mainNavHeight - metrics.statusBarHeight - 90

export default metrics
