import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts } from '../../Shared/Themes/'

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: Metrics.baseMargin,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.backgroundDark,
  },
  listContainer: {
    paddingBottom: Metrics.baseMargin,
  },
  contentContainer: {
    position: 'relative',
    marginLeft: Metrics.marginHorizontal / 2,
    alignSelf: 'center',
    width: Metrics.postCard.listing.cardWidth,
    height: '100%',
    borderRadius: 3,
    overflow: 'hidden',
  },
  innerContainer: {
    width: '100%',
    height: '100%',
  },
  formContainer: {
    padding: Metrics.doubleBaseMargin,
  },
  firstContentContainer: {
    marginLeft: Metrics.marginLeft,
  },
  lastContentContainer: {
    marginRight: Metrics.marginRight,
  },
  overlayContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    paddingLeft: Metrics.paddingLeft,
    paddingRight: Metrics.paddingRight,
  },
  caption: {
    position: 'absolute',
    bottom: Metrics.baseMargin / 2,
    left: Metrics.baseMargin / 2,
    fontFamily: Fonts.type.base,
    fontSize: Fonts.size.medium,
    fontWeight: 'bold',
    textAlign: 'left',
    color: Colors.white,
  },
  message: {
    marginTop: Metrics.baseMargin,
    marginHorizontal: Metrics.baseMargin,
    textAlign: 'center',
    fontFamily: Fonts.type.base,
    fontSize: Fonts.size.regular,
    fontWeight: 'bold',
    color: Colors.steel,
  },
  icon: {
    color: Colors.steel,
  },
  titleInput: {
    color: Colors.white,
    fontSize: 20,
    fontFamily: Fonts.type.montserrat,
    fontWeight: '600',
    lineHeight: 33,
    marginTop: 15,
    paddingTop: 0,
  },
  navBarStyle: {
    height: Metrics.navBarHeight + 20,
    paddingTop: 0,
    color: Colors.snow,
    backgroundColor: Colors.transparent,
  },
  navBarTitleStyle: {
    display: 'none',
  },
  navBarLeftTextStyle: {
    color: Colors.white,
    justifyContent: 'flex-start',
  },
  navBarRightTextStyle: {
    color: Colors.snow,
    justifyContent: 'flex-end',
  },
  locationInputStyle: {
    borderWidth: 0,
    color: Colors.white,
  },
})
